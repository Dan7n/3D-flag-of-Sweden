// uniform mat4 projectionMatrix; //transform the (object) coordinates into the clip space coordinates
// uniform mat4 viewMatrix; //apply transformations relative to the camera (position, rotation, field of view, near, far)
// uniform mat4 modelMatrix; //apply transformations relative to the mesh (position, rotation, scale)
uniform vec2 uFrequency;
uniform float uTime;

// attribute vec3 position;

//declare the variable aRandom as a float (because it's one flat value per vertex)
attribute float aRandom;
// attribute vec2 uv;

varying vec2 vUv;
varying float vElevation;

// varying float vRandom;

void main() {
   vec4 modelPosition = modelMatrix * vec4(position, 1.0);

   float elevation = modelPosition.z += sin(modelPosition.x * uFrequency.x - uTime) * 0.015;
   elevation += modelPosition.z += sin(modelPosition.y * uFrequency.y - uTime) * 0.02;


   modelPosition.z += elevation;

   vElevation = elevation;

   vec4 viewPosition = viewMatrix * modelPosition;
   vec4 projectionPosition = projectionMatrix * viewPosition;

   gl_Position = projectionPosition;
   vUv = uv;

}