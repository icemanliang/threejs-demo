import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import Stats from 'three/addons/libs/stats.module.js';
import on from '../image/volumeOn.png';
import off from '../image/volumeOff.png';
import textureImage from '../image/floor.jpg';
import * as TWEEN from '@tweenjs/tween.js'

const width = window.innerWidth;
const height = window.innerHeight;
// car color
const colorAry = ["#76EEC6", "#00BFFF", "#FFA500", "#FF6347" ,"#E8E8E8" ,"#E066FF"];

// step1 : create a renderer and add it to the dom.
const container = document.createElement( 'div' );
document.body.appendChild( container );
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio( window.devicePixelRatio );
renderer.enabled = true;
renderer.setSize(width, height);
container.appendChild(renderer.domElement);
renderer.shadowMap.enabled = true;

// step2 : create scene 
const scene = new THREE.Scene();
// scene.background = new THREE.Color( 0x050505 );
scene.background = new THREE.Color( 0x0000 );

// step3 : create a camera & add it to the scene.
const camera = new THREE.PerspectiveCamera(45, width / height, 1, 180);
camera.position.set(20, 20, 20);
scene.add(camera);

// step4 : create a spotlight & set its position & add it to the scene.
const light1 = new THREE.SpotLight( 0xffffff, 2000, 0 );
light1.position.set( 0, 40, 0 );
light1.angle = 0.5;
light1.penumbra = 0.5;
light1.castShadow = true;
light1.shadow.mapSize.width = 1024;
light1.shadow.mapSize.height = 1024;
scene.add( light1 );

// step4 : create directionlight & set its position & add it to the scene.
let light2 = new THREE.DirectionalLight(0xffffff, 2);
light2.position.set(0, 0, -10);
scene.add(light2);
let light3 = new THREE.DirectionalLight(0xffffff, 2);
light3.position.set(10, 0, 0);
scene.add(light3);
let light4 = new THREE.DirectionalLight(0xffffff, 2);
light4.position.set(-10, 0, 0);
scene.add(light4);
let light5 = new THREE.DirectionalLight(0xffffff, 1);
light5.position.set(0, 0, 10);
scene.add(light5);

// step4 : add light help line.
// const helper1 = new THREE.DirectionalLightHelper( light1, 1 );
// scene.add( helper1 );
// const helper2 = new THREE.DirectionalLightHelper( light2, 1 );
// scene.add( helper2 );
// const helper3 = new THREE.DirectionalLightHelper( light3, 1 );
// scene.add( helper3 );
// const helper4 = new THREE.DirectionalLightHelper( light4, 1 );
// scene.add( helper4 );
// const helper5 = new THREE.DirectionalLightHelper( light5, 1 );
// scene.add( helper5 );


// step5 : add help line.
// const grid = new THREE.GridHelper(40, 40, 0xffffff, 0xffffff);
// grid.material.opacity = 0.5;
// grid.material.depthWrite = false;
// grid.material.transparent = true;
// scene.add(grid);

// sport light
const carlight = new THREE.SpotLight(0xFFF68F, 1000, 200, Math.PI/6)
carlight.position.set(0, 15, 0)
carlight.castShadow = true;
carlight.shadow.mapSize.width = 1024;
carlight.shadow.mapSize.height = 1024;
const carlightTarget = new THREE.Object3D();
carlightTarget.position.set(-5, 0, 0)
scene.add(carlightTarget)
carlight.target = carlightTarget;
scene.add(carlight);
// const carHelper = new THREE.SpotLightHelper( carlight, 1 );
// scene.add( carHelper );

// step5 : add axes help line.
// const axes = new THREE.AxesHelper(50);
// scene.add( axes );

// 创建雷电灯光
const thunderLight = new THREE.PointLight(0xffffff, 100, 100); // 初始强度设置为0
thunderLight.position.set(0, 50, 0); // 设置雷电灯光的位置
scene.add(thunderLight);

// step6 : add modal
let carModel = null;
let leftDoorObject = [];
let rightDoorObject = [];
let leftGroup = new THREE.Group();
let rightGroup = new THREE.Group();
const loader = new GLTFLoader();
let animateTarget = { lx: -0.1, lz: 0, lr: 0, rx: 0.1, rz: 0, rr:0 };
let tween = null;
let lightTarget = {x:-5, y:0, z:-5}
let carTween = null;

loader.load('car/scene.gltf', (gltf)=>{
    carModel = gltf.scene.children[0];
    console.log(gltf.scene.children[0]);

    gltf.scene.traverse((item)=>{
        item.castShadow = true;
        if(item.name =='r35_door_R001' || item.name =='r35_doorpanel_L_be' || item.name =='r35_doorglass_L' || item.name =='r35_mirror_L_cf'){
            // console.log(item)
            const temp = item.clone();
            leftDoorObject.push(temp);
            item.visible = false;
            return;
        }
        if(item.name =='r35_door_R' || item.name =='r35_doorpanel_R_be' || item.name =='r35_doorglass_R' || item.name =='r35_mirror_R_cf'){
            // console.log(item)
            const temp = item.clone();
            rightDoorObject.push(temp);
            item.visible = false;
            return;
        }
        if (item.name === '3_Wheel.003') {
            item.rotation.x = Math.PI / 2; // 调整左前轮的朝向
        }
        if (item.name === '3_Wheel.004') {
            item.rotation.x = Math.PI / 2; // 调整右前轮的朝向
        }
    })
    leftDoorObject.forEach((item)=>{
        leftGroup.add(item)
    })
    rightDoorObject.forEach((item)=>{
        rightGroup.add(item)
    })
    // 换色
    carModel.getObjectByName( 'r35_hood_race_r35_paint_0' ).material.color.set('#76EEC6');
    carModel.getObjectByName( 'r35_roof_cf_r35_paint_0' ).material.color.set('#76EEC6');

    leftGroup.position.set(0,0,0)
    leftGroup.castShadow = true;
    leftGroup.scale.setScalar(0.05);
    scene.add(leftGroup);
    rightGroup.position.set(0,0,0)
    rightGroup.scale.setScalar(0.05);
    scene.add(rightGroup);

    carModel.position.set(0,0,0)
    carModel.scale.setScalar(5);
    scene.add(carModel)
})



// step7 : add floor
const floorTexture = new THREE.TextureLoader().load(textureImage);
const floorGeometry = new THREE.PlaneGeometry(60,60)
const floormaterial = new THREE.MeshPhysicalMaterial({
    side: THREE.BackSide,
    map: floorTexture,
})
const mesh = new THREE.Mesh(floorGeometry,floormaterial)
mesh.rotation.x = - Math.PI / 2;
mesh.material.map.repeat.set( 6, 6 );
mesh.material.map.wrapS = mesh.material.map.wrapT = THREE.RepeatWrapping;
mesh.material.map.colorSpace = THREE.SRGBColorSpace;
mesh.receiveShadow = true;
mesh.rotation.x = Math.PI / 2
scene.add(mesh)

// step8 : add OrbitControls so that we can pan around with the mouse.
const controls = new OrbitControls(camera, renderer.domElement);
controls.maxPolarAngle = 0.9 * Math.PI / 2
controls.minPolarAngle = 0.9 * Math.PI / 3.5
controls.enableDamping = true; // 启用阻尼
// controls.enableZoom = false
controls.minDistance = 23;
controls.maxDistance = 40;

// step9 : add stats
const stats = Stats();
document.body.appendChild(stats.dom);

// step10 : add music
const listener = new THREE.AudioListener();
camera.add( listener );

// 控制雨滴的开关
let isRaining = false;

// 创建一个全局 audio 源,加载一个 sound 并将其设置为 Audio 对象的缓冲区
let sound = new THREE.Audio( listener );
sound.autoplay = true;
const audioLoader = new THREE.AudioLoader();
audioLoader.load( 'car.mp3', function( buffer ) {
	sound.setBuffer( buffer );
	sound.setLoop( true );
	sound.setVolume( 0.2 );
	sound.play();
});

resize();
animate();
window.addEventListener('resize',resize);

// add ui
const color = document.querySelector('.color');
colorAry.forEach((item)=>{
    const temp = document.createElement('div');
    temp.className = 'item';
    temp.style.backgroundColor = item;
    temp.onclick = function(){
        carModel.getObjectByName( 'r35_hood_race_r35_paint_0' ).material.color.set(item);
        carModel.getObjectByName( 'r35_roof_cf_r35_paint_0' ).material.color.set(item);
    }
    color.appendChild(temp)
})
const music = document.querySelector('.music');
const onImg = document.createElement('img');
onImg.src= on;
const offImg = document.createElement('img');
offImg.src=off;
music.appendChild(onImg)
music.appendChild(offImg)
onImg.onclick = function(){
    sound.setVolume( 0 );
    sound.stop();
    onImg.style.display = 'none';
    offImg.style.display ='block';
}
offImg.onclick = function(){
    sound.setVolume( 0.2 );
    sound.play();
    onImg.style.display = 'block';
    offImg.style.display ='none';
}
offImg.style.display ='none';


function openDoor() {
    tween = new TWEEN.Tween(animateTarget)
        .to({ lx: 5, lz: -2.1, lr: -Math.PI / 3, rx: -5, rz: -2.1, rr: Math.PI / 3 }, 1000)
        .onUpdate(function (object) {
            leftGroup.position.x = object.lx;
            leftGroup.position.z =  object.lz;
            leftGroup.rotation.y = object.lr;
            rightGroup.position.x = object.rx;
            rightGroup.position.z = object.rz;
            rightGroup.rotation.y = object.rr;
        })
        .start();
}

function closeDoor() {
    tween = new TWEEN.Tween(animateTarget)
        .to({ lx: 0, lz: 0, lr: 0, rx: 0, rz: 0, rr:0 }, 1000)
        .onUpdate(function (object) {
            leftGroup.position.x = object.lx;
            leftGroup.position.z =  object.lz;
            leftGroup.rotation.y = object.lr;
            rightGroup.position.x = object.rx;
            rightGroup.position.z = object.rz;
            rightGroup.rotation.y = object.rr;
        })
        .start();
}

const toggle = document.querySelector('.switch');
const checkInput = document.createElement('input');
checkInput.type = 'checkbox';
checkInput.checked = false;

checkInput.onclick = function(){
    checkInput.checked = this.checked;
    if(checkInput.checked){
        openDoor();
    }else{
        closeDoor();
    }
}
toggle.appendChild(checkInput)
const checkSpan = document.createElement('span');
checkSpan.className = 'slider round';
toggle.appendChild(checkSpan)

// rain toggle
const toggleRainButton = document.querySelector('.switchRain');
const checkInputRain = document.createElement('input');
checkInputRain.type = 'checkbox';
checkInputRain.checked = false;

checkInputRain.onclick = function(){
    checkInputRain.checked = this.checked;
    if(checkInputRain.checked){
        toggleRain();
    }else{
        toggleRain();
    }
}
toggleRainButton.appendChild(checkInputRain)
const checkSpanRain = document.createElement('span');
checkSpanRain.className = 'slider round rain';
toggleRainButton.appendChild(checkSpanRain)


function resize(){
  let w = window.innerWidth;
  let h = window.innerHeight;
  
  renderer.setSize(w,h);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}

carTween = new TWEEN.Tween(lightTarget)
.to({ x: 5, y: 0, z: 4 }, 5000)
.onUpdate(function (object) {
    carlightTarget.position.set(object.x, object.y, object.z)
})
.repeat(Infinity).yoyo(true).start();



// step11 : 添加雨滴效果
const rainCount = 10000; // 雨滴数量
const rainGeometry = new THREE.BufferGeometry();
const positions = new Float32Array(rainCount * 3);
const rainSpeeds = new Float32Array(rainCount); // 存储每个雨滴的下落速度

for (let i = 0; i < rainCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 200; // 随机 X 位置
    positions[i * 3 + 1] = Math.random() * 100; // 随机 Y 位置，靠近相机
    positions[i * 3 + 2] = (Math.random() - 0.5) * 200; // 随机 Z 位置
    rainSpeeds[i] = 0.5 + Math.random() * 0.5; // 随机下落速度
}
rainGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

// 调整雨滴的材质
const rainMaterial = new THREE.PointsMaterial({ color: 0xAAAAAA, size: 0.1, transparent: true, opacity: 0.8 }); // 更小的雨滴
const rain = new THREE.Points(rainGeometry, rainMaterial);
scene.add(rain);

// 控制雨滴的开关
function toggleRain() {
    isRaining = !isRaining;
    rain.visible = isRaining; // 简化开关逻辑
}

// 定义闪电效果的函数
function flashThunder() {
    const duration = Math.random() * 300 + 200; // 随机闪电持续时间
    const maxIntensity = Math.random() * 2000 + 10; // 随机最大强度

    // 逐渐增加灯光强度
    new TWEEN.Tween({ intensity: 100 })
        .to({ intensity: maxIntensity }, duration / 2)
        .onUpdate(function () {
            thunderLight.intensity = this.intensity;
        })
        .onComplete(() => {
            // 逐渐减小灯光强度
            new TWEEN.Tween({ intensity: maxIntensity })
                .to({ intensity: 0 }, duration / 2)
                .onUpdate(function () {
                    thunderLight.intensity = this.intensity;
                })
                .start();
        })
        .start();

    // 随机设置下一个闪电的时间
    setTimeout(flashThunder, Math.random() * 2000 + 1000); // 闪电间隔在1到3秒之间
}

// 启动闪电效果
// flashThunder();

// 在动画循环中更新雨滴位置
function animate() {
    // if( carModel){
    //     carModel.rotation.z -= 0.001;
    // }
    TWEEN.update()
    renderer.render( scene, camera );
    controls.update();
    stats.update();
    
    if (isRaining) {
        const positions = rain.geometry.attributes.position.array;
        for (let i = 0; i < positions.length; i += 3) {
            positions[i + 1] -= rainSpeeds[i / 3]; // 使用随机下落速度
            if (positions[i + 1] < -50) positions[i + 1] = 100; // 重置雨滴位置
        }
        rain.geometry.attributes.position.needsUpdate = true; // 更新雨滴位置
    }

    requestAnimationFrame( animate );
}