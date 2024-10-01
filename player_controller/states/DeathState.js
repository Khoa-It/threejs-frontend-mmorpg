import { State } from "./State.js";
import * as THREE from 'three';

export class DeathState extends State {
    constructor(parent) {
        super(parent);
        this._action = null;
    }

    get Name() {
        return 'death';
    }

    Enter(prevState) {
        this._action = this._parent._proxy._animations['death'];
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

    Exit() {
    }

    Update(_) {
    }
};