
class StateModel {
    constructor() {
        this.isAttacking = false;
        this.isBeingAttacked = false;
        this.damageReceived = 0;
        this.isPlayer = false;
    }
}

export class State_Manager {
    static model = {};
    
    static addStateModel(key = 'nameEntity'){
        State_Manager.model[key] = new StateModel();
    }

    static isPlayerLoaded(){
        for (const key in State_Manager.model) {
            const element = State_Manager.model[key];
            if (element.isPlayer) {
                return true;
            }
        }
        return false;
    }
}

