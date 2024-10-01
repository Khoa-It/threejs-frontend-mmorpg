import * as THREE from 'three'
import { GraphicModelManager } from "../../modules/three_model_manager.js";
import { changeAction, MonsterState } from "./monter_state.js";
import { AI_Entity } from '../../modules/yuka_model_manager.js';

export class WalkingState extends MonsterState {
    constructor(fsm) {
        super(fsm);
    }
    get Name() {
        return 'walking';
    }
    enter(prevState) {
        const curAction = this.fsm.proxy.animations['walking'];
        if (prevState) {
            const prevAction = this.fsm.proxy.animations[prevState.Name];
            changeAction(curAction, prevAction);
        } else {
            curAction.play();
        }
        AI_Entity.initSeekBehavior(this.fsm.name, 'woman_warior');
    }

    exit() {
        AI_Entity.removeSeekBehavior(this.fsm.name);
    }

    update(_, name = 'monster', distance = 1) {
        let target = new THREE.Vector3();
        target.copy(GraphicModelManager.model['woman_warior'].position);
        AI_Entity.info[name].graphicModel.lookAt(target);

        if (distance >= 0.4 && distance < 5) {
            this.fsm.SetState('walking');
        } else if(distance < 0.4 && this.fsm.canAttack) {
            this.fsm.SetState('punch');
        } else{
            this.fsm.SetState('idle');
        }
    }
}