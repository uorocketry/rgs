import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import URDFLoader from 'urdf-loader';

// --- Scene Setup ---
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a1a2a);

// --- Camera Setup with Z-UP ---
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.up.set(0, 0, 1); // CRITICAL: Set the Z-axis as "up" for the entire scene
camera.position.set(5, -8, 5); // Adjusted initial position for a good Z-up view

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// --- Lighting (Unchanged) ---
scene.add(new THREE.AmbientLight(0x404040, 2));
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7.5);
scene.add(directionalLight);

// --- Grid and Labels for Z-UP World ---
const gridHelper = new THREE.GridHelper(10, 10);
gridHelper.rotation.x = Math.PI / 2; // Rotate the grid to lie on the X-Y plane
scene.add(gridHelper);

function createTextLabel(text, position, color) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    context.font = 'Bold 80px Arial';
    context.fillStyle = color;
    context.fillText(text, 0, 80);
    const texture = new THREE.CanvasTexture(canvas);
    const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.position.set(...position);
    sprite.scale.set(1.0, 0.5, 1.0);
    return sprite;
}
// Reposition labels for Z-up world (North is +Y, East is +X)
scene.add(createTextLabel('N', [0, 5.5, 0.1], 'red'));
scene.add(createTextLabel('S', [0, -5.5, 0.1], 'white'));
scene.add(createTextLabel('E', [5.5, 0, 0.1], 'white'));
scene.add(createTextLabel('W', [-5.5, 0, 0.1], 'white'));

// --- URDF Loader for Z-UP World ---
/** @type {import('urdf-loader').URDFRobot} */
let robotModel;
const loader = new URDFLoader();
loader.load('/turret.urdf', robot => {
    const scale = 2.0;
    robot.scale.set(scale, scale, scale);
    
    // With Z-up, the orientation is much simpler.
    // The robot loads upright by default. We just need to turn it to face North (+Y).
    // Default facing is +X (East), so rotate +90 deg around Z.
    robot.rotation.z = Math.PI / 2;

    scene.add(robot);
    robotModel = robot;
});

// Rocket Indicator
const rocketIndicator = new THREE.Mesh(
    new THREE.SphereGeometry(0.3, 16, 16),
    new THREE.MeshBasicMaterial({ color: 0xffff00 })
);
scene.add(rocketIndicator);

camera.lookAt(0,0,0);

// --- STATE MANAGEMENT (Unchanged) ---
let targetYawRad = 0, targetPitchRad = 0;
let antennaPositionGPS = { lat: 45.420109, lon: -75.680510, alt: 60 };
let initialRocketGPS = { lat: 45.421413, lon: -75.680510, alt: 205 };

// --- MODIFIED: GPS to 3D Scene Conversion for Z-UP ---
function updateRocketVisualPosition(rocketGPS) {
    const EARTH_RADIUS = 6371000;
    const VIZ_SCALE = 0.05;
    const rocketLatRad = THREE.MathUtils.degToRad(rocketGPS.lat);
    const antennaLatRad = THREE.MathUtils.degToRad(antennaPositionGPS.lat);
    const dLon = THREE.MathUtils.degToRad(rocketGPS.lon - antennaPositionGPS.lon);
    const dLat = rocketLatRad - antennaLatRad;

    const a = Math.sin(dLat / 2)**2 + Math.cos(antennaLatRad) * Math.cos(rocketLatRad) * Math.sin(dLon / 2)**2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const horizontalDistance = EARTH_RADIUS * c;

    const y_yaw = Math.sin(dLon) * Math.cos(rocketLatRad);
    const x_yaw = Math.cos(antennaLatRad) * Math.sin(rocketLatRad) - Math.sin(antennaLatRad) * Math.cos(rocketLatRad) * Math.cos(dLon);
    const yawRad = Math.atan2(y_yaw, x_yaw); // Azimuth from North

    const altDiff = rocketGPS.alt - antennaPositionGPS.alt;

    // Convert polar (yaw, dist) to cartesian on the X-Y plane
    // North is +Y, East is +X
    const x = horizontalDistance * Math.sin(yawRad);
    const y = horizontalDistance * Math.cos(yawRad);
    const z = altDiff; // Altitude is now the Z coordinate

    rocketIndicator.position.set(x * VIZ_SCALE, y * VIZ_SCALE, z * VIZ_SCALE);
}

// --- Animate Loop (Unchanged) ---
function animate() {
    requestAnimationFrame(animate);
    if (robotModel) {
        let currentYaw = robotModel.joints['yaw_joint'].jointValue[0];
        let currentPitch = robotModel.joints['pitch_joint'].jointValue[0];

        let yawDiff = targetYawRad - currentYaw;
        if (yawDiff > Math.PI) yawDiff -= 2 * Math.PI;
        if (yawDiff < -Math.PI) yawDiff += 2 * Math.PI;

        robotModel.setJointValue('yaw_joint', currentYaw + yawDiff * 0.1);
        robotModel.setJointValue('pitch_joint', currentPitch + (targetPitchRad - currentPitch) * 0.1);
        
        document.getElementById('current-pitch').innerText = THREE.MathUtils.radToDeg(currentPitch).toFixed(2);
        document.getElementById('current-yaw').innerText = ((THREE.MathUtils.radToDeg(currentYaw % (2 * Math.PI)) + 360) % 360).toFixed(2);
    }
    controls.update();
    renderer.render(scene, camera);
}
animate();

// --- Data Handling and UI (Unchanged) ---
updateRocketVisualPosition(initialRocketGPS);
const eventSource = new EventSource("/stream-updates");
eventSource.onmessage = (event) => {
    const data = JSON.parse(event.data);
    targetPitchRad = data.pitch;
    targetYawRad = data.yaw;
};

const trackingControls = document.getElementById('tracking-controls');
const manualControls = document.getElementById('manual-controls');
const modeRadios = document.querySelectorAll('input[name="control-mode"]');

function handleModeChange() {
    const selectedMode = document.querySelector('input[name="control-mode"]:checked').value;
    trackingControls.classList.toggle('hidden', selectedMode !== 'tracking');
    manualControls.classList.toggle('hidden', selectedMode !== 'manual');
    fetch('/set-mode', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: selectedMode })
    });
}
modeRadios.forEach(radio => radio.addEventListener('change', handleModeChange));
handleModeChange();

// --- Form and Slider Logic ---
const rocketForm = document.getElementById('rocket-form');
const rocketLat = document.getElementById('rocket-lat');
const rocketLon = document.getElementById('rocket-lon');
const rocketAlt = document.getElementById('rocket-alt');

async function updateRocketPosition() {
    const data = {
        lat: parseFloat(rocketLat.value),
        lon: parseFloat(rocketLon.value),
        alt: parseFloat(rocketAlt.value)
    };
    await fetch('/set-rocket-position', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    updateRocketVisualPosition(data); // <-- Add this line
}

rocketForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    await updateRocketPosition();
});

function debounce(fn, delay) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn.apply(this, args), delay);
    };
}


rocketLat.addEventListener('input', debounce(updateRocketPosition, 100));
rocketLon.addEventListener('input', debounce(updateRocketPosition, 100));
rocketAlt.addEventListener('input', debounce(updateRocketPosition, 100));

const pitchSlider = document.getElementById('pitch-slider');
const yawSlider = document.getElementById('yaw-slider');
const pitchValue = document.getElementById('pitch-value');
const yawValue = document.getElementById('yaw-value');

function updateTargetFromSliders() {
    const pitchRad = THREE.MathUtils.degToRad(parseFloat(pitchSlider.value));
    const yawRad = THREE.MathUtils.degToRad(parseFloat(yawSlider.value));
    fetch('/set-target', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pitch: pitchRad, yaw: yawRad })
    });
}
pitchSlider.addEventListener('input', () => pitchValue.innerText = parseFloat(pitchSlider.value).toFixed(1));
yawSlider.addEventListener('input', () => yawValue.innerText = parseFloat(yawSlider.value).toFixed(1));
pitchSlider.addEventListener('change', updateTargetFromSliders);
yawSlider.addEventListener('change', updateTargetFromSliders);

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});