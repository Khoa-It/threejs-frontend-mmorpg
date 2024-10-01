import { ControlAndSystem } from "./modules/ControlAndSystem.js";
import { GraphicWorld } from "./modules/GraphicWorld.js";
import { Map } from './modules/Map.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import * as THREE from 'three';
import { Monster } from "./monster_controller/monster.js";
import { AI_Entity } from "./modules/yuka_model_manager.js";

const graphicWorld = new GraphicWorld();
const map = new Map(graphicWorld);
const orbitcontrols = new OrbitControls(graphicWorld.camera, graphicWorld.renderer.domElement);

const stats = new Stats();

stats.domElement.className = 'stats-panel'; // Thêm lớp CSS
document.body.appendChild(stats.domElement)


// ControlAndSystem.moveCameraAndLogInfo(graphicWorld.camera);
// ControlAndSystem.logInfoByUserMouse(graphicWorld.camera, graphicWorld.scene);

const monster = new Monster(graphicWorld);

let clock = new THREE.Clock();


function refreshWorld() {
    requestAnimationFrame(refreshWorld);
    orbitcontrols.update();
    stats.update();
    monster.update(clock.getDelta());
    AI_Entity.updateByKey(clock.getDelta(), 'monster');
    graphicWorld.renderer.render(graphicWorld.scene, graphicWorld.camera);
}
refreshWorld();

