import { MODELS } from "../assets.js";
import { DistanceManager } from "../manager_system/DistanceManager.js";
import { Notification } from "../manager_system/NotificationManager.js";
import { UserManager } from "../manager_system/UserManager.js";
import { Monster } from "../monster_controller/monster.js";
import { GraphicWorld } from "./GraphicWorld.js";
import { LifecycleManager } from "./LifecycleManager.js";
import { ModelLoader } from "./ModelLoader.js";
import PhysicWorld from "./PhysicWorld.js";
import { GraphicModelManager } from "./three_model_manager.js";

export class Arena {
    constructor(graphicWorld = new GraphicWorld(), physicWorld = new PhysicWorld()) {
        this.graphicWorld = graphicWorld;
        this.physicWorld = physicWorld;
        this.key = 'arena';
        this.monsterKey = 'monster';
        this.notification = new Notification('Khiêu chiến', 0, 1, this.key);
        this.loadModel(this.key);
        this.setEvent();
    }

    setEvent(){
        document.addEventListener('keydown', (e) => {
            if(e.key.toLocaleLowerCase()=='f' && this.notification.status){
                this.notification.hide();
                if (GraphicModelManager.checkKeyExisted(this.monsterKey)) return;
                LifecycleManager.addComponent(this.monsterKey, new Monster(this.graphicWorld, this.physicWorld));
            }
        })
    }

    loadModel(key){
        ModelLoader.loadGtlfFile(
            MODELS[key].url,
            this.graphicWorld.scene,
            MODELS[key].position,
            MODELS[key].scale,
            null,
            key,
        )
    }

    isAllConditionTrue(){
        const keys = [this.key, UserManager.getCurrentCharId()];
        let result = GraphicModelManager.isAllKeyExisted(keys);
        return result;
    }

    update(deltaTime){
        if (!this.isAllConditionTrue()) return;
        const distance = DistanceManager.calculateDistance(this.key, UserManager.getCurrentCharId());
        this.notification.update(distance);
    }
}