import { GraphicModelManager } from "../modules/three_model_manager.js";
export class DistanceManager {
    static calculateDistance(key1 = 'haha', key2 = 'hoho') {
        let position1 = GraphicModelManager.model[key1].position;
        let position2 = GraphicModelManager.model[key2].position;
        return Math.abs(position1.distanceTo(position2));
    }
}