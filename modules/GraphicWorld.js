import * as THREE from 'three';
import { GraphicModelManager } from './three_model_manager.js';

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

        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        
        this.scene.fog = new THREE.FogExp2(0xffffff, 0.5);  // Màu trắng với độ đậm dần theo khoảng cách
        // this.orbitControls = new OrbitControls(this.camera, this.renderer.domElement);
    }
    
    improvePerformance(model){
        this.scene.traverse((object) => {
            if (object.isMesh) {
                const distance = model.position.distanceTo(object.position);                
                object.visible = distance <= 10; // Hiển thị nếu trong phạm vi 50 đơn vị
            }
        });
    }

    removeModel(key){
        this.scene.remove(GraphicModelManager.getGraphicModelByKey(key));
        GraphicModelManager.removeGraphicModel(key);
    }
}