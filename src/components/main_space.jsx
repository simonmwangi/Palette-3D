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
        this.childNames = []
        this.meshes = []; // Array to store references to mesh objects

        this.sizes = {
            width: window.innerWidth ,
            height: window.innerHeight
        }
    }

    componentDidMount() {
        this.sceneSetup();
        this.loadModel();
        this.canvas = document.querySelector('.webgl');
        this.startAnimationLoop();
    } 

    componentDidUpdate(prevProps) {
      this.canvas = document.querySelector('.webgl');
        // Check if the colors prop has changed
        if (prevProps.colors !== this.props.colors) {
            // Update colors of meshes
            this.updateMeshColors();
        }
    }

    loadModel() {
        this.fbxLoader.load(
            'open_house.fbx',
            (object) => {

                object.traverse((child) => {
                    if (child.isMesh && child.material) {

                        // Store reference to mesh
                        if(!this.childNames.includes(child.name)){
                          this.childNames.push(child.name)
                          this.meshes.push(child);
                        }
                        
                    }
                });
                console.log(this.meshes)

                this.scene.add(object);
                this.model = object
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

    //TODO Fix Updating Colors from Palette to Meshes
    updateMeshColors() {
        const { colors } = this.props;
        console.log("COlors", colors)
        this.meshes.forEach((mesh, index) => {
            if (colors && colors[index]) {
                console.log("Changed Color at",index,"for", mesh.name)
                const { r, g, b } = colors[index]; //Get the RGB Values from the color object in the array

                //Convert the RGB Values to (0,1) range expected by Three.Js
                mesh.material.color.setRGB(r/255, g/255, b/255);
            }
        });

    }

  sceneSetup = () => {

    var canvas = document.querySelector('.webgl')
    console.log(canvas)

    // create scene, camera, renderer
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xffffff);
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({canvas: this.canvas});
    this.renderer.setSize(this.sizes.width , this.sizes.height);
    this.mount.appendChild(this.renderer.domElement);

    this.scene.add(new THREE.AxesHelper(5))

    // const light = new THREE.PointLight(0xffffff, 50)
    // light.position.set(0.8, 1.4, 1.0)
    // this.scene.add(light)

    const ambientLight = new THREE.AmbientLight(0xffffff,1)
    this.scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff,1)
    directionalLight.position.set(500,700,-500);
    directionalLight.castShadow = true;
    const dlHelper = new THREE.DirectionalLightHelper(directionalLight, 50)
    this.scene.add(directionalLight, dlHelper)

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
    this.stats.dom.style.position = 'absolute';
    //this.stats.dom.style.top = '20px';
    this.stats.dom.style.left = '230px';
    this.mount.appendChild(this.stats.dom)


    // Create materials from the color palette
    const palette = [0xff0000, 0x00ff00, 0x0000ff];
    this.materials = palette.map(color => new THREE.MeshStandardMaterial({ color : new THREE.Color(color) }));


    // Raycasting to select and change mesh color
    let selectedMesh = null;
    const sceneMeshes = [];
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.arrowHelper = new THREE.ArrowHelper(
      new THREE.Vector3(),
      new THREE.Vector3(),
      20,
      0xff0000
    );
    this.scene.add(this.arrowHelper);

    document.addEventListener('mousemove', (event) => {
        this.mouse.x = ((event.clientX - this.renderer.domElement.offsetLeft) / this.renderer.domElement.width) * 2 - 1;
        this.mouse.y = -((event.clientY - this.renderer.domElement.offsetTop) / this.renderer.domElement.height) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, this.camera);

        const intersects = this.raycaster.intersectObjects(this.model.children, false);



        if (intersects.length > 0) {
          if (selectedMesh) {
            selectedMesh.material.color.set(0xffffff)
          }
          selectedMesh = intersects[0].object
          selectedMesh.material.color.set(0xfffff0)
          // console.log(sceneMeshes.length + " " + intersects.length)
          console.log(intersects[0])
          console.log(intersects[0].object.name + " " + intersects[0].distance)
          //intersects[0].object.material.color.set(0xff0000)
          // console.log(intersects[0].object.userData.name + " " + intersects[0].distance + " ")
          // console.log((intersects[0].face as THREE.Face).normal)
          // line.position.set(0, 0, 0)
          // line.lookAt((intersects[0].face as THREE.Face).normal)
          // line.position.copy(intersects[0].point)
  
          const n = new THREE.Vector3()
          n.copy((intersects[0].face ).normal)
          n.transformDirection(intersects[0].object.matrixWorld)
  
          this.arrowHelper.setDirection(n)
          this.arrowHelper.position.copy(intersects[0].point)
      }
    }, false);

    document.addEventListener('click', () => {
      console.log("Yes")
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const click_intersects = this.raycaster.intersectObjects(this.model.children, false);

        if (selectedMesh && click_intersects.length > 0) {
          selectedMesh.material.color.set(0xff0000)
        }

    });

    window.addEventListener('resize', () => {
      // Update sizes
      this.sizes.width = window.innerWidth
      this.sizes.height = window.innerHeight

      // Update camera
      this.camera.aspect = this.sizes.width / this.sizes.height
      this.camera.updateProjectionMatrix()

      // Update renderer
      this.renderer.setSize(this.sizes.width, this.sizes.height);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });

  window.addEventListener('dblclick', () => {
      const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement

      if (!fullscreenElement) {
          if (this.canvas.requestFullscreen) {
              this.canvas.requestFullscreen()
          }
          else if (this.canvas.webkitRequestFullscreen) {
              this.canvas.webkitRequestFullscreen()
          }
      }
      else {
          if (document.exitFullscreen) {
              document.exitFullscreen()
          }
          else if (document.webkitExitFullscreen) {
              document.webkitExitFullscreen()
          }
      }
  });


  }

  startAnimationLoop = () => {
    this.renderer.render(this.scene, this.camera);

    this.controls.update();
    this.stats.update()
    this.requestID = window.requestAnimationFrame(this.startAnimationLoop);
  }

  componentWillUnmount() {
    this.canvas = document.querySelector('.webgl');
    window.cancelAnimationFrame(this.requestID);
    this.mount.removeChild(this.renderer.domElement);
  }


  render() {

    return (
      <div
        ref={(mount) => { this.mount = mount }}
      />
    );
  }
}

export default MainSpace