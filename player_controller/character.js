import * as THREE from 'three'
import { CharacterController } from './CharacterController.js';
import { ThirdPersonCamera } from '../modules/ThirdPersonCamera.js';
import { GraphicModelManager } from '../modules/three_model_manager.js';

export class Character {
    constructor(environment = { scene, camera }, charName, physicWorld) {
        this.environment = environment;
        this.controller = new CharacterController(environment, charName, physicWorld);
        document.addEventListener('keydown', (e) => {            
            if (e.key == ' ') {
                const x = GraphicModelManager.model[charName].position.x;
                const y = GraphicModelManager.model[charName].position.y;
                const z = GraphicModelManager.model[charName].position.z;
                const val = [x,y,z];
                console.log(JSON.stringify(val)+",");
            }
        })
    }

    update(time) {
        if (this.controller._mixer) {
            this.controller._mixer.update(time);
            this.controller.Update(time);
        }
        if (this.controller._model) {
            ThirdPersonCamera.update(this.environment.camera, this.controller._model);
        }
    }
}





