import { Physic_Manager } from "./cannon_model_manager.js";
import { GraphicModelManager } from "./three_model_manager.js";
import * as CANNON from 'https://cdn.jsdelivr.net/npm/cannon-es@0.18.0/dist/cannon-es.js';
import * as THREE from 'three';
export default class PhysicWorld {
    constructor() {
        this.world = new CANNON.World();
        this.world.gravity.set(0, -9.82, 0);

        this.world.addEventListener('beginContact', (event) => {
            console.log('Begin Contact:', event);
            // Xử lý va chạm ở đây
            const { bodyA, bodyB } = event;
            console.log('có va chạm diễn ra ..............');
            bodyA.isCollision = true;
            bodyB.isCollision = true;
            console.log(bodyA, bodyB);

        });

        this.world.addEventListener('endContact', (event) => {
            console.log('End Contact:', event);
            const { bodyA, bodyB } = event; // Lấy bodyA và bodyB từ event
            bodyA.isCollision = false;
            bodyB.isCollision = false;

        });
    }

    createPhysicBoxBody(key, bodySize = [1, 1, 1]) {
        const body = new CANNON.Body({
            mass: 1,
            shape: new CANNON.Box(new CANNON.Vec3(...bodySize))
        });
        this.world.addBody(body);
        Physic_Manager.model[key] = body;
        Physic_Manager.model[key].isCollision = false;
        Physic_Manager.model[key].isAttacking = false;
        Physic_Manager.model[key].isBeingAttacked = false;
        Physic_Manager.model[key].decreaseHp = 0;
        Physic_Manager.model[key].name = key;
        Physic_Manager.model[key].position.copy(GraphicModelManager.model[key].position);
        return body;
    }

    update() {
        this.world.step(1 / 60);
    }

    updateByKey(key) {
        Physic_Manager.model[key].position.copy(GraphicModelManager.model[key].position);
    }
}