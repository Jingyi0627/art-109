import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// 本地模型（与你的 index.html 同目录）
const MODEL_URL = './The_Final.glb';

// ——— 状态提示（左上角） ———
const statusEl = document.createElement('div');
Object.assign(statusEl.style, {
    position: 'fixed', left: '10px', top: '10px', zIndex: 9999,
    padding: '6px 8px', borderRadius: '6px',
    font: '12px/1.4 monospace', color: '#ddd', background: 'rgba(0,0,0,.55)'
});
statusEl.textContent = 'booting…';
document.body.appendChild(statusEl);

let scene, camera, renderer, controls;

init();
loadLocalModel().then(ok => {
    statusEl.textContent = ok ? 'loaded: The_Final.glb ✔' : 'fallback cube shown (model not loaded)';
});
animate();

function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0e0f12);

    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.01, 2000);
    camera.position.set(0, 0, 3);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    document.body.appendChild(renderer.domElement);

    const hemi = new THREE.HemisphereLight(0xffffff, 0x202020, 1.6);
    const dir = new THREE.DirectionalLight(0xffffff, 1.4);
    dir.position.set(5, 10, 7);
    scene.add(hemi, dir);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    window.addEventListener('resize', onResize);
    statusEl.textContent = 'canvas ok, loading local GLB…';
}

async function loadLocalModel() {
    try {
        await loadAndFrame(MODEL_URL);
        return true;
    } catch (e) {
        console.error('Model load failed:', e);
        statusEl.textContent = 'load failed: ' + (e?.message || e) + ' → showing placeholder';
        // 放一个占位立方体，避免白屏
        const geo = new THREE.BoxGeometry(1, 1, 1);
        const mat = new THREE.MeshNormalMaterial();
        const cube = new THREE.Mesh(geo, mat);
        scene.add(cube);
        // 居中取景
        frameBox(new THREE.Box3().setFromObject(cube), new THREE.Vector3());
        return false;
    }
}

function loadAndFrame(url) {
    return new Promise((resolve, reject) => {
        const loader = new GLTFLoader();
        loader.load(
            url,
            (gltf) => {
                const root = gltf.scene;

                // 只收集网格，忽略相机/灯光/空物体
                const model = new THREE.Group();
                root.traverse((obj) => {
                    if (obj.isMesh) {
                        if (obj.material) obj.material.side = THREE.DoubleSide;
                        if (obj.geometry && !obj.geometry.attributes.normal) obj.geometry.computeVertexNormals();
                        model.add(obj);
                    }
                });

                if (model.children.length === 0) {
                    reject(new Error('No mesh found in GLB. Did you export cameras/lights only?'));
                    return;
                }

                scene.add(model);

                const box = new THREE.Box3().setFromObject(model);
                const center = box.getCenter(new THREE.Vector3());

                // 可视化包围盒（调试用，确认范围正确）：
                // scene.add(new THREE.Box3Helper(box, 0x00ff88));

                frameBox(box, center);
                resolve();
            },
            (xhr) => {
                const pct = ((xhr.loaded / (xhr.total || 1)) * 100).toFixed(0);
                statusEl.textContent = `loading GLB ${pct}%`;
            },
            (err) => reject(err)
        );
    });
}

function frameBox(box, center, fit = 1.25) {
    controls.target.copy(center);
    const size = box.getSize(new THREE.Vector3());
    const maxSize = Math.max(size.x, size.y, size.z) || 1;
    const halfFov = THREE.MathUtils.degToRad(camera.fov * 0.5);
    const distance = (maxSize * 0.5) / Math.tan(halfFov);

    const dir = new THREE.Vector3(0.6, 0.4, 1).normalize();
    camera.position.copy(center).addScaledVector(dir, distance * fit);

    camera.near = Math.max(0.01, distance / 100);
    camera.far = Math.max(1000, distance * 100);
    camera.updateProjectionMatrix();
}

function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
