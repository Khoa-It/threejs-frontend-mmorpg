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

    static isAllKeyExisted(arr_key = []){
        return arr_key.every((key) => {
            return GraphicModelManager.model[key] != undefined;
        })
    }

    static checkKeyExisted(key){
        return GraphicModelManager.model[key] != undefined;
    }

}