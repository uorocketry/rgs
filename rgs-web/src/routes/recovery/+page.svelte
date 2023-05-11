<script defer lang="ts" type="module">
  import L from "leaflet";
  import { LatLngBounds } from "leaflet";
  import { onInterval } from "$lib/common/utils";
  import { browser } from "$app/environment";
  import { onSocket } from "$lib/common/socket";
  import type { Message } from "../../../../hydra_provider/bindings/Message";
  import type { Sensor } from "../../../../hydra_provider/bindings/Sensor";
  import type { Data } from "../../../../hydra_provider/bindings/Data";

  let map: L.Map | null;

  const urlTemplate = "/api/tiles/{z}/{x}/{y}.png";

  const initialView: L.LatLngTuple = [48.8236, -81.1547];
  const blBound: L.LatLngTuple = [48.25185234761422, -81.83239949136214];
  const tlBound: L.LatLngTuple = [49.11214456878958, -80.82574599219527];

  const mockRocketPos: L.LatLngTuple = [48.48598684581202, -81.31160217615952];
  let mockRocketMarker: L.Marker<any>;

  const MAX_ZOOM = 14;
  const MIN_ZOOM = 5;
  const INITIAL_ZOOM = 10;

  let target: L.LatLngTuple = mockRocketPos;
  if (browser) {
    mockRocketMarker = L.marker(mockRocketPos, {
      icon: L.divIcon({
        // Maybe some custom checkpoints?
        html: "🚀",
        className: "bg-transparent text-3xl ",
      }),
    });

    onSocket("RocketMessage", (msg: Message) => {
      const data: Data = msg.data as { sensor: Sensor };
      if (data.sensor?.data?.Sbg == null) return;
      const sbg = data.sensor.data.Sbg;
      target = [sbg.latitude, sbg.longitude];
      console.log("Updating Rocket Position", target);
    });

    // Lerp the rocket marker to the target
    onInterval(() => {
      let curPos: L.LatLng = mockRocketMarker.getLatLng();
      const lerpFactor = 0.01;
      let lerpedPos: L.LatLngTuple = [
        curPos.lat + lerpFactor * (target[0] - curPos.lat),
        curPos.lng + lerpFactor * (target[1] - curPos.lng),
      ];
      mockRocketMarker.setLatLng(lerpedPos);
    }, 10);
  }

  // const bounds: L.LatLngBounds = new LatLngBounds(blBound, tlBound);

  function createMap(container: string | HTMLElement) {
    let m = L.map(container, {
      preferCanvas: true,
      worldCopyJump: true,
      minZoom: MIN_ZOOM,
      // maxBounds: bounds,
    }).setView(initialView, INITIAL_ZOOM);

    L.tileLayer(urlTemplate, {
      maxNativeZoom: MAX_ZOOM,
      minNativeZoom: MIN_ZOOM,
    }).addTo(m); // The actual satellite imagery

    return m;
  }

  let toolbar = new L.Control({ position: "topright" });
  toolbar.onAdd = (_: L.Map) => {
    let div = L.DomUtil.create("div");
    return div;
  };

  let markerLayers;
  let lineLayers;
  function mapAction(container: string | HTMLElement) {
    map = createMap(container);
    toolbar.addTo(map);

    mockRocketMarker.addTo(map);
    return {
      destroy: () => {
        toolbar.remove();
        map?.remove();
        map = null;
      },
    };
  }

  function resizeMap() {
    if (map) {
      map.invalidateSize();
    }
  }
</script>

<!-- See https://svelte.dev/repl/62271e8fda854e828f26d75625286bc3?version=3.50.1 -->
<svelte:window on:resize={resizeMap} />

<div class="map" style="height:100%;width:100%" use:mapAction />
