import { DAMAGE } from "../../damage.js";
import { Physic_Manager } from "../../modules/cannon_model_manager.js";
import { State } from "./State.js";
import * as THREE from 'three';

export class PunchState extends State {
    constructor(parent) {
        super(parent);
        this._action = null;
        this._FinishedCallback = () => {
            this._Finished();
        }
    }

    get Name() {
        return 'punch';
    }

    handlePhysicAttack(){
        Physic_Manager.model[this._parent.charName].isAttacking = true;
        const playername = this._parent.charName;
        for (const key in Physic_Manager.model) {
            const element = Physic_Manager.model[key];
            if (key != playername && element.isCollision) {
                element.isBeingAttacked = true;
                element.decreaseHp = DAMAGE[this._parent.charName].punch;
            }
        }
    }

    Enter(prevState) {
        this.handlePhysicAttack();
        this._action = this._parent._proxy._animations['punch'];
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