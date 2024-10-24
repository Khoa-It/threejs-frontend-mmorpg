import * as THREE from 'three';
import { ModelLoader } from '../modules/ModelLoader.js';
import { MODELS } from '../assets.js';
import { GraphicModelManager } from '../modules/three_model_manager.js';
import { State_Manager } from '../modules/state_model_manager.js';

export class FireBall {
    constructor(param={graphicWorld: {scene, camera}}) {
        this.vertexShader = `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
            `;

        this.fragmentShader = `
            uniform float time;
            varying vec2 vUv;

            void main() {
                float fire = abs(sin(vUv.y * 10.0 + time)) * 0.8 + 0.2;
                gl_FragColor = vec4(fire, fire * 0.5, 0.0, 1.0); // Màu cam đỏ của lửa
            }
            `;

        this.fireMaterial = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0.0 }
            },
            vertexShader: this.vertexShader,
            fragmentShader: this.fragmentShader,
            transparent: true,
            blending: THREE.AdditiveBlending
        });

        this.isLoaded = false;

        this.orbitRadius = 0.5;  
        this.angle = 0;  
        this.speed = 0.1;

        this.geometry = new THREE.SphereGeometry(1 / 20, 32, 32); // Tạo aura dạng hình cầu
        this.mesh = new THREE.Mesh(this.geometry, this.fireMaterial);

        this.mesh.position.set(0,0.5,0);

        this.param = param;
        this.param.graphicWorld.scene.add(this.mesh);


        this.magicCircle = ModelLoader.loadGtlfFile(
            MODELS['magic_circle'].fire, 
            this.param.graphicWorld.scene, 
            MODELS['magic_circle'].position, 
            MODELS['magic_circle'].scale,
            this.magicCircleConfiguration,
            'fireball'
        );
        
    }

    magicCircleConfiguration(model){
        model.rotation.x = Math.PI /2;
    }

    magicCircleUpdate(){   
        if (!GraphicModelManager.model['fireball']) return;
        const player = GraphicModelManager.model['woman_warior'];
        const magicCircle = GraphicModelManager.model['fireball'];

        const forward = new THREE.Vector3(0,0,0.5).applyQuaternion(player.quaternion);
        const position = player.position.clone().add(forward);
        magicCircle.position.copy(position);
        magicCircle.position.y += 0.3;
        
        const lookatPosition = player.position.clone().add(new THREE.Vector3(0,-5,0));
        magicCircle.lookAt(lookatPosition);
    }

    setload(){
        if (GraphicModelManager.model['fireball']) {
            this.isLoaded = true;
        }
    }

    update(){
        if (!State_Manager.isPlayerLoaded()) return;
        this.setload();
        if(!this.isLoaded) return;
        this.magicCircleUpdate();
    }
}