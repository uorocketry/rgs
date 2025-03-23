import { render_map } from "./components/map";

// Create and append the map container
const container = document.createElement('div');
container.id = 'map-container';
document.body.appendChild(container);

// Initialize the map
render_map(container);
