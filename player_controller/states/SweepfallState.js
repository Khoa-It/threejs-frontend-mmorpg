import { State } from "./State.js";
import * as THREE from 'three';

export class SweepfallState extends State {
    constructor(parent) {
        super(parent);
        this.action = null;
        this.canMoveOtherState = false;
    }

    get Name() {
        return 'sweepfall';
    }

    checkEndAnimation(){
        if (!this.action) return;
        const duration = this.action.getClip().duration;
        const currentTime = this.action.time;
        const timeLeft = duration - currentTime;
        if (timeLeft < 1) this.canMoveOtherState = true;
    }

    Enter(prevState) {
        const idleAction = this._parent._proxy._animations['sweepfall'];
        this.action = idleAction;
        if (prevState) {
            const prevAction = this._parent._proxy._animations[prevState.Name];
            idleAction.time = 0.0;
            idleAction.enabled = true;
            idleAction.setEffectiveTimeScale(1.0);
            idleAction.setEffectiveWeight(1.0);
            idleAction.crossFadeFrom(prevAction, 0.25, true);
            idleAction.play();
            idleAction.setLoop(THREE.LoopOnce);
            idleAction.clampWhenFinished = true;
        } else {
            idleAction.play();
        }
    }

    Exit() {
    }

    Update(_, input) {
        this.checkEndAnimation();
        if(this.canMoveOtherState) {
            this._parent.SetState('idle');
        }
    }
}