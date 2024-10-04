import { Physic_Manager } from "./cannon_model_manager.js";
import { GraphicModelManager } from "./three_model_manager.js";
import * as CANNON from 'https://cdn.jsdelivr.net/npm/cannon-es@0.18.0/dist/cannon-es.js';
import * as THREE from 'three';

export default class PhysicWorld {
    constructor() {
        this.world = new CANNON.World();
        this.world.gravity.set(0, -9.82, 0);

        this.world.addEventListener('beginContact', (event) => {
            const { bodyA, bodyB } = event;
            bodyA.isCollision = true;
            bodyB.isCollision = true;
            
        });

        this.world.addEventListener('endContact', (event) => {
            const { bodyA, bodyB } = event; 
            bodyA.isCollision = false;
            bodyB.isCollision = false;

        });
    }

    createPhysicBoxBody(key, bodySize = [1, 1, 1]) {
        const body = Physic_Manager.addPhysicModel(key, bodySize);
        this.world.addBody(body);
        return body;
    }

    update() {
        this.world.step(1 / 60);
    }
}