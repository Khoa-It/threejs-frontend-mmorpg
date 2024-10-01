import * as THREE from 'three';
export class MonsterState {
    constructor(fsm){
        this.fsm = fsm;
    }
    enter(){};
    exit(){};
    update(){};
}

export async function changeAction(curAction = new THREE.AnimationMixer().clipAction(), prevAction = new AnimationMixer().clipAction(), timescale = 1.0) {
    curAction.time = 0;
    curAction.enabled = true;
    curAction.setEffectiveTimeScale(1.0);
    curAction.setEffectiveWeight(timescale);
    curAction.crossFadeFrom(prevAction, 0.25, true);
    curAction.play();
    
}