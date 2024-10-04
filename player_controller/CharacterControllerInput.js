import { Physic_Manager } from "../modules/cannon_model_manager.js";

export class CharacterControllerInput {
    constructor() {
        this._keys = {
            forward: false,
            backward: false,
            left: false,
            right: false,
            space: false,
            dash: false,
        }
        document.addEventListener('keydown', (e) => this.onKeyDown(e));
        document.addEventListener('keyup', (e) => this.onKeyUp(e));
    }
    onKeyUp(event) {
        switch (event.keyCode) {
            case 65:
                this._keys.left = false;
                break;
            case 83:
                this._keys.backward = false;
                break;
            case 87:
                this._keys.forward = false;
                break;
            case 68:
                this._keys.right = false;
                break;
            case 32:
                this._keys.space = false;
                break;
            case 88:
                this._keys.dash = false;
            default:
                break;
        }
    }
    onKeyDown(event) {
        console.log(event.keyCode);
        switch (event.keyCode) {
            case 65:
                this._keys.left = true;
                break;
            case 83:
                this._keys.backward = true;
                break;
            case 87:
                if (Physic_Manager.model['woman_warior'].isCollision)
                    this._keys.forward = false;
                else
                    this._keys.forward = true;
                break;
            case 68:
                this._keys.right = true;
                break;
            case 32:
                this._keys.space = true;
                break;
            case 88:
                this._keys.dash = true;
            default:
                break;
        }
    }
}

