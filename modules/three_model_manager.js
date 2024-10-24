export class GraphicModelManager {
    static model = {};

    static changePosition(modelName, pos){
        this.model[modelName].position.set(...pos);
    }

    static getGraphicModelByKey(key = 'monster'){
        return GraphicModelManager.model[key];
    }

    static removeGraphicModel(key){
        delete GraphicModelManager.model[key];
    }

    static addGraphicModel(key, model){
        GraphicModelManager.model[key] = model;
    }

}