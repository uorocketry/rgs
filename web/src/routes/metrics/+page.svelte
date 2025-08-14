<script lang="ts">
  import { onMount } from 'svelte';
  import { LineChart, ScaleTypes, type LineChartOptions } from '@carbon/charts-svelte';
  import "@carbon/charts-svelte/styles.min.css";
import { carbonTheme } from '$lib/common/theme';
import { get } from 'svelte/store';
  
  // Carbon Components
  import { Grid, Row, Column, Select, SelectItem, NumberInput, Tile } from 'carbon-components-svelte';

  type MetricKind = 'radio_rssi' | 'radio_packets_lost' | 'sbg_altitude' | 'sbg_temperature';

  let selectedMetric = $state<MetricKind>('radio_rssi');
  let maxPoints = $state(200);
  type CarbonPoint = { group: string; date: Date; value: number };
  let data = $state<CarbonPoint[]>([]);


  // Reactive chart options that update when theme changes
  let options = $derived<LineChartOptions>({
    title: 'Live Metrics',
    axes: {
      bottom: { title: 'Time', mapsTo: 'date', scaleType: ScaleTypes.TIME },
      left: { mapsTo: 'value', title: 'Value' }
    },
    legend: { enabled: false },
    points: { enabled: false },
    height: '100%',
    theme: get(carbonTheme)
  });

  let evtSrc: EventSource | null = null;

  function connect() {
    evtSrc?.close();
    data = [];
    // Build SSE URL with query params
    const url = new URL('/metrics/api', window.location.origin);
    url.searchParams.set('metric', selectedMetric);
    url.searchParams.set('limit', String(maxPoints));

    evtSrc = new EventSource(url.toString());
    evtSrc.onmessage = (ev) => {
      try {
        const msg = JSON.parse(ev.data);
        // Expect { t: number (seconds), v: number }
        const date = new Date((msg.t ?? 0) * 1000);
        const v = Number(msg.v);
        if (!Number.isFinite(v)) return;
        data = [...data, { group: selectedMetric, date, value: v }].slice(-maxPoints);
      } catch (e) {
        console.error('Invalid SSE payload', e);
      }
    };
    evtSrc.onerror = () => {
      // Auto-reconnect after short delay
      evtSrc?.close();
      setTimeout(connect, 1000);
    };
  }

  onMount(() => {
    connect();
    const unsubscribe = carbonTheme.subscribe(() => {});
    return () => {
      evtSrc?.close();
      unsubscribe();
    };
  });

  function onMetricChange(e: Event) {
    selectedMetric = (e.target as HTMLSelectElement).value as MetricKind;
    connect();
  }

  function onPointsChange(e: Event) {
    const val = Number((e.target as HTMLInputElement).value);
    if (val > 0 && val <= 5000) {
      maxPoints = val;
      connect();
    }
  }
</script>



<svelte:head>
  <title>Metrics</title>
  <meta name="description" content="Live metrics charts" />
  <style>
    .cc-tooltip { z-index: 50; }
  </style>
</svelte:head>

<Grid style="height: 100%; padding: 1rem;">
  <Row>
    <Column sm={4} md={8} lg={16}>
      <Tile style="margin-bottom: 1rem;">
        <Grid>
          <Row>
            <Column sm={2} md={4} lg={8}>
              <Select
                labelText="Metric"
                bind:selected={selectedMetric}
                on:change={onMetricChange}
              >
                <SelectItem value="radio_rssi" text="Radio RSSI" />
                <SelectItem value="radio_packets_lost" text="Radio Packets Lost" />
                <SelectItem value="sbg_altitude" text="SBG Altitude" />
                <SelectItem value="sbg_temperature" text="SBG Air Temperature" />
              </Select>
            </Column>
            <Column sm={2} md={4} lg={8}>
              <NumberInput
                label="Max Points"
                bind:value={maxPoints}
                min={50}
                max={5000}
                step={50}
                on:change={onPointsChange}
              />
            </Column>
          </Row>
        </Grid>
      </Tile>
    </Column>
  </Row>
  
  <Row style="flex: 1; min-height: 0;">
    <Column sm={4} md={8} lg={16} style="height: 100%;">
      <Tile style="height: 100%; padding: 1rem;">
        <div style="height: 100%;">
          <LineChart {data} {options} />
        </div>
      </Tile>
    </Column>
  </Row>
</Grid>


