import { DAMAGE } from "../../damage.js";
import { Physic_Manager } from "../../modules/cannon_model_manager.js";
import { changeAction, MonsterState } from "./monter_state.js";

export class PunchState extends MonsterState {
    constructor(fsm) {
        super(fsm);
    }
    get Name(){
        return 'punch';
    }

    handlePhysicAttack(){
        for (const key in Physic_Manager.model) {
            const element = Physic_Manager.model[key];
            if(key != this.fsm.name && element.isCollision){
                element.isBeingAttacked = true;
                element.decreaseHp = DAMAGE[this.fsm.name].punch;
            }
        }
        
    }

    async enter(prevState){
        
        const curAction = this.fsm.proxy.animations['punch'];
        if (prevState) {
            const prevAction = this.fsm.proxy.animations[prevState.Name];
            changeAction(curAction, prevAction, 5.0);
        }else{
            curAction.play();
        }
        this.handlePhysicAttack();
    }
    exit(){
    }
    update(_, name = 'monster', distance = 1){
        if (distance >= 0.4 && distance < 5) {
            this.fsm.SetState('walking');
        } else if (distance <0.4 && this.fsm.canAttack){
            this.fsm.SetState('punch');
        } else {
            this.fsm.SetState('idle');
        }
    }
}