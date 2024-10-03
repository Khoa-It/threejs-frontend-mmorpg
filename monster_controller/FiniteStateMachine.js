export class FiniteStateMachine {
    constructor() {
        this._states = {};
        this._currentState = null;
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

    Update(timeElapsed, distance) {
        if (this._currentState) {
            this._currentState.update(timeElapsed, distance);
        }
    }
};