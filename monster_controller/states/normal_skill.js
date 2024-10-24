import { DAMAGE } from "../../damage.js";
import { Physic_Manager } from "../../modules/cannon_model_manager.js";
import { State_Manager } from "../../modules/state_model_manager.js";
import { GraphicModelManager } from "../../modules/three_model_manager.js";
import { changeAction, MonsterState } from "./monter_state.js";
import * as THREE from 'three';

export class NormalSkillState extends MonsterState {
    constructor(fsm) {
        super(fsm);
        this.action = null;
        this.isHandlePhysicAttackedComplete = false;
    }
    get Name() {
        return 'normalskill';
    }

    checkEndAnimation() {
        if (!this.action) return;
        const duration = this.action.getClip().duration;
        const currentTime = this.action.time;
        const timeLeft = duration - currentTime;
        if (timeLeft < 1) this.handleNormalAttack();
    }

    isFacingWithPlayer() {
        const playerPosition = GraphicModelManager.model['woman_warior'].position;
        const monsterPosition = GraphicModelManager.model[this.fsm.name].position;
        const directionVector = playerPosition.clone().sub(monsterPosition).normalize();

        const monsterForward = new THREE.Vector3(0, 0, 1).applyQuaternion(GraphicModelManager.model[this.fsm.name].quaternion).normalize();

        // Kiểm tra góc giữa hướng của quái thú và hướng từ quái thú tới nhân vật
        const angle = monsterForward.angleTo(directionVector);

        // Nếu góc nhỏ hơn 45 độ (hoặc tùy chỉnh theo ý muốn), cho phép tấn công
        if (angle < Math.PI / 4) {
            return true;
        }
        return false;
    }

    handleNormalAttack() {
        if (this.isHandlePhysicAttackedComplete) return;
        State_Manager.model[this.fsm.name].isAttacking = true;
        for (const key in Physic_Manager.model) {
            const element = Physic_Manager.model[key].body;
            if (key != this.fsm.name && element.isCollision && this.isFacingWithPlayer()) {
                State_Manager.model[key].isBeingAttacked = true;
                State_Manager.model[key].damageReceived = DAMAGE[this.fsm.name].normal_attack;
                this.isHandlePhysicAttackedComplete = true;
            }
        }
    }

    

    async enter(prevState) {
        const curAction = this.fsm.proxy.animations['normalskill'];
        this.action = curAction;
        if (prevState) {
            const prevAction = this.fsm.proxy.animations[prevState.Name];
            changeAction(curAction, prevAction, 5.0);
        } else {
            curAction.play();
        }

    }

    exit() {
    }

    update(_, distance = 1) {
        this.checkEndAnimation();
        if (distance >= 0.4 && distance < 5) {
            this.fsm.SetState('walking');
        } else if (distance < 0.4) {
            this.fsm.SetState('normalskill');
        } else {
            this.fsm.SetState('idle');
        }
    }
}