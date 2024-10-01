// import * as YUKA from 'yuka';
import { GraphicModelManager } from './three_model_manager.js';
import { ControlAndSystem } from './ControlAndSystem.js';
import { MODELS } from '../assets.js';
import { BehaviorEntity } from './BehaviorEntity.js';
import { FSM_NPC } from '../monster_controller/fsm_manager.js';


export class AI_Entity {
    static info = {};
    static entityManager = new YUKA.EntityManager();

    static createAIController(name = 'monster', checkPlayer = false) {
        this.info[name] = new BehaviorEntity(name, checkPlayer);
        const pos = MODELS[name]['position'];
        this.info[name].aiModel.position.set(...pos);
        this.entityManager.add(this.info[name].aiModel);
        return this.info[name];
    }

    static updateByKey(deltaTime, key) {
        if (Object.keys(this.info).length === 0) return;
        if (!this.info[key]) return;
        const element = this.info[key];
        element.update(deltaTime);
    }

    static initSeekBehavior(sourceKey = 'monster', destinationKey = 'woman_warior'){
        if(this.info[sourceKey].isSeekBehavior) return;
        const target = this.info[destinationKey].targetEntity;
        this.info[sourceKey].behavior = new YUKA.SeekBehavior(target.position);
        this.info[sourceKey].aiModel.steering.add(this.info[sourceKey].behavior);
        this.info[sourceKey].isSeekBehavior = true;
    }

    static removeSeekBehavior(sourceKey = 'monster') {
        if(!this.info[sourceKey].isSeekBehavior) return;
        this.info[sourceKey].aiModel.steering.remove(this.info[sourceKey].behavior);
        this.info[sourceKey].aiModel.velocity.set(0, 0, 0);
        this.info[sourceKey].isSeekBehavior = false; 
        this.info[sourceKey].behavior = null;
    }
    
}
