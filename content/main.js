import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// Load textures
const textureLoader = new THREE.TextureLoader();
const noiseTexture = textureLoader.load('https://threejs.org/examples/textures/noises/perlin/128x128.png');
noiseTexture.wrapS = THREE.RepeatWrapping;
noiseTexture.wrapT = THREE.RepeatWrapping;

const texture = textureLoader.load('/come-mandare-il-cv-a-ikea.jpg');
const textureWood = textureLoader.load('/wood-3.jpg');

// Smoke state
let smokeEnabled = true;

// Create a scene
const scene = new THREE.Scene();

// Add axes helper
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

// Create smoke geometry and material
const smokeGeometry = new THREE.PlaneGeometry(0.15, 0.6, 16, 64);
smokeGeometry.translate(0, 0.3, 0);
smokeGeometry.scale(1.5, 6, 1.5);

const smokeMaterial = new THREE.ShaderMaterial({
    transparent: true,
    side: THREE.DoubleSide,
    depthWrite: false,
    uniforms: {
        time: { value: 0 },
        noiseTexture: { value: noiseTexture }
    },
    vertexShader: `
        varying vec2 vUv;
        uniform float time;
        uniform sampler2D noiseTexture;
        
        void main() {
            vUv = uv;
            
            // Add some movement
            vec4 noise = texture2D(noiseTexture, vec2(
                6.75,
                uv.y * 0.25 - time * 0.025
            ));
            
            // Twist effect
            float twist = noise.r * 25.0;
            vec3 pos = position;
            float c = cos(twist);
            float s = sin(twist);
            pos.x = position.x * c - position.z * s;
            pos.z = position.x * s + position.z * c;
            
            // Wind effect
            vec2 wind = vec2(
                texture2D(noiseTexture, vec2(0.25, time * 0.01)).r - 0.5,
                texture2D(noiseTexture, vec2(0.75, time * 0.01)).r - 0.5
            );
            pos.xz += wind * pow(uv.y, 1.0);
            
            // Scale based on distance from origin
            float distanceScale = 1.0 + (uv.y * 2.0); // Increase scale linearly with height
            pos.xz *= distanceScale;
            
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.1);
        }
    `,
    fragmentShader: `
        varying vec2 vUv;
        uniform float time;
        uniform sampler2D noiseTexture;
        
        void main() {
            vec2 uv = vec2(vUv.x * 0.5, vUv.y * 0.3 - time * 0.03);
            float alpha = texture2D(noiseTexture, uv).r;
            
            // Edge fade
            alpha *= smoothstep(0.0, 0.1, vUv.x);
            alpha *= smoothstep(0.0, 0.1, 1.0 - vUv.x);
            alpha *= smoothstep(0.0, 0.1, vUv.y);
            alpha *= smoothstep(0.0, 0.1, 1.0 - vUv.y);
            
            vec3 color = mix(vec3(0.3, 0.3, 0.3), vec3(1.0), pow(alpha, 3.0));
            gl_FragColor = vec4(color, alpha * 0.9);
        }
    `
});

const smoke = new THREE.Mesh(smokeGeometry, smokeMaterial);
scene.background = new THREE.Color(0xffffff);

// Create a camera with perspective view
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

// Create a renderer and set its size
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// Enable physically correct lighting
renderer.physicallyCorrectLights = true;

// Enable shadow mapping in the renderer
renderer.shadowMap.enabled = true;

// Add a light source to the scene
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 5, 5).normalize();
light.castShadow = true; // Enable shadow casting for the light
scene.add(light);

// Add a secondary light source to illuminate the back side of the model
const backLight = new THREE.DirectionalLight(0xffffff, 0.5);
backLight.position.set(-5, -5, -5).normalize();
backLight.castShadow = true; // Enable shadow casting for the back light
scene.add(backLight);

// Add ambient light to the scene
const ambientLight = new THREE.AmbientLight(0x404040, 1); // soft white light
scene.add(ambientLight);

// Add environmental light to simulate sunlight
const sunLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
scene.add(sunLight);

// Set the camera position
camera.position.z = 1;
camera.position.x = 2;
camera.position.y = 7;

// Animation loop function
function animate(time) {
    if (smokeMaterial && smokeEnabled) {
        smokeMaterial.uniforms.time.value = time * 0.001;
    }
    renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);

// Add orbit controls to allow user interaction
const controls = new OrbitControls( camera, renderer.domElement );
// controls.keys = {
// 	LEFT: 'ArrowLeft', //left arrow
// 	UP: 'ArrowUp', // up arrow
// 	RIGHT: 'ArrowRight', // right arrow
// 	BOTTOM: 'ArrowDown' // down arrow
// }
// controls.mouseButtons = {
// 	LEFT: THREE.MOUSE.ROTATE,
// 	RIGHT: THREE.MOUSE.PAN
// }

// Create a GLTF loader to load 3D models
const gltfLoader = new GLTFLoader();

// CSS variables
const style = getComputedStyle(document.documentElement);
const brownBody = style.getPropertyValue('--brown').trim();
const brownTip = style.getPropertyValue('--brown-light').trim();

// Convert CSS color to hex for Three.js
const colorToHex = (color) => {
  const dummy = document.createElement('div');
  dummy.style.color = color;
  document.body.appendChild(dummy);
  const computed = getComputedStyle(dummy).color;
  document.body.removeChild(dummy);
  
  // Parse rgb values
  const rgb = computed.match(/\d+/g).map(Number);
  return (rgb[0] << 16) + (rgb[1] << 8) + rgb[2];
};
// end CSS

// Toggle smoke function
window.toggleSmoke = function() {
    smokeEnabled = !smokeEnabled;
    smoke.visible = smokeEnabled;
};

gltfLoader.load('01-palo-santo.glb', function(gltf) {
	try {
		const model = gltf.scene;

		if (!model) {
			throw new Error('Model not loaded correctly');
		}

		console.log('Model loaded:', model);

		let packaging, spinelloGroup;
		let meshIndex = 0;

		spinelloGroup = new THREE.Group();

		model.traverse((node) => {
			if (node.isMesh) {
				console.log('Mesh index:', meshIndex);
				console.log('Mesh found:', node);
				const clonedNode = node.clone();
				clonedNode.material = new THREE.MeshPhongMaterial({ 
					color: (() => {
						switch(meshIndex) {
							case 0: return 0xffea00; // packaging
							case 1: return colorToHex(brownBody); // joint body
							case 2: return colorToHex(brownTip); // joint tip
							default: return 0x000000; // joint end
						}
					})(),
					bumpMap: (() => {
          switch(meshIndex) {
            case 0: return texture; // packaging
            case 1: return textureWood; // joint body
            case 2: return textureWood; // joint tip
            default: return null; // joint end
          }
          })(),
          map: (() => {
            switch(meshIndex) {
              case 0: return texture; // packaging
              case 1: return textureWood; // joint body
              case 2: return textureWood; // joint tip
              default: return null; // joint end
            }
          })(),
					side: THREE.DoubleSide,
					shininess: (() => {
						switch(meshIndex) {
							case 0: return 70; // packaging
							case 1: return 50; // joint body
							case 2: return 50; // joint tip
							default: return 10; // joint end
						}
					})(),
					emissive: 0x000000,
					specular: meshIndex === 0 ? 0xdddddd : 0x333333,
				});
				clonedNode.castShadow =  meshIndex === 0 ? false : true;
				clonedNode.receiveShadow = meshIndex === 0 ? true : false;
				
				// Preserve the world matrix transformation
				clonedNode.matrixAutoUpdate = false;
				clonedNode.matrix.copy(node.matrixWorld);

				if (meshIndex === 0) {
					packaging = clonedNode;
				} else if (meshIndex >= 1 && meshIndex <= 3) {
					spinelloGroup.add(clonedNode);
				}
				meshIndex++;
			}
		});

		// Reset group transformation
		spinelloGroup.updateMatrixWorld(true);

		// Add separated meshes to the scene
		if (packaging) scene.add(packaging);
		if (spinelloGroup.children.length > 0) {
            scene.add(spinelloGroup);
            
            // Position smoke at joint tip
            const jointTip = spinelloGroup.children[1]; // Index 1 should be the joint tip
            if (jointTip) {
                smoke.position.copy(jointTip.position);
                smoke.position.y += 0.15; // Adjust height as needed
                smoke.position.x -= 0.05; // Adjust height as needed
                smoke.position.z -= 0.6; // Adjust height as needed
                // smoke.rotation.y = Math.PI / 2; // Rotate to face camera better
                smoke.rotation.z = Math.PI / 2; // Rotate to face camera better
                scene.add(smoke);
            }
        }
	} catch (error) {
		console.error('An error occurred while processing the model:', error);
	}
}, undefined, function ( error ) {
	console.error('An error occurred while loading the model:', error);
});
