import * as THREE from 'three'
import { CharacterController } from './CharacterController.js';
import { ThirdPersonCamera } from '../modules/ThirdPersonCamera.js';
import { GraphicModelManager } from '../modules/three_model_manager.js';

export class Character {
    constructor(environment = { scene, camera }, charName, physicWorld) {
        this.environment = environment;
        this.controller = new CharacterController(environment, charName, physicWorld);
        // document.addEventListener('keydown', (e) => {
        //     console.log(GraphicModelManager.model[charName].position);
        // })
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





