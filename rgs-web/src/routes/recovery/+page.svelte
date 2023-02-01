<script defer lang="ts" type="module">
  //   Leaflet
  import "./leaflet.css";
  import L from "leaflet";
  import { LatLngBounds } from "leaflet";
  import { onInterval } from "$lib/common/utils";
  import { browser } from "$app/environment";

  let map: L.Map | null;

  const urlTemplate = "/api/tiles/{z}/{x}/{y}.png";

  const initialView: L.LatLngTuple = [48.8236, -81.1547];
  const blBound: L.LatLngTuple = [48.25185234761422, -81.83239949136214];
  const tlBound: L.LatLngTuple = [49.11214456878958, -80.82574599219527];

  const mockRocketPos: L.LatLngTuple = [48.48598684581202, -81.31160217615952];
  let mockRocketMarker: L.Marker<any>;

  let target: L.LatLngTuple = mockRocketPos;
  if (browser) {
    mockRocketMarker = L.marker(mockRocketPos, {
      icon: L.divIcon({
        // Maybe some custom checkpoints?
        html: "🚀",
        className: "bg-transparent text-3xl ",
      }),
    });

    onInterval(() => {
      let randLat = blBound[0] + Math.random() * (tlBound[0] - blBound[0]);
      let randLng = blBound[1] + Math.random() * (tlBound[1] - blBound[1]);
      target = [randLat, randLng];
    }, 2000);

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

  const bounds: L.LatLngBounds = new LatLngBounds(blBound, tlBound);

  function createMap(container: string | HTMLElement) {
    let m = L.map(container, {
      preferCanvas: true,
      worldCopyJump: true,
      minZoom: 10,
      maxBounds: bounds,
    }).setView(initialView, 10);

    L.tileLayer(urlTemplate, {
      maxNativeZoom: 14,
      minNativeZoom: 10,
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
<svelte:window on:resize="{resizeMap}" />

<div class="map" style="height:100%;width:100%" use:mapAction></div>
