export class FiniteStateMachine {
    constructor() {
        this._states = {};
        this._currentState = null;
        this.canAttack = true;

        setInterval(() => {
            console.log(1);
            
            this.canAttack = !this.canAttack;
        }, 3000);
    }

    _AddState(name, type) {
        this._states[name] = type;
    }

    SetState(name) {
        const prevState = this._currentState;
        if (prevState) {
            if (prevState.Name == name) {
                return;
            }
            prevState.exit();
        }
        const state = new this._states[name](this);
        this._currentState = state;
        state.enter(prevState);
    }

    Update(timeElapsed, name, distance) {
        if (this._currentState) {
            this._currentState.update(timeElapsed, name, distance);
        }
    }
};