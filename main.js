
import { ControlAndSystem } from "./modules/ControlAndSystem.js";
import { GraphicWorld } from "./modules/GraphicWorld.js";
import { Map } from './modules/Map.js';

import * as THREE from 'three';
import { Character } from "./player_controller/Character.js";
import { Monster } from "./monster_controller/monster.js";
import { AI_Entity } from "./modules/yuka_model_manager.js";
import PhysicWorld from "./modules/PhysicWorld.js";


const graphicWorld = new GraphicWorld();
const physicWorld = new PhysicWorld();

const map = new Map(graphicWorld);
const character = new Character(graphicWorld, 'woman_warior', physicWorld);
const monster = new Monster(graphicWorld, physicWorld);

// const stats = new Stats();

// stats.domElement.className = 'stats-panel'; // Thêm lớp CSS
// document.body.appendChild(stats.domElement)


ControlAndSystem.moveCameraAndLogInfo(graphicWorld.camera);

let clock = new THREE.Clock();


function refreshWorld() {
    const time = clock.getDelta();
    // stats.update();
    character.animate(time);
    monster.update(time);
    AI_Entity.updateByKey(time, 'monster');
    AI_Entity.updateByKey(time, 'woman_warior');
    physicWorld.update();
    graphicWorld.renderer.render( graphicWorld.scene, graphicWorld.camera );
}
graphicWorld.renderer.setAnimationLoop(refreshWorld);

