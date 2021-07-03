import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";
import testVertexShader from "./shaders/test/vertex.glsl";
import testFragmentShader from "./shaders/test/fragment.glsl";

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const flagTexture = textureLoader.load("./textures/flag-sweden.jpeg");

/**
 * Test mesh
 */
// Geometry
const geometry = new THREE.PlaneGeometry(1, 1, 32, 32);

//count how many vertices are in our object - the position attribute already contains a vec3 with that count
const count = geometry.attributes.position.count;

//create a new Float32Array that we can fill with random values
const randoms = new Float32Array(count);

//loop and push a random number to each position
for (let i = 0; i < count; i++) {
  randoms[i] = Math.random();
}

//finally set the attribute "aRandom" to the geometry by creating a new THREE.BufferAttribue with the values of the random array
//the aRanom will be used in our vertex shaders
geometry.setAttribute("aRandom", new THREE.BufferAttribute(randoms, 1));
console.log(geometry.attributes);
// Material

//custom shaders require two basic args to get started: the vertexShader and the fragmentShader - and we write them with backticks in order to be able to expand into multiple lines
const material = new THREE.ShaderMaterial({
  vertexShader: testVertexShader,
  fragmentShader: testFragmentShader,
  uniforms: {
    uFrequency: { value: new THREE.Vector2(10, 5) },

    //we initilize it to 0, and that number will later be updated inside our tic()
    uTime: { value: 0 },
    uColor: { value: new THREE.Color("lightblue") },
    uTexture: { value: flagTexture },
  },
});
material.side = THREE.DoubleSide;
gui.add(material.uniforms.uFrequency.value, "x").min(0).max(20).step(0.01);
gui.add(material.uniforms.uFrequency.value, "y").min(0).max(20).step(0.01);

// Mesh
const mesh = new THREE.Mesh(geometry, material);
mesh.scale.y *= 0.6;
scene.add(mesh);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(0.25, -0.25, 1);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(new THREE.Color("#131313"));
gui.close();
/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  //update material
  //remember: we don't update the uniform itself but rather its value prop, which in this case is a float
  material.uniforms.uTime.value = elapsedTime;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
