import * as THREE from 'three';

import { FiniteStateMachine } from './FiniteStateMachine.js';
import { IdleState } from './states/IdleState.js';
import { RunState } from './states/RunState.js';
import { DeathState } from './states/DeathState.js';
import { PunchState } from './states/PunchState.js';
import { WalkbackState } from './states/WalkbackState.js';
import { SweepfallState } from './states/SweepfallState.js';


export class CharacterFSM extends FiniteStateMachine {
    constructor(proxy, mixer, charName) {
        super();
        this.mixer = mixer;
        this._proxy = proxy;
        this.charName = charName;
        this._Init();
    }
    _Init() {
        this._AddState('idle', IdleState);
        this._AddState('run', RunState);
        this._AddState('punch', PunchState);
        this._AddState('death', DeathState);
        this._AddState('walkback', WalkbackState);
        this._AddState('sweepfall', SweepfallState);
    }
};

export class BasicCharacterControllerProxy {
    constructor(animations) {
        this._animations = animations;
    }

    get animations() {
        return this._animations;
    }
};




