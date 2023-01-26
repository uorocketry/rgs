<!-- For a more tidy example -->
<script defer lang="ts" type="module">
  import { onSocket } from "$lib/common/utils";
  import { ClientSocket } from "$lib/common/ClientSocket";
  import { onDestroy, onMount } from "svelte";

  //   Leaflet
  import L from "leaflet";
  import { LatLng } from "leaflet";

  let lastLat: number = 0;
  let lastLon: number = 0;

  onMount(() => {
    ClientSocket.socket.emit("sub", "lat");
    ClientSocket.socket.emit("sub", "lon");
  });

  onDestroy(() => {
    ClientSocket.socket.emit("unsub", "lat");
    ClientSocket.socket.emit("unsub", "lon");
  });

  onSocket("put", (key, _, value) => {
    // console.log(key, timestamp, value);
    if (key == "lat") {
      lastLat = value;
    }
    if (key == "lon") {
      lastLon = value;
    }
  });

  let map: L.Map | null = null;

  const markerLocations = [
    new LatLng(29.8283, -96.5795),
    new LatLng(37.8283, -90.5795),
    new LatLng(43.8283, -102.5795),
    new LatLng(48.4, -122.5795),
    new LatLng(43.6, -79.5795),
    new LatLng(36.8283, -100.5795),
    new LatLng(38.4, -122.5795),
  ];

  // TODO: Use satellite map + offline tiles
  const initialView = new LatLng(39.8283, -98.5795);
  function createMap(container: string | HTMLElement) {
    let m = L.map(container, {
      preferCanvas: true,
      worldCopyJump: true,
    }).setView(initialView, 5);
    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
      {
        attribution: `&copy;<a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>,
	        &copy;<a href="https://carto.com/attributions" target="_blank">CARTO</a>`,
        subdomains: "abcd",
        maxZoom: 14,
      }
    ).addTo(m);

    return m;
  }

  let toolbar = new L.Control({ position: "topright" });
  toolbar.onAdd = (_: L.Map) => {
    let div = L.DomUtil.create("div");
    return div;
  };

  toolbar.onRemove = () => {
    // if (toolbarComponent) {
    //   toolbarComponent.$destroy();
    //   toolbarComponent = null;
    // }
  };

  function createLines() {
    return L.polyline(markerLocations, { color: "#E4E", opacity: 0.5 });
  }

  let realTimeLayer: L.LayerGroup;
  let realTimeMarker: L.Marker;
  $: {
    if (realTimeMarker) {
      realTimeMarker.setLatLng([lastLat, lastLon]);
    }
  }

  let markerLayers;
  let lineLayers;
  function mapAction(container: string | HTMLElement) {
    map = createMap(container);
    toolbar.addTo(map);

    markerLayers = L.layerGroup();
    for (let location of markerLocations) {
      let m = L.marker(location, {
        icon: L.divIcon({
          // Maybe some custom checkpoints?
          className: "fa-solid fa-location-dot fa-2xl",
        }),
      });
      markerLayers.addLayer(m);
    }

    realTimeLayer = L.layerGroup();
    realTimeMarker = L.marker([lastLat, lastLon], {
      icon: L.divIcon({
        // Rocket live position?
        className: "fa-solid fa-location-crosshairs fa-xl text-red-500",
      }),
    });
    realTimeLayer.addLayer(realTimeMarker);

    lineLayers = createLines();

    realTimeLayer.addTo(map);
    markerLayers.addTo(map);
    lineLayers.addTo(map);

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

<div class="prose bg-base-200 p-4 min-w-full">
  <h2>Last position reported</h2>

  <div class="stats shadow">
    <div class="stat place-items-center">
      <div class="stat-title">Latitude</div>
      <div class="stat-value">{lastLat.toFixed(2)}</div>
    </div>

    <div class="stat place-items-center">
      <div class="stat-title">Longitude</div>
      <div class="stat-value">{lastLon.toFixed(2)}</div>
    </div>
  </div>
</div>

<svelte:window on:resize={resizeMap} />
<link
  rel="stylesheet"
  href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css"
  integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ=="
  crossorigin=""
/>
<div class="map" style="height:100%;width:100%" use:mapAction />
