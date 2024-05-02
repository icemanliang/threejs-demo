import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Stats from 'three/addons/libs/stats.module.js';
import textureImage from '../image/circle.jpg';

const width = window.innerWidth;
const height = window.innerHeight;

// step1 : create a renderer and add it to the dom.
const renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height);
document.body.appendChild(renderer.domElement);

// step2 : create scene 
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

// step3 : create a camera & add it to the scene.
const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 10000);
camera.position.set(40, 40, 40);
scene.add(camera);

// step4 : create a light & set its position & add it to the scene.
const light = new THREE.DirectionalLight(0xffffff, 3);
light.castShadow = true;
light.position.set(50,40,280);
scene.add(light);

// step5 : add help line.
//创建网格对象，参数1:大小，参数2:网格细分次数,参数3:网格中线颜色，参数4:网格线条颜色
const grid = new THREE.GridHelper(40, 40, 0xffffff, 0xffffff);
//网格透明度
grid.material.opacity = 0.2;
grid.material.depthWrite = false;
grid.material.transparent = true;
scene.add(grid);

const axes = new THREE.AxesHelper(50);
scene.add( axes );

// step6 : add cube
const geometry = new THREE.SphereGeometry(8,200,200);
const texture = new THREE.TextureLoader().load(textureImage);
const cubeMaterial = new THREE.MeshStandardMaterial({
    map: texture
});
const mesh = new THREE.Mesh( geometry, cubeMaterial );
scene.add( mesh );
mesh.position.set(0, 10, 0);

// step7 : add OrbitControls so that we can pan around with the mouse.
const controls = new OrbitControls(camera, renderer.domElement);

// step8 : add stats
document.body.appendChild(Stats.dom);

resize();
animate();
window.addEventListener('resize',resize);

function resize(){
  let w = window.innerWidth;
  let h = window.innerHeight;
  
  renderer.setSize(w,h);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}

// Renders the scene
function animate() {
    mesh.rotation.x +=0.01;
    mesh.rotation.y +=0.01;
    
    renderer.render( scene, camera );
    controls.update();
    
    requestAnimationFrame( animate );
}