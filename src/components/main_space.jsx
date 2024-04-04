import React, { Component } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import Stats from 'three/examples/jsm/libs/stats.module'

class MainSpace extends Component {

    constructor(props) {
        super(props);
        this.fbxLoader = new FBXLoader();
        this.scene = new THREE.Scene();
        //this.model = null;
        this.meshes = []; // Array to store references to mesh objects
    }

    componentDidMount() {
        this.sceneSetup();
        this.loadModel();
        this.startAnimationLoop();
    } 

    componentDidUpdate(prevProps) {
        // Check if the colors prop has changed
        if (prevProps.colors !== this.props.colors) {
            // Update colors of meshes
            this.updateMeshColors();
        }
    }

    loadModel() {
        this.fbxLoader.load(
            'couch.fbx',
            (object) => {
                object.traverse((child) => {
                    if (child.isMesh && child.material) {
                        console.log(child)
                        // Store reference to mesh
                        if (child.name == 'espaldar_sofa' || child.name == 'sofa_brazos'){
                            this.meshes.push(child);

                        }
                        
                    }
                });
                this.scene.add(object);
                //this.model = object
                this.controls.target.copy(object.position)
                this.camera.position.x = -70

                this.camera.position.y = 100
                this.camera.position.z = 150

                this.updateMeshColors(); // Update colors initially
            },
            (xhr) => {
                console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
            },
            (error) => {
                console.log(error);
            }
        );
    }

    updateMeshColors() {
        const { colors } = this.props;
        this.meshes.forEach((mesh, index) => {
            if (colors && colors[index]) {
                const { r, g, b } = colors[index]; //Get the RGB Values from the color object in the array

                //Convert the RGB Values to (0,1) range expected by Three.Js
                mesh.material.color.setRGB(r/255, g/255, b/255);
            }
        });

    }

  sceneSetup = () => {

    // create scene, camera, renderer
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth / 3, window.innerHeight / 3);
    this.mount.appendChild(this.renderer.domElement);

    this.scene.add(new THREE.AxesHelper(5))

    // const light = new THREE.PointLight(0xffffff, 50)
    // light.position.set(0.8, 1.4, 1.0)
    // this.scene.add(light)

    const ambientLight = new THREE.AmbientLight()
    this.scene.add(ambientLight)

    // create cube and add it to the scene
    // const geometry = new THREE.BoxGeometry(1, 1, 1);
    // this.material = new THREE.MeshBasicMaterial({ color: 0xffffff });
    // this.cube = new THREE.Mesh(geometry, this.material);
    // this.cube.rotateX = 50;
    // this.scene.add(this.cube);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.controls.enableDamping = true
    //this.controls.target.set(0, 1, 0)

    this.stats = new Stats()
    this.mount.appendChild(this.stats.dom)


  }

  startAnimationLoop = () => {
    this.renderer.render(this.scene, this.camera);

    this.controls.update();
    this.stats.update()
    this.requestID = window.requestAnimationFrame(this.startAnimationLoop);
  }

  componentWillUnmount() {
    window.cancelAnimationFrame(this.requestID);
    this.mount.removeChild(this.renderer.domElement);
  }


  render() {

    return (
      <div
        ref={(mount) => { this.mount = mount }}
        style={{ width: '100%', height: '100%' }}
      />
    );
  }
}

export default MainSpace