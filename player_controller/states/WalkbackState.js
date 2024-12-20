import { State } from "./State.js";

export class WalkbackState extends State {
    constructor(parent) {
        super(parent);
    }

    get Name() {
        return 'walkback';
    }

    Enter(prevState) {
        
        const curAction = this._parent._proxy._animations['walkback'];
        if (prevState) {
            const prevAction = this._parent._proxy._animations[prevState.Name];
            curAction.enabled = true;
            curAction.time = 0.0;
            curAction.setEffectiveTimeScale(1.0);
            curAction.setEffectiveWeight(1.0);
            curAction.crossFadeFrom(prevAction, 0.1, true);
            curAction.play();
        } else {
            curAction.play();
        }
    }

    Exit() {
    }

    Update(_, input) {
        if (input._keys.forward) {
            this._parent.SetState('run');
        } else if (input._keys.space) {
            this._parent.SetState('normalskill');
        } else if(input._keys.backward){
            this._parent.SetState('walkback');  
        } else{
            this._parent.SetState('idle')
        }
    }
}