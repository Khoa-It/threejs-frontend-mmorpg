import { changeAction, MonsterState } from "./monter_state.js";

export class DefendState extends MonsterState {
    constructor(fsm) {
        super(fsm);
    }
    get Name(){
        return 'defend';
    }
    enter(prevState){
        const curAction = this.fsm.proxy.animations['defend'];
        if (prevState) {
            const prevAction = this.fsm.proxy.animations[prevState.Name];
            changeAction(curAction, prevAction);
        }
        curAction.play();
    }
    exit(){

    }
    update(){
        
    }
}