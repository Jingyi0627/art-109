import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111111); //background

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(2, 2, 4);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 
const hemiLight = new THREE.HemisphereLight(0xffffff, 0x222222, 1.2);
scene.add(hemiLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 2);
dirLight.position.set(5, 5, 5);
scene.add(dirLight);

const controls = new OrbitControls(camera, renderer.domElement);

// reloading
const loader = new GLTFLoader();
let model; // scale

loader.load('elephant_zun-36_6_a_b-150k-4096.gltf', (gltf) => {
    model = gltf.scene;
    scene.add(model);

    loader.load('elephant_zun-36_6_a_b-150k-4096.gltf', (gltf) => {
        model = gltf.scene;
        scene.add(model);


        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());

        model.position.sub(center);


        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 1.5 / maxDim; // adjust
        model.scale.setScalar(scale);


        camera.position.set(0, size.y * scale * 1.5, maxDim * scale * 3);
        camera.lookAt(0, 0, 0);

    }, undefined, (error) => {
        console.error('Model loading failed：', error);
    });


}, undefined, (error) => {
    console.error('Model loading failed：', error);
});


function animate() {
    requestAnimationFrame(animate);


    if (model) {
        model.rotation.y += 0.003;
    }

    controls.update();
    renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
