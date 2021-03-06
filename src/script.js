import './style.css'
import * as THREE from 'three'

// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
// fly controls are better in order to control de camera
import { FlyControls } from 'three/examples/jsm/controls/FlyControls'

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import * as dat from 'lil-gui'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { GammaCorrectionShader } from 'three/examples/jsm/shaders/GammaCorrectionShader.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import { RGBShiftShader } from 'three/examples/jsm/shaders/RGBShiftShader.js'
import {SMAAPass} from 'three/examples/jsm/postprocessing/SMAAPass.js'

import Wheel from './Wheel'


/**
 * Debug
 */
 const gui = new dat.GUI()
const parameters = {
    pointLight1Color: 0x5d8bee,
    intensityLight1: 3,
    decayLight1:100,
    exposure:1,
    pointLight2Color: 0x5d8bee,
    intensityLight2: 3,
    decayLight2:100,
    exposure:1,
    pointLight3Color: 0x5d8bee,
    intensityLight3: 3,
    decayLight3:100,
    exposure:1,
}

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    //Update effect composer 
    effectComposer.setSize(sizes.width, sizes.height)
    effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 10000)
camera.position.x = -20.7
camera.position.y = 75.7
camera.position.z = 18.4
scene.add(camera)
camera.lookAt(-19,82.1,-81.3)




/**
 * Models
 */
 const gltfLoader = new GLTFLoader()

 gltfLoader.load(
    '/models/Background.glb',
    (gltf) =>
    {   
        for(let model of gltf.scene.children){
            model.castShadow = true;
            model.receiveShadow = true;
            if(model.name === 'TVScreens'){
                model.material.transparent = true
                model.material.opacity = 0.7
            }
        }
        scene.add(gltf.scene)
    },
    (progress) =>
    {
        console.log('progress')
        console.log(progress)
    },
    (error) =>
    {
        console.log('error')
        console.log(error)
    }
)

// light

const ambientLight = new THREE.AmbientLight( 0x404040, 1 ); // soft white light

// scene.add(ambientLight);

// console.log(ambientLight);

const pointLight1 = new THREE.PointLight( parameters.pointLight1Color, 3, 100 );
pointLight1.position.set( -23, 119, -5.7 );
const pointLightHelper1 = new THREE.PointLightHelper( pointLight1, 1 );
scene.add( pointLightHelper1 );
scene.add( pointLight1 );

const pointLight2 = new THREE.PointLight( parameters.pointLight2Color, 3, 100 );
pointLight2.position.set( 38.5, 145.9, 21.3 );
const pointLightHelper2 = new THREE.PointLightHelper( pointLight2, 1 );
scene.add( pointLightHelper2 );
scene.add( pointLight2 );

const pointLight3 = new THREE.PointLight( parameters.pointLight3Color, 3, 100 );
pointLight3.position.set( -100, 141, -67 );
const pointLightHelper3 = new THREE.PointLightHelper( pointLight3, 1 );
scene.add( pointLightHelper3 );
scene.add( pointLight3 );

// directional

// const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
// const DirectionalLightHelper = new THREE.DirectionalLightHelper( directionalLight, 5 );
// scene.add( DirectionalLightHelper );


// debug
var lightTvs = gui.addFolder('LightTvStore')
lightTvs.add(pointLight1.position, 'x').min(-100).max(100).step(0.1)
lightTvs.add(pointLight1.position, 'y').min(0).max(200).step(0.1)
lightTvs.add(pointLight1.position, 'z').min(-100).max(100).step(0.1)


lightTvs
    .addColor(parameters, 'pointLight1Color')
    .onChange(() =>
    {
        pointLight1.color.set(parameters.pointLight1Color)
    })

var lightSecondStore = gui.addFolder('Light Second Store')
lightSecondStore.add(pointLight2.position, 'x').min(-100).max(100).step(0.1)
lightSecondStore.add(pointLight2.position, 'y').min(0).max(200).step(0.1)
lightSecondStore.add(pointLight2.position, 'z').min(-100).max(100).step(0.1)

lightSecondStore
    .addColor(parameters, 'pointLight2Color')
    .onChange(() =>
    {
        pointLight2.color.set(parameters.pointLight2Color)
    })



var lightAlley = gui.addFolder('Light Alley')
lightAlley.add(pointLight3.position, 'x').min(-100).max(100).step(0.1)
lightAlley.add(pointLight3.position, 'y').min(0).max(200).step(0.1)
lightAlley.add(pointLight3.position, 'z').min(-100).max(100).step(0.1)

lightAlley
    .addColor(parameters, 'pointLight3Color')
    .onChange(() =>
    {
        pointLight3.color.set(parameters.pointLight3Color)
    })


/**
 * Screens
 */

const video = document.getElementById( 'video' );
video.play();
const videoTexture = new THREE.VideoTexture( video );


const geometry = new THREE.PlaneGeometry(23,17,1,1);
const material = new THREE.MeshBasicMaterial( {map:videoTexture} );
const plane1 = new THREE.Mesh( geometry, material );
scene.add( plane1 );

plane1.position.x = -20.53;
plane1.position.y = 84.51;
plane1.position.z = -17.7;

var planeFolder = gui.addFolder('Plane1')
planeFolder.add(plane1.position,'x', -25.4).min(-30).max(-15).step(0.01)
planeFolder.add(plane1.position,'y', 86.2).min(75).max(85).step(0.01)
planeFolder.add(plane1.position,'z', -13.1).min(-25).max(-15).step(0.01)



/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

const controls = new FlyControls( camera, renderer.domElement );
controls.movementSpeed = 100;
controls.rollSpeed = Math.PI / 24;
controls.autoForward = false;
controls.dragToLook = true;

let cameraDirection = new THREE.Vector3()
let camPositionSpan, camLookAtSpan

camPositionSpan = document.querySelector("#position");
camLookAtSpan = document.querySelector("#lookingAt");

/**
 * Post processing
 */

// Render target

const renderTarget = new THREE.WebGLRenderTarget(
    800,
    600,
    {
        samples: renderer.getPixelRatio() === 1? 2 : 0
    }
)

 const effectComposer = new EffectComposer(renderer, renderTarget)
 effectComposer.setSize(sizes.width, sizes.height)
 effectComposer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

 const renderPass = new RenderPass(scene, camera)

// UNREAL BLOOM
const unrealBloomPass = new UnrealBloomPass()



unrealBloomPass.strength = 1.8
unrealBloomPass.radius = 1.7
unrealBloomPass.threshold = 0.1
unrealBloomPass.enabled = false

effectComposer.addPass(renderPass)
effectComposer.addPass(unrealBloomPass)

gui.add(unrealBloomPass, 'enabled')
gui.add(unrealBloomPass, 'strength').min(0).max(5).step(0.001)
gui.add(unrealBloomPass, 'radius').min(0).max(5).step(0.001)
gui.add(unrealBloomPass, 'threshold').min(0).max(4).step(0.001)

gui.add( parameters, 'exposure', 0.1, 2 ).onChange( function ( value ) {
    renderer.toneMappingExposure = Math.pow( value, 4.0 );
} );

// SMAAPASS

if(renderer.getPixelRatio() === 1 && !renderer.capabilities.isWebGL2){
    const smaaPass = new SMAAPass()
    effectComposer.addPass(smaaPass)

    console.log('Using SMAA')
}
/**
 * Animate
 */
const clock = new THREE.Clock()
let lastElapsedTime = 0

// wheel event

let direction = null
let prevSectionNumber = 1
let sectionNumber = 1
let section = null
window.addEventListener('wheel',(e)=>{
    const wheel = new Wheel()
    wheel.on('wheel', (_direction) =>
        {
            if(_direction === 1){
                // we move forward through the sections up to section 5
                if(sectionNumber<5){
                    sectionNumber+=1;
                    const prevSection = document.getElementById(`section${prevSectionNumber}`);
                    prevSection.classList.remove('visible');
                    prevSectionNumber+=1;
                }
            }
            else if(_direction === - 1){
                // we move backwards through the sections up to section 1
                if(sectionNumber>1){ 
                    sectionNumber-=1
                    const prevSection = document.getElementById(`section${prevSectionNumber}`);
                    prevSection.classList.remove('visible');
                    prevSectionNumber-=1;
                }        
            }
            
        })
    section = document.getElementById(`section${sectionNumber}`)
    section.classList.add('visible')
})  


const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - lastElapsedTime
    lastElapsedTime = elapsedTime

    // Update controls
    controls.update(0.01)

    // calculate and display the vector values on screen
    // this copies the camera's unit vector direction to cameraDirection
    camera.getWorldDirection(cameraDirection)
    // scale the unit vector up to get a more intuitive value
    cameraDirection.set(cameraDirection.x * 100, cameraDirection.y * 100, cameraDirection.z * 100)

    
    // update the onscreen spans with the camera's position and lookAt vectors
    // camPositionSpan.innerHTML = `Position: (${camera.position.x.toFixed(1)}, ${camera.position.y.toFixed(1)}, ${camera.position.z.toFixed(1)})`
    // camLookAtSpan.innerHTML = `LookAt: (${(camera.position.x + cameraDirection.x).toFixed(1)}, ${(camera.position.y + cameraDirection.y).toFixed(1)}, ${(camera.position.z + cameraDirection.z).toFixed(1)})`


    // Render
    // renderer.render(scene, camera)
    effectComposer.render()

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)

    
}

tick()