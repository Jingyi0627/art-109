import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// ✅ 如果文件和 index.html 同层，就保持这样
const MODEL_URL = './The_Final.glb';

let scene, camera, renderer, controls;

init();
loadModel();
animate();

function init() {
    // 创建场景
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0e0f12); // 深灰沉浸背景

    // 摄像机
    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.01, 2000);
    camera.position.set(0, 0, 3);

    // 渲染器
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    document.body.appendChild(renderer.domElement);

    // 柔和光照（不会太亮也不会死黑）
    const hemi = new THREE.HemisphereLight(0xffffff, 0x202020, 1.6);
    const dir = new THREE.DirectionalLight(0xffffff, 1.4);
    dir.position.set(5, 10, 7);
    scene.add(hemi, dir);

    // 轨道交互（鼠标旋转浏览）
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; // 更丝滑

    window.addEventListener('resize', onWindowResize);
}

function loadModel() {
    const loader = new GLTFLoader();
    loader.load(
        MODEL_URL,
        (gltf) => {
            const root = gltf.scene;

            // 只拿 Mesh（防止相机 / 灯光 / 空对象继续污染包围盒）
            const model = new THREE.Group();
            root.traverse((obj) => {
                if (obj.isMesh) {
                    obj.material.side = THREE.DoubleSide; // 防止某些面看不见
                    model.add(obj);
                }
            });

            scene.add(model);

            // 自动框选模型并居中到视图
            const box = new THREE.Box3().setFromObject(model);
            const center = box.getCenter(new THREE.Vector3());
            const size = box.getSize(new THREE.Vector3());

            const maxDim = Math.max(size.x, size.y, size.z);
            const fov = camera.fov * (Math.PI / 180);
            let cameraZ = maxDim / (2 * Math.tan(fov / 2));

            camera.position.set(center.x + cameraZ * 0.8, center.y + cameraZ * 0.4, center.z + cameraZ);
            camera.lookAt(center);
            controls.target.copy(center);
            controls.update();
        },
        undefined,
        (error) => {
            console.error('⚠️ 模型加载失败:', error);
        }
    );
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}


