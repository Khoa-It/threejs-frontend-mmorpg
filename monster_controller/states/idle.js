import { changeAction, MonsterState } from "./monter_state.js";

export class IdleState extends MonsterState {
    constructor(fsm) {
        super(fsm);
    }
    get Name() {
        return 'idle';
    }
    enter(prevState) {
        const idleAction = this.fsm.proxy.animations['idle'];
        if (prevState) {
            const prevAction = this.fsm.proxy.animations[prevState.Name];
            changeAction(idleAction, prevAction);
        } else {
            idleAction.play();
        }
    }

    exit() {
    }

    update(_, distance = 1) {

        if (distance >= 0.4 && distance < 5) {
            this.fsm.SetState('walking');
        } else if (distance < 0.4) {
            this.fsm.SetState('normalskill');
        } else {
            this.fsm.SetState('idle');
        }

    }
}