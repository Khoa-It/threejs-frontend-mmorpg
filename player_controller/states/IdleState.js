import { State } from "./State.js";

export class IdleState extends State {
    constructor(parent) {
        super(parent);
    }

    get Name() {
        return 'idle';
    }

    Enter(prevState) {
        const idleAction = this._parent._proxy._animations['idle'];
        
        if (prevState) {
            const prevAction = this._parent._proxy._animations[prevState.Name];
            idleAction.time = 0.0;
            idleAction.enabled = true;
            idleAction.setEffectiveTimeScale(1.0);
            idleAction.setEffectiveWeight(1.0);
            idleAction.crossFadeFrom(prevAction, 0.25, true);
            idleAction.play();
        } else {
            idleAction.play();
        }
    }

    Exit() {
    }

    Update(_, input) {
        if (input._keys.forward ) {
            this._parent.SetState('run');
        } else if (input._keys.space) {
            this._parent.SetState('normalskill');
        }else if(input._keys.backward){
            this._parent.SetState('walkback');  
        } else{
            this._parent.SetState('idle')
        }
    }
};