
import { ControlAndSystem } from "./modules/ControlAndSystem.js";
import { GraphicWorld } from "./modules/GraphicWorld.js";
import { Map } from './modules/Map.js';

import * as THREE from 'three';

import { Monster } from "./monster_controller/monster.js";
import { AI_Entity } from "./modules/yuka_model_manager.js";
import PhysicWorld from "./modules/PhysicWorld.js";
import { FireBall } from "./effect/fire.js";
import { Character } from "./player_controller/character.js";
import { BrowserInfo } from "./event/info.js";
import { GraphicModelManager } from "./modules/three_model_manager.js";
// import { fireBall } from "./effect/fire.js";


// if (BrowserInfo.IS_LOGIN==false) {
//     window.location.href = 'login.html';
// }

const graphicWorld = new GraphicWorld();
const physicWorld = new PhysicWorld();

// const fireBall = new FireBall({graphicWorld});
const map = new Map(graphicWorld);
const character = new Character(graphicWorld, 'woman_warior', physicWorld);
let monster = new Monster(graphicWorld, physicWorld);

// const stats = new Stats();
// stats.domElement.className = 'stats-panel'; // Thêm lớp CSS
// document.body.appendChild(stats.domElement)



ControlAndSystem.moveCameraAndLogInfo(graphicWorld.camera);

let clock = new THREE.Clock();


function refreshWorld() {
    const time = clock.getDelta();
    // stats.update();
    // fireBall.update();
    character.animate(time);
    physicWorld.update();
    monster.update(time);
    graphicWorld.renderer.render( graphicWorld.scene, graphicWorld.camera );
}
graphicWorld.renderer.setAnimationLoop(refreshWorld);

