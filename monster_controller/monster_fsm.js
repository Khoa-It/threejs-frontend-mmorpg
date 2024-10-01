
import { FiniteStateMachine } from "./FiniteStateMachine.js";
import { DeathState } from "./states/death.js";
import { DefendState } from "./states/defend.js";
import { IdleState } from "./states/idle.js";
import { KickState } from "./states/kick.js";
import { PunchState } from "./states/punch.js";
import { WalkingState } from "./states/walk.js";

export class MonsterFSM extends FiniteStateMachine {
    constructor(proxy, name){
        super();
        this.proxy = proxy;
        this.name = name;
        this.init();
    }
    init(){
        this._AddState('idle', IdleState);
        this._AddState('punch', PunchState);
        this._AddState('kick', KickState);
        this._AddState('death', DeathState);
        this._AddState('defend', DefendState);
        this._AddState('walking', WalkingState);
    }
}

export class MonsterProxy {
    constructor(animations){
        this.animations = animations;
    }
}