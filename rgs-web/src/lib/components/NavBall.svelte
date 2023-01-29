<script lang="ts" type="module">
  import { onDestroy, onMount } from "svelte";
  import * as THREE from "three";

  let container: HTMLElement;
  let scene: THREE.Scene;
  let renderer: THREE.WebGLRenderer;
  let group: THREE.Object3D<THREE.Event>;

  export let resolution = 16;
  let sphereXResolution = resolution * 2;
  let sphereYResolution = resolution;

  let currentRotation: THREE.Quaternion = new THREE.Quaternion();
  export let targetRotation: THREE.Quaternion = new THREE.Quaternion();

  export let usePerspective: boolean = false;
  let perspectiveCamera = new THREE.PerspectiveCamera(60, 1, 0.1, 2);
  perspectiveCamera.position.z = 2;

  let orthographicCamera = new THREE.OrthographicCamera();
  orthographicCamera.position.z = 2;

  onMount(() => {
    scene = new THREE.Scene();

    group = new THREE.Object3D();
    scene.add(group);

    // NavBall
    var loader = new THREE.TextureLoader();
    loader.load("textures/navball-bw.png", function (texture: THREE.Texture) {
      texture.anisotropy = 32;
      var geometry = new THREE.SphereGeometry(
        1,
        sphereXResolution,
        sphereYResolution
      );

      var material = new THREE.MeshBasicMaterial({
        map: texture,
      });
      var mesh = new THREE.Mesh(geometry, material);
      group.add(mesh);
    });

    renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);

    container.appendChild(renderer.domElement);

    render();
  });

  let done: boolean = false;
  onDestroy(() => {
    done = true;
    render();
  });

  function render() {
    if (done) {
      renderer.dispose();
      return;
    }
    requestAnimationFrame(render);
    let camera = usePerspective ? perspectiveCamera : orthographicCamera;
    camera.lookAt(scene.position);

    // Interpolate currentRotation to targetRotation
    currentRotation = currentRotation.slerp(targetRotation, 0.1);

    group.setRotationFromQuaternion(currentRotation);

    renderer.render(scene, camera);
  }
</script>

<div class="w-full h-full" bind:this="{container}"></div>
