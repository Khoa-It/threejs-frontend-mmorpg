export class GraphicModelManager {
    static model = {};
    static changePosition(modelName, pos){
        this.model[modelName].position.set(...pos);
    }
}