import { changeAction, MonsterState } from "./monter_state.js";

export class KickState extends MonsterState {
    constructor(fsm) {
        super(fsm);
    }
    get Name() {
        return 'kick';
    }
    enter(prevState){
        const curAction = this.fsm.proxy.animations['kick'];
        if (prevState) {
            const prevAction = this.fsm.proxy.animations[prevState.Name];
            changeAction(curAction, prevAction);
        }
        curAction.play();
    }
    exit(){}
    update(){

    }
}