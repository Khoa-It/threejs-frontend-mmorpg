import { changeAction, MonsterState } from "./monter_state.js";
import * as THREE from 'three';

export class DeathState extends MonsterState {
    constructor(fsm) {
        super(fsm);
    }
    get Name() {
        return 'death';
    }
    enter(prevState) {
        const curAction = this.fsm.proxy.animations['death'];
        if (prevState) {
            const prevAction = this.fsm.proxy.animations[prevState.Name];
            changeAction(curAction, prevAction);
            curAction.setLoop(THREE.LoopOnce);
            curAction.clampWhenFinished = true;
        }
        curAction.play();
    }
    exit() {

    }
    update() {

    }
}