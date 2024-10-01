import * as THREE from 'three';

export class GraphicWorld {
    constructor(){
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
        
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        document.body.appendChild( this.renderer.domElement );

        this.camera.position.set(0,3,1);
        this.ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(this.ambientLight);

        this.directionalLight = new THREE.DirectionalLight(0xffffff, 2);
        this.directionalLight.position.set(5, 10, 7.5);
        this.scene.add(this.directionalLight);

        this.directionalLight.castShadow = true;

        this.scene.fog = new THREE.FogExp2(0xffffff, 0.3);  // Màu trắng với độ đậm dần theo khoảng cách
        // this.orbitControls = new OrbitControls(this.camera, this.renderer.domElement);
    }
    
}