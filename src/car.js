import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import Stats from 'three/addons/libs/stats.module.js';

const width = window.innerWidth;
const height = window.innerHeight;

// step1 : create a renderer and add it to the dom.
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.enabled = true;
renderer.setSize(width, height);
document.body.appendChild(renderer.domElement);

// step2 : create scene 
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);
scene.environment = new THREE.Color(0x000000); // 设置环境光颜色
scene.fog = new THREE.Fog( 0xcce0ff, 2500, 10000)   //加上雾化的效果

// step3 : create a camera & add it to the scene.
const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 10000);
camera.position.set(20, 20, 20);
scene.add(camera);

// step4 : create a light & set its position & add it to the scene.
// const ambient = new THREE.AmbientLight("0xffff00", 1);
// scene.add(ambient);

let light1 = new THREE.DirectionalLight(0xffffff, 1); // 创建一个方向光，参数为光的颜色和强度
light1.position.set(0, 0, 10);
scene.add(light1);
let light2 = new THREE.DirectionalLight(0xffffff, 1);
light2.position.set(0, 0, -10);
scene.add(light2);
let light3 = new THREE.DirectionalLight(0xffffff, 1);
light3.position.set(10, 0, 0);
scene.add(light3);
let light4 = new THREE.DirectionalLight(0xffffff, 1);
light4.position.set(-10, 0, 0);
scene.add(light4);
let light5 = new THREE.DirectionalLight(0xffffff, 1);
light5.position.set(0, 10, 0);
scene.add(light5);
let light6 = new THREE.DirectionalLight(0xffffff, 1);
light6.position.set(0, -10, 0);
scene.add(light6);
let light7 = new THREE.DirectionalLight(0xffffff, 1);
light7.position.set(10, 10, 10);
scene.add(light7);
let light8 = new THREE.DirectionalLight(0xffffff, 1);
light8.position.set(10, 10, -10);
scene.add(light8);
let light9 = new THREE.DirectionalLight(0xffffff, 1);
light9.position.set(-10, 10, 10);
scene.add(light9);
let light10 = new THREE.DirectionalLight(0xffffff, 1);
light10.position.set(-10, 10, -10);
light10.castShadow = true;
scene.add(light10);

const helper = new THREE.DirectionalLightHelper( light10, 1 );
scene.add( helper );

// // //创建点光源
// const point = new THREE.PointLight("0xffffff", 1);
// //设置点光源位置
// point.position.set(200, 300, 200); 
// //点光源添加到场景中
// scene.add(point); 

// const light = new THREE.DirectionalLight(0xffffff, 300);
// light.castShadow = true;
// light.position.set(250,40,280);
// scene.add(light);

// step5 : add help line.
//创建网格对象，参数1:大小，参数2:网格细分次数,参数3:网格中线颜色，参数4:网格线条颜色
const grid = new THREE.GridHelper(40, 40, 0xffffff, 0xffffff);
//网格透明度
grid.material.opacity = 0.5;
grid.material.depthWrite = false;
grid.material.transparent = true;
scene.add(grid);

const axes = new THREE.AxesHelper(50);
scene.add( axes );

// step6 : add modal
// 车身材质
const bodyMaterial = new THREE.MeshPhysicalMaterial( {
    color: 0xff0000, metalness: 1.0, roughness: 0.5, clearcoat: 1.0, clearcoatRoughness: 0.03
} );

const detailsMaterial = new THREE.MeshStandardMaterial( {
    color: 0xffffff, metalness: 1.0, roughness: 0.5
} );

const glassMaterial = new THREE.MeshPhysicalMaterial( {
    color: 0xffffff, metalness: 0.25, roughness: 0, transmission: 1.0
} );
let carModel = null
const loader = new GLTFLoader()
loader.load('scene.gltf', (gltf)=>{
    console.log(gltf.scene);
    carModel = gltf.scene.children[0];
    
    console.log(carModel.getObjectByName('r35_body'))
    
    carModel.getObjectByName('r35_body').children.forEach(element => {
        // element.material = bodyMaterial;
    });

    // carModel.getObjectByName( 'body' ).material = bodyMaterial;
    // carModel.getObjectByName( 'rim_fl' ).material = detailsMaterial;
    // carModel.getObjectByName( 'rim_fr' ).material = detailsMaterial;
    // carModel.getObjectByName( 'rim_rr' ).material = detailsMaterial;
    // carModel.getObjectByName( 'rim_rl' ).material = detailsMaterial;
    // carModel.getObjectByName( 'trim' ).material = detailsMaterial;
    // carModel.getObjectByName( 'glass' ).material = glassMaterial;

    carModel.scale.setScalar(4);
    scene.add(carModel)
})

// step7 : add floor
const floorGeometry = new THREE.PlaneGeometry(40,40)
const floormaterial = new THREE.MeshPhysicalMaterial({
//   side: THREE.DoubleSide,
  color: 0x000000,
  metalness: 0.2, // 设置金属度
  roughness: 0.2, // 设置粗糙度
  wireframe: false // 关闭网格线
})
const mesh = new THREE.Mesh(floorGeometry,floormaterial)
mesh.rotation.x = Math.PI / 2
scene.add(mesh)

// 设置聚光灯(让汽车更具有立体金属感)
// const spotLight = new THREE.SpotLight('#fff',100)
// spotLight.angle = Math.PI / 8 // 散射角度，和水平线的夹角
// spotLight.penumbra = 0.2 // 横向，聚光锥的半影衰减百分比
// spotLight.decay = 1 // 纵向，沿着光照距离的衰减量
// spotLight.distance = 30
// spotLight.shadow.radius = 10
// spotLight.shadow.mapSize.set(4096,4096)
// spotLight.position.set(-5,10,1)
// spotLight.target.position.set(0,0,0) // 光照射的方向
// spotLight.castShadow = true
// scene.add(spotLight)

// step8 : add OrbitControls so that we can pan around with the mouse.
const controls = new OrbitControls(camera, renderer.domElement);

// step9 : add stats
const stats = Stats();
document.body.appendChild(stats.dom);

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
    if( carModel){
        carModel.rotation.z -= 0.001;
    }
    
    renderer.render( scene, camera );
    controls.update();
    stats.update();
    
    requestAnimationFrame( animate );
}