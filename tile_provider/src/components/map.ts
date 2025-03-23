import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { html, render } from 'lit-html';

interface DownloadState {
  id: string;
  lat: number;
  lon: number;
  minZoom: number;
  maxZoom: number;
  radius: number;
  downloaded: number;
  total: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled' | 'failed';
  error?: string;
}

let container: HTMLElement | null = null;
let map: L.Map | null = null;
let minZoom = 1;
let maxZoom = 19;
let radius = 5;
let downloadCircle: L.Circle | null = null;
let currentDownloadState: DownloadState | null = null;
let statusPollInterval: number | null = null;

// State persistence
function saveState() {
  if (!map) return;
  const center = map.getCenter();
  const state = {
    center: {
      lat: center.lat,
      lng: center.lng
    },
    zoom: map.getZoom(),
    minZoom,
    maxZoom,
    radius,
    downloadState: currentDownloadState
  };
  localStorage.setItem('mapState', JSON.stringify(state));
}

function restoreState() {
  const savedState = localStorage.getItem('mapState');
  if (!savedState) return;

  try {
    const state = JSON.parse(savedState);

    // Validate and set zoom levels with defaults
    minZoom = Number.isInteger(state.minZoom) ? Math.max(0, Math.min(19, state.minZoom)) : 1;
    maxZoom = Number.isInteger(state.maxZoom) ? Math.max(0, Math.min(19, state.maxZoom)) : 19;
    if (minZoom > maxZoom) {
      minZoom = 1;
      maxZoom = 19;
    }

    // Validate and set radius with default
    radius = Number.isFinite(state.radius) ? Math.max(0.1, Math.min(25, state.radius)) : 5;

    // Validate and set center coordinates
    if (state.center &&
      typeof state.center.lat === 'number' &&
      typeof state.center.lng === 'number' &&
      !isNaN(state.center.lat) &&
      !isNaN(state.center.lng)) {
      if (map) {
        map.setView([state.center.lat, state.center.lng], state.zoom || 2);
      }
    }

    // Validate and restore download state
    if (state.downloadState &&
      typeof state.downloadState.lat === 'number' &&
      typeof state.downloadState.lon === 'number' &&
      !isNaN(state.downloadState.lat) &&
      !isNaN(state.downloadState.lon)) {
      const validatedState: DownloadState = {
        ...state.downloadState,
        lat: state.downloadState.lat,
        lon: state.downloadState.lon,
        radius: Number.isFinite(state.downloadState.radius) ?
          Math.max(0.1, Math.min(25, state.downloadState.radius)) : 5
      };
      currentDownloadState = validatedState;

      if (map) {
        const center = L.latLng(validatedState.lat, validatedState.lon);
        downloadCircle = L.circle(center, {
          radius: validatedState.radius * 1000,
          color: '#3388ff',
          fillColor: '#3388ff',
          fillOpacity: 0.2,
          weight: 2,
          dashArray: '5, 10',
        }).addTo(map);

        if (validatedState.status === 'processing') {
          startStatusPolling(validatedState.id);
        }
      }
    }
  } catch (error) {
    console.error('Error restoring state:', error);
    // Clear invalid state
    localStorage.removeItem('mapState');
  }
}

function clearDownloadState() {
  if (statusPollInterval) {
    clearInterval(statusPollInterval);
    statusPollInterval = null;
  }
  currentDownloadState = null;
  saveState();
  renderControlContent();
}

function startStatusPolling(jobId: string) {
  if (statusPollInterval) {
    clearInterval(statusPollInterval);
  }

  statusPollInterval = window.setInterval(async () => {
    try {
      const response = await fetch(`/api/download/${jobId}/status`);
      if (!response.ok) {
        throw new Error('Failed to fetch job status');
      }

      const job = await response.json();
      if (!job) {
        throw new Error('No job data received');
      }

      // Update the current download state with the job status
      if (currentDownloadState) {
        currentDownloadState = {
          ...currentDownloadState,
          ...job,
          downloaded: job.downloaded || 0,
          total: job.total || 0,
          status: job.status || 'failed',
          error: job.error
        };
        saveState();
        renderControlContent();

        // Stop polling if the job is no longer processing
        if (job.status !== 'processing') {
          if (statusPollInterval) {
            clearInterval(statusPollInterval);
            statusPollInterval = null;
          }
        }
      }
    } catch (error) {
      console.error('Error polling job status:', error);
      if (currentDownloadState) {
        currentDownloadState.status = 'failed';
        currentDownloadState.error = error instanceof Error ? error.message : 'Failed to fetch job status';
        saveState();
        renderControlContent();
      }
      if (statusPollInterval) {
        clearInterval(statusPollInterval);
        statusPollInterval = null;
      }
    }
  }, 1000);
}

function renderControlContent() {
  if (!container) return;

  const content = html`
    <h3>Download Settings</h3>
    <label for="min-zoom">Minimum Zoom Level:</label>
    <input 
      type="number" 
      id="min-zoom" 
      value=${minZoom} 
      min="0" 
      max="19"
      @change=${handleMinZoomChange}
    >
    <label for="max-zoom">Maximum Zoom Level:</label>
    <input 
      type="number" 
      id="max-zoom" 
      value=${maxZoom} 
      min="0" 
      max="19"
      @change=${handleMaxZoomChange}
    >
    <label for="radius">Radius:</label>
    <div class="radius-control">
      <input 
        type="range" 
        id="radius" 
        value=${radius} 
        min="0.1" 
        max="25"
        step="0.1"
        @input=${handleRadiusChange}
        class="radius-slider"
      >
      <span class="radius-value">${radius.toFixed(1)}km</span>
    </div>
    <div class="button-group">
      <button 
        @click=${handleDownload}
        ?disabled=${!downloadCircle || currentDownloadState?.status === 'processing'}
        class="download-button"
      >
        Download
      </button>
      ${currentDownloadState?.status === 'processing' ? html`
        <button 
          @click=${handleCancelDownload}
          class="cancel-button"
        >
          Cancel
        </button>
      ` : ''}
    </div>
    ${currentDownloadState ? html`
      <div class="download-progress">
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${currentDownloadState.total > 0 ? (currentDownloadState.downloaded / currentDownloadState.total) * 100 : 0}%"></div>
        </div>
        <div class="progress-text">
          ${currentDownloadState.downloaded}/${currentDownloadState.total} tiles
        </div>
        <div class="download-config">
          <div>Lat: ${currentDownloadState.lat.toFixed(6)}</div>
          <div>Lon: ${currentDownloadState.lon.toFixed(6)}</div>
          <div>Zoom: ${currentDownloadState.minZoom}-${currentDownloadState.maxZoom}</div>
          <div>Radius: ${currentDownloadState.radius.toFixed(1)}km</div>
        </div>
        ${currentDownloadState.status === 'failed' ? html`
          <div class="retry-section">
            <button 
              @click=${handleRetryDownload}
              class="retry-button"
            >
              🔄 Retry Download
            </button>
          </div>
        ` : ''}
        ${currentDownloadState.status !== 'processing' ? html`
          <div class="clear-section">
            <button 
              @click=${clearDownloadState}
              class="clear-button"
            >
              🗑️ Clear
            </button>
          </div>
        ` : ''}
      </div>
    ` : ''}
    ${currentDownloadState?.status ? html`
      <div class="download-status ${currentDownloadState.status === 'failed' ? 'error' : currentDownloadState.status === 'completed' ? 'success' : ''}">
        ${currentDownloadState.status}
      </div>
    ` : ''}
  `;

  render(content, container);
}

function updateTemplate() {
  const template = html`
    <style>
      .map-container {
        height: 100vh;
        width: 100%;
        position: relative;
      }
      #map {
        height: 100%;
        width: 100%;
        position: absolute;
        top: 0;
        left: 0;
      }
      .download-control {
        background-color: white;
        padding: 10px;
        width: 300px;
        border-radius: 5px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
      }
      .download-control h3 {
        margin-top: 0;
        margin-bottom: 15px;
        color: #333;
      }
      .download-control label {
        display: block;
        margin-bottom: 5px;
        font-weight: bold;
        color: #666;
      }
      .download-control input {
        width: 100%;
        padding: 8px;
        margin-bottom: 15px;
        border: 1px solid #ddd;
        border-radius: 4px;
        box-sizing: border-box;
      }
      .download-control input:focus {
        outline: none;
        border-color: #3388ff;
        box-shadow: 0 0 0 2px rgba(51, 136, 255, 0.2);
      }
      .radius-control {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 15px;
      }
      .radius-slider {
        flex: 1;
        -webkit-appearance: none;
        width: 100%;
        height: 20px;
        background: #ddd;
        border-radius: 4px;
        outline: none;
      }
      .radius-slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 20px;
        height: 20px;
        background: #3388ff;
        border-radius: 4px;
        cursor: pointer;
        transition: background-color 0.2s;
      }
      .radius-slider::-webkit-slider-thumb:hover {
        background: #2377e4;
      }
      .radius-value {
        min-width: 60px;
        text-align: right;
        font-weight: bold;
        color: #3388ff;
      }
      .download-button, .cancel-button {
        flex: 1;
        padding: 10px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-weight: bold;
        transition: all 0.2s ease;
      }
      .download-button {
        background-color: #3388ff;
        color: white;
      }
      .download-button:hover:not(:disabled) {
        background-color: #2377e4;
      }
      .download-button:disabled {
        background-color: #ccc;
        cursor: not-allowed;
        opacity: 0.7;
      }
      .cancel-button {
        background-color: #dc3545;
        color: white;
      }
      .cancel-button:hover {
        background-color: #c82333;
      }
      .download-progress {
        margin-top: 15px;
        padding: 10px;
        background: #f8f9fa;
        border-radius: 4px;
      }
      .progress-bar {
        height: 20px;
        background: #e9ecef;
        border-radius: 10px;
        overflow: hidden;
        margin-bottom: 5px;
      }
      .progress-fill {
        height: 100%;
        background: #28a745;
        transition: width 0.3s ease;
      }
      .progress-text {
        text-align: center;
        font-weight: bold;
        color: #666;
        margin-bottom: 5px;
      }
      .download-config {
        font-size: 0.9em;
        color: #666;
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 5px;
      }
      .download-status {
        margin-top: 10px;
        padding: 10px;
        background: #f8f9fa;
        border-radius: 4px;
        font-size: 0.9em;
        color: #666;
      }
      .download-status.error {
        background: #fff5f5;
        color: #dc3545;
      }
      .download-status.success {
        background: #f0fff4;
        color: #28a745;
      }
      .retry-section, .clear-section {
        margin-top: 10px;
        text-align: center;
      }
      .retry-button, .clear-button {
        padding: 8px 16px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-weight: bold;
        transition: all 0.2s ease;
      }
      .retry-button {
        background-color: #28a745;
        color: white;
      }
      .retry-button:hover {
        background-color: #218838;
      }
      .clear-button {
        background-color: #6c757d;
        color: white;
      }
      .clear-button:hover {
        background-color: #5a6268;
      }
    </style>
    <div class="map-container">
      <div id="map"></div>
    </div>
  `;
  return template;
}

async function handleRetryDownload() {
  if (!currentDownloadState || !map) return;

  // Restore the previous download configuration
  const center = L.latLng(currentDownloadState.lat, currentDownloadState.lon);
  if (downloadCircle) {
    map.removeLayer(downloadCircle);
  }
  downloadCircle = L.circle(center, {
    radius: currentDownloadState.radius * 1000,
    color: '#3388ff',
    fillColor: '#3388ff',
    fillOpacity: 0.2,
    weight: 2,
    dashArray: '5, 10',
  }).addTo(map);

  // Start the download
  await handleDownload();
}

async function handleDownload() {
  if (!map || !downloadCircle) return;

  const center = downloadCircle.getLatLng();
  const radius = downloadCircle.getRadius();

  // Initialize download state immediately
  currentDownloadState = {
    id: '', // Will be set when we get the response
    lat: center.lat,
    lon: center.lng,
    minZoom,
    maxZoom,
    radius: radius / 1000,
    downloaded: 0,
    total: 0,
    status: 'pending'
  };
  saveState();
  renderControlContent();

  try {
    const response = await fetch('/api/download', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        lat: center.lat,
        lon: center.lng,
        radiusKm: radius / 1000,
        minZoom,
        maxZoom,
      }),
    });

    if (!response.ok) {
      throw new Error('Download request failed');
    }

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.error || 'Download failed');
    }

    if (result.jobId && currentDownloadState) {
      currentDownloadState.id = result.jobId;
      currentDownloadState.status = 'processing';
      saveState();
      renderControlContent();
      startStatusPolling(result.jobId);
    }
  } catch (error) {
    console.error('Error starting download:', error);
    if (currentDownloadState) {
      currentDownloadState.status = 'failed';
      currentDownloadState.error = error instanceof Error ? error.message : 'Unknown error';
      saveState();
      renderControlContent();
    }
  }
}

async function handleCancelDownload() {
  if (!currentDownloadState) return;

  try {
    const response = await fetch(`/api/download/${currentDownloadState.id}/cancel`, {
      method: 'POST'
    });

    if (!response.ok) {
      throw new Error('Failed to cancel download');
    }

    const result = await response.json();
    if (result.success) {
      if (statusPollInterval) {
        clearInterval(statusPollInterval);
        statusPollInterval = null;
      }
      currentDownloadState.status = 'cancelled';
      saveState();
      renderControlContent();
    }
  } catch (error) {
    console.error('Error cancelling download:', error);
  }
}

function handleMinZoomChange(e: Event) {
  const input = e.target as HTMLInputElement;
  minZoom = parseInt(input.value);
  renderControlContent();
}

function handleMaxZoomChange(e: Event) {
  const input = e.target as HTMLInputElement;
  maxZoom = parseInt(input.value);
  renderControlContent();
}

function handleRadiusChange(e: Event) {
  const input = e.target as HTMLInputElement;
  radius = parseFloat(input.value);
  if (downloadCircle) {
    downloadCircle.setRadius(radius * 1000);
    renderControlContent();
  }
}

function handleMapClick(e: L.LeafletMouseEvent) {
  if (!map) return;

  // Don't create a new circle if we're currently downloading
  if (currentDownloadState?.status === 'processing') {
    return;
  }

  if (downloadCircle) {
    map.removeLayer(downloadCircle);
  }

  downloadCircle = L.circle(e.latlng, {
    radius: radius * 1000,
    color: '#3388ff',
    fillColor: '#3388ff',
    fillOpacity: 0.2,
    weight: 2,
    dashArray: '5, 10',
  }).addTo(map);

  renderControlContent();
}

const DownloadControl = L.Control.extend({
  options: {
    position: 'topright'
  },

  onAdd: function (map: L.Map) {
    container = L.DomUtil.create('div', 'leaflet-bar leaflet-control download-control');

    L.DomEvent.disableClickPropagation(container);
    L.DomEvent.disableScrollPropagation(container);

    renderControlContent();
    return container;
  }
});

export function render_map(element: HTMLElement) {
  const template = updateTemplate();
  render(template, element);

  if (!map) {
    map = L.map(element, {
      minZoom,
      maxZoom,
    }).setView([0, 0], 2);

    L.tileLayer('/tiles/{z}/{x}/{y}', {
      maxZoom,
      tileSize: 256
    }).addTo(map);

    map.on('click', handleMapClick);
    map.on('moveend', saveState);
    new DownloadControl().addTo(map);

    restoreState();
  }
}

