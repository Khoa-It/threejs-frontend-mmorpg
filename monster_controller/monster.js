import { MonsterFSM, MonsterProxy } from "./monster_fsm.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import * as THREE from 'three'
import { MODELS } from "../assets.js";
import { ControlAndSystem } from "../modules/ControlAndSystem.js";
import { GraphicModelManager } from "../modules/three_model_manager.js";
import { AI_Entity } from "../modules/yuka_model_manager.js";
import { FSM_NPC } from "./fsm_manager.js";
import PhysicWorld from "../modules/PhysicWorld.js";
import { BossHealthBar } from "../modules/HealthBar.js";
import { Physic_Manager } from "../modules/cannon_model_manager.js";
export class Monster {
    constructor(enviroment = { scene: new THREE.Scene() }, physicWorld = new PhysicWorld()) {
        this.healthbar = new BossHealthBar('monster');
        this.hp = 100;
        this.loader = new GLTFLoader();
        this.enviroment = enviroment;
        this.mixer = null;
        this.animations = {};
        this.fsm = new MonsterFSM(new MonsterProxy(this.animations), 'monster');
        this.isLoaded = false;
        this.name = 'monster';
        this.aiEntity = null;
        this.physicWorld = physicWorld;
        this.canAttack = true;
        this.loadModel();
    }

    async loadModel() {
        const files = [
            MODELS['monster']['walking'],
            MODELS['monster']['punch'],
            MODELS['monster']['death'],
            MODELS['monster']['kick'],
            MODELS['monster']['idle'],
        ];


        const animNames = [
            'walking',
            'punch',
            'death',
            'kick',
            'idle',
        ];

        let countLoadTime = 0;

        const detailTask = async (glb, index) => {
            countLoadTime += 1;
            console.log('detailTask', index, countLoadTime);        
            const anim_name = animNames[index];
            this.animations[anim_name] = this.mixer.clipAction(glb.animations[0]);
            if(countLoadTime == files.length) {
                this.aiEntity = AI_Entity.createAIController('monster');
                this.isLoaded = true;
                this.fsm.SetState('walking');
            }
        }

        const othersLoad = async (url, index) => {
            this.loader.load(url, async (glb) => await detailTask(glb, index));
        }

        const startLoad = async (glb) => {
            const model = glb.scene;
            GraphicModelManager.model['monster'] = model;
            model.scale.set(...MODELS['monster'].scale);
            model.position.set(...MODELS['monster'].position);
            this.physicWorld.createPhysicBoxBody('monster', MODELS['monster'].physicSize);
            this.mixer = new THREE.AnimationMixer(model);
            this.enviroment.scene.add(model);
            console.log('start load');
        }

        await new Promise((resolve) => {
            this.loader.load(MODELS['monster']['model'], async (glb) => {
                await startLoad(glb);
                resolve();
            })
        });

        await Promise.all(files.map((url, index) => {
            return new Promise( async (resolve) => {
                await othersLoad(url, index);
                resolve();
            });
        }));
    }

    update(time){
        if(!this.isLoaded) return;
        if(!this.fsm._currentState) return;
        this.mixer.update(time);
        const monster = GraphicModelManager.model[this.name];
        const player = GraphicModelManager.model['woman_warior'];
        const distanceWithPlayer = monster.position.distanceTo(player.position);
        this.fsm.Update(time, this.name, distanceWithPlayer, this.canAttack);
        this.physicWorld.updateByKey('monster');
        if (Physic_Manager.model[this.name].isBeingAttacked) {
            this.hp -= Physic_Manager.model[this.name].decreaseHp;
            this.healthbar.setHp(this.hp);
            Physic_Manager.model[this.name].decreaseHp = 0;
            Physic_Manager.model[this.name].isBeingAttacked = false;
        }
        if (this.hp == 0) {
            this.fsm.SetState('death');
        }
    }
}