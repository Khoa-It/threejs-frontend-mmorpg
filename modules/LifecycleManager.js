export class LifecycleManager {
    static components = {};

    static addComponent(key, component){
        this.components[key] = component;
    }

    static deleteComponent(key){
        if (this.components[key]) {
            this.components[key].cleanUp();
            this.components[key] = null;
            delete this.components[key];
        } else {
            console.warn(`component ${key} not exist !`);
        }
    }

    static updateAll(deltatime){
        for (const key in this.components) {
            if (Object.prototype.hasOwnProperty.call(this.components, key)) {
                const element = this.components[key];
                if (element && typeof element.update === 'function') {
                    element.update(deltatime);
                }
            }
        }    
    }
}