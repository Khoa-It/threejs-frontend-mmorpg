import * as CANNON from 'https://cdn.jsdelivr.net/npm/cannon-es@0.18.0/dist/cannon-es.js';
import { GraphicModelManager } from './three_model_manager.js';

class PhysicModel{
    constructor(key, bodySize = [1, 1, 1]){
        this.body = new CANNON.Body({
            mass: 1,
            shape: new CANNON.Box(new CANNON.Vec3(...bodySize))
        });
        this.isCollision = false;
        this.isAttacking = false;
        this.isBeingAttacked = false;
        this.decreaseHp = 0;
        this.name = key;
        this.body.position.copy(GraphicModelManager.model[key].position)
    }
}

export class Physic_Manager {
    static model = {};

    static addPhysicModel(key, bodySize){
        Physic_Manager.model[key] = new PhysicModel(key, bodySize);
        return Physic_Manager.model[key].body;
    }

    static updateByKey(key) {
        Physic_Manager.model[key].body.position.copy(GraphicModelManager.model[key].position);
    }
}