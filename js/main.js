import * as THREE from 'three';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { HDRLoader } from 'three/addons/loaders/HDRLoader.js';

let scene, camera, renderer, controls;

init();

async function init() {

  const container = document.createElement( 'div' );
  document.body.appendChild( container );

  camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.25, 100 );
  camera.position.set( - 1.8, 0.6, 2.7 );

  scene = new THREE.Scene();

 
  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;
  container.appendChild( renderer.domElement );
  

  new HDRLoader()
  .setPath( '../textures/equirectangular/' )
  .load('rogland_clear_night_4k.hdr', function (texture){
 
    texture.mapping = THREE.EquirectangularReflectionMapping;

    scene.background = texture;
    scene.environment = texture;
    
    render ();
  } );

  
  const loader = new GLTFLoader().setPath( '../models/gltf/damagedhelmet/glb/' );

  // lista de archivos
  const modelFiles = [
    'dmc_delorean_motor_company_car.glb',
    'delorean_highpoly.glb',
    'delorean_dmc_-_12_stylized.glb',
    'small_outatime_diecast.glb',
    'millennium_falcon.glb',
  ];

  try {
    
    const gltfs = await Promise.all( modelFiles.map( f => loader.loadAsync(f) ) );

    
    await renderer.compileAsync( scene, camera );

    gltfs.forEach( (gltf, idx) => {
      const model = gltf.scene;
      model.position.x = idx * 10; // separa modelos en X
      model.scale.setScalar( 1 ); // ajusta escala 
      scene.add( model );
    } );

    render();

  } catch (err) {
    console.error('Error cargando modelos:', err);
  }

  const controls = new OrbitControls( camera, renderer.domElement );
  controls.addEventListener( 'change', render ); 
  controls.minDistance = 2;
  controls.maxDistance = 10;
  controls.target.set( 0, 0, - 0.2 );
  controls.update();

  window.addEventListener( 'resize', onWindowResize );
    
}

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

  render();

}
function render() {

  renderer.render( scene, camera );

}





/*
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setAnimationLoop( animate );
document.body.appendChild( renderer.domElement );

const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshLambertMaterial( { color: 0xff0000 } );
const cube = new THREE.Mesh( geometry, material );
cube.position.x = -2;
scene.add( cube );

const geometry2 = new THREE.BoxGeometry( 1, 1, 1 );
const material2 = new THREE.MeshLambertMaterial( { color: 0x0000ff } );
const cube2 = new THREE.Mesh( geometry2, material2 );
cube2.position.x = 2;
scene.add( cube2 );

const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);
const sphereMaterial = new THREE.MeshLambertMaterial({ color: 0xA020F0 }); 
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.position.x = 0; 
scene.add(sphere);

const innerCubeGeometry = new THREE.BoxGeometry(1, 1, 1);
const innerCubeMaterial = new THREE.MeshLambertMaterial({ color: 0x800080, transparent: true, opacity: 0.5 });
const innerCube = new THREE.Mesh(innerCubeGeometry, innerCubeMaterial);
sphere.add(innerCube);

const innerCubeGeometry2 = new THREE.BoxGeometry(1.01, 1.01, 1.01);
const innerCubeMaterial2 = new THREE.MeshLambertMaterial({ color: 0xBA55D3, transparent: true, opacity: 0.5 });
const innerCube2 = new THREE.Mesh(innerCubeGeometry2, innerCubeMaterial2);
sphere.add(innerCube2);

const light = new THREE.AmbientLight( 0xffffff, 1 );
light.position.set(5,5,5);
scene.add( light );
camera.position.z = 5;

function animate() {

  sphere.rotation.x += 0.02;
  sphere.rotation.y += 0.02;
  sphere.rotation.z += 0.02;

  cube.rotation.x += 0.02;
  cube.rotation.y += 0.02;
  cube.rotation.z += 0.02;
  
  cube2.rotation.x += 0.02;
  cube2.rotation.y += 0.02;
  cube2.rotation.z += 0.02;

  innerCube.rotation.x += 0.03;
  innerCube.rotation.y += 0.03;
  innerCube.rotation.z += 0.00;

  innerCube2.rotation.x -= 0.02;
  innerCube2.rotation.y -= 0.02;
  innerCube2.rotation.z -= 0.00;

  renderer.render( scene, camera );

}
*/