import { MonsterFSM, MonsterProxy } from "./monster_fsm.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import * as THREE from 'three'
import { MODELS } from "../assets.js";
import { GraphicModelManager } from "../modules/three_model_manager.js";
import { AI_Entity } from "../modules/yuka_model_manager.js";
import PhysicWorld from "../modules/PhysicWorld.js";
import { BossHealthBar } from "../modules/HealthBar.js";
import { Physic_Manager } from "../modules/cannon_model_manager.js";
import { State_Manager } from "../modules/state_model_manager.js";
import { GraphicWorld } from "../modules/GraphicWorld.js";
import { LifecycleManager } from "../modules/LifecycleManager.js";
import { EquipmentManager } from "../manager_system/EquipmentManager.js";
export class Monster {
    constructor(enviroment = new GraphicWorld(), physicWorld = new PhysicWorld()) {
        this.healthbar = new BossHealthBar('monster');
        this.hp = 100;
        this.loader = new GLTFLoader();
        this.graphicWorld = enviroment;
        this.physicWorld = physicWorld;
        this.mixer = null;
        this.animations = {};
        this.fsm = new MonsterFSM(new MonsterProxy(this.animations), 'monster');
        this.isLoaded = false;
        this.name = 'monster';
        this.loadModel();
        this.isLive = true;
    }

    async loadModel() {
        const files = [
            MODELS['monster']['walking'],
            MODELS['monster']['normalskill'],
            MODELS['monster']['death'],
            MODELS['monster']['kick'],
            MODELS['monster']['idle'],
        ];


        const animNames = [
            'walking',
            'normalskill',
            'death',
            'kick',
            'idle',
        ];

        let countLoadTime = 0;

        const detailTask = async (glb, index) => {
            countLoadTime += 1;
            const anim_name = animNames[index];
            this.animations[anim_name] = this.mixer.clipAction(glb.animations[0]);
            if (countLoadTime == files.length) afterLoad();
        }

        const othersLoad = async (url, index) => {
            this.loader.load(url, async (glb) => await detailTask(glb, index));
        }

        let globalmodel;
        const startLoad = async (glb) => {
            const model = glb.scene;
            model.scale.set(...MODELS[this.name].scale);
            model.position.set(...MODELS[this.name].position);
            globalmodel = model;
            this.mixer = new THREE.AnimationMixer(model);
            this.graphicWorld.scene.add(model);
        }

        const afterLoad = async () => {
            GraphicModelManager.model[this.name] = globalmodel;
            AI_Entity.createAIController(this.name);
            State_Manager.addStateModel(this.name);
            this.physicWorld.createPhysicBoxBody(this.name, MODELS[this.name].physicSize);
            this.isLoaded = true;
            this.fsm.SetState('walking');
        }

        await new Promise((resolve) => {
            this.loader.load(MODELS['monster']['model'], async (glb) => {
                await startLoad(glb);
                resolve();
            })
        });

        await Promise.all(files.map((url, index) => {
            return new Promise(async (resolve) => {
                await othersLoad(url, index);
                resolve();
            });
        }));
    }

    calculatorDistanceWithPlayer() {
        const monster = GraphicModelManager.model[this.name];
        const player = GraphicModelManager.model['woman_warior'];
        const distanceWithPlayer = monster.position.distanceTo(player.position);
        return distanceWithPlayer;
    }

    lookAtPlayer() {
        if (this.hp == 0) return;

        setTimeout(() => {
            let target = new THREE.Vector3();
            target.copy(GraphicModelManager.model['woman_warior'].position);
            AI_Entity.info[this.fsm.name].graphicModel.lookAt(target);
        }, 2000)

    }

    updateHp() {
        if (State_Manager.model[this.name].isBeingAttacked) {
            this.hp -= State_Manager.model[this.name].damageReceived;
            if (this.hp < 0) this.hp = 0;
            this.healthbar.setHp(this.hp);
            State_Manager.model[this.name].damageReceived = 0;
            State_Manager.model[this.name].isBeingAttacked = false;
            this.lookAtPlayer();
        }
        if (this.hp == 0) {
            this.fsm.SetState('death');
            setTimeout(() => {
                LifecycleManager.deleteComponent(this.name);
            }, 2000);
        }
    }

    dispose3DObject(){
        if (this.model) {
            this.graphicWorld.scene.remove(this.model);
            if (this.model && this.model.traverse) {
                this.model.traverse((child) => {
                    if (child.isMesh) {
                        child.geometry.dispose();
                        child.material.dispose();
                    }
                });
            }
            this.model = null;
        }
    }
    disposeMixer(){
        if (this.mixer) {
            this.mixer.stopAllAction();
            this.mixer.uncacheRoot(this.mixer.getRoot());
            this.mixer = null;
        }
    }

    disposeOtherEntity(){
        this.physicWorld.removeBody(this.name);
        this.graphicWorld.removeModel(this.name);
        AI_Entity.removeAIController(this.name);
    }

    cleanUp() {
        const monsterModel = GraphicModelManager.model[this.name];
        if (monsterModel) {
            this.disposeOtherEntity();
            this.dispose3DObject();
            this.healthbar.remove();
            this.isLive = false;
            EquipmentManager.addEquipmentByMonster(this.name);
        }
    }

    update(time) {
        if (!this.isLive) return;
        if (!this.isLoaded) return;
        if (!this.fsm._currentState) return;
        if (!State_Manager.isPlayerLoaded()) return;
        this.mixer.update(time);
        this.fsm.Update(time, this.calculatorDistanceWithPlayer());
        AI_Entity.updateByKey(time, 'monster');
        Physic_Manager.updateByKey(this.name);
        this.updateHp();
    }
}