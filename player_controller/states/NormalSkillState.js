import { DAMAGE } from "../../damage.js";
import { StatManager } from "../../manager_system/StatManager.js";
import { Physic_Manager } from "../../modules/cannon_model_manager.js";
import { State_Manager } from "../../modules/state_model_manager.js";
import { State } from "./State.js";
import * as THREE from 'three';

export class NormalSkillState extends State {
    constructor(parent) {
        super(parent);
        this._action = null;
        this._FinishedCallback = () => {
            this._Finished();
        }
    }

    get Name() {
        return 'normalskill';
    }

    handleNormalAttack(){
        State_Manager.model[this._parent.charName].isAttacking = true;
        const playername = this._parent.charName;
        
        for (const key in Physic_Manager.model) {
            const element = Physic_Manager.model[key].body;
            if (key != playername && element.isCollision) {
                State_Manager.model[key].isBeingAttacked = true;
                // State_Manager.model[key].damageReceived = DAMAGE[this._parent.charName].normal_attack;
                State_Manager.model[key].damageReceived = StatManager.calculateAttack();
            }
        }
    }

    Enter(prevState) {
        this.handleNormalAttack();
        this._action = this._parent._proxy._animations['normalskill'];
        const mixer = this._action.getMixer();
        mixer.addEventListener('finished', this._FinishedCallback);
        if (prevState) {
            const prevAction = this._parent._proxy._animations[prevState.Name];
            this._action.reset();
            this._action.setLoop(THREE.LoopOnce, 1);
            this._action.clampWhenFinished = true;
            this._action.crossFadeFrom(prevAction, 0.2, true);
            this._action.play();
        } else {
            this._action.play();
        }
    }

    _Finished() {
        this._Cleanup();
        this._parent.SetState('idle');
    }

    _Cleanup() {
        if (this._action) {
            this._action.getMixer().removeEventListener('finished', this._FinishedCallback);
        }
    }

    Exit() {
        Physic_Manager.model[this._parent.charName].isAttacking = false;
        this._Cleanup();
    }

    Update(_) {
    }
};