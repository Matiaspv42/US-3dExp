import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import * as dat from 'lil-gui'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { GammaCorrectionShader } from 'three/examples/jsm/shaders/GammaCorrectionShader.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import { RGBShiftShader } from 'three/examples/jsm/shaders/RGBShiftShader.js'
import {SMAAPass} from 'three/examples/jsm/postprocessing/SMAAPass.js'

/**
 * Debug
 */
 const gui = new dat.GUI()
const parameters = {
    pointLight1Color: 0x5d8bee,
    intensityLight1: 3,
    decayLight1:100,
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
camera.position.x = -100
camera.position.y = 1
camera.position.z = 1
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Models
 */
 const gltfLoader = new GLTFLoader()

 gltfLoader.load(
    '/models/Background.glb',
    (gltf) =>
    {   console.log(gltf.scene)
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

const ambientLight = new THREE.AmbientLight( 0x404040, 3 ); // soft white light
// scene.add( ambientLight);

// console.log(ambientLight);

const pointLight1 = new THREE.PointLight( parameters.pointLight1Color, 3, 100 );
pointLight1.position.set( -23, 119, -5.7 );
const pointLightHelper1 = new THREE.PointLightHelper( pointLight1, 1 );
scene.add( pointLightHelper1 );
scene.add( pointLight1 );

const pointLight2 = new THREE.PointLight( parameters.pointLight2Color, 3, 100 );
pointLight2.position.set( -451, 106, -224.7 );
const pointLightHelper2 = new THREE.PointLightHelper( pointLight2, 1 );
// scene.add( pointLightHelper2 );
// scene.add( pointLight2 );

// directional

const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
const DirectionalLightHelper = new THREE.DirectionalLightHelper( directionalLight, 5 );
// scene.add( DirectionalLightHelper );


// debug

gui.add(pointLight1.position, 'x').min(-100).max(100).step(0.1)
gui.add(pointLight1.position, 'y').min(0).max(200).step(0.1)
gui.add(pointLight1.position, 'z').min(-100).max(100).step(0.1)

gui.add(pointLight2.position, 'x').min(-100).max(100).step(0.1)
gui.add(pointLight2.position, 'y').min(0).max(200).step(0.1)
gui.add(pointLight2.position, 'z').min(-100).max(100).step(0.1)

gui
    .addColor(parameters, 'pointLight1Color')
    .onChange(() =>
    {
        pointLight1.color.set(parameters.pointLight1Color)
    })


/**
 * Screens
 */

const video = document.getElementById( 'video' );
video.play();
const videoTexture = new THREE.VideoTexture( video );


const geometry = new THREE.PlaneGeometry(10,10,1,1);
const material = new THREE.MeshBasicMaterial( {map:videoTexture} );
const plane1 = new THREE.Mesh( geometry, material );
scene.add( plane1 );

plane1.position.x = -25.4;
plane1.position.y = 86.2;
plane1.position.z = -13.1;

var planeFolder = gui.addFolder('Plane1')
planeFolder.add(plane1.position,'x', -25.4).min(-100).max(100).step(0.1)
planeFolder.add(plane1.position,'y', 86.2).min(-100).max(100).step(0.1)
planeFolder.add(plane1.position,'z', -13.1).min(-100).max(100).step(0.1)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

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

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - lastElapsedTime
    lastElapsedTime = elapsedTime

    // Update controls
    controls.update()

    // Render
    // renderer.render(scene, camera)
    effectComposer.render()

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()