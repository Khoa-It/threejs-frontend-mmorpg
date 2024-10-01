import { GraphicModelManager } from "./three_model_manager.js";

export class BehaviorEntity {
    constructor(name = 'monster', checkPlayer = false) {
        this.graphicModel = GraphicModelManager.model[name];
        this.aiModel = new YUKA.Vehicle();
        this.isSeekBehavior = false;
        this.targetEntity = new YUKA.GameEntity();
        this.behavior = null;
        this.isPlayer = checkPlayer;
        this.name = name;
        this.aiModel.maxSpeed = 0.2;
    }

    update(deltaTime){
        if(!this.aiModel) return;
        this.aiModel.update(deltaTime);
        if (this.isPlayer) {
            this.aiModel.position.copy(this.graphicModel.position);
        }else{
            this.graphicModel.position.copy(this.aiModel.position);
        }
        this.targetEntity.position.copy(this.aiModel.position);
    }
}