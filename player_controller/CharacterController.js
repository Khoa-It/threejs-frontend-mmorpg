import * as THREE from 'three';
import { BasicCharacterControllerProxy, CharacterFSM } from './character_fsm.js';
import { CharacterControllerInput } from './CharacterControllerInput.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MODELS } from '../assets.js';
import { GraphicModelManager } from '../modules/three_model_manager.js';
import { AI_Entity } from '../modules/yuka_model_manager.js';
import PhysicWorld from '../modules/PhysicWorld.js';
import { Physic_Manager } from '../modules/cannon_model_manager.js';
import { CharacterHealthbar } from '../modules/HealthBar.js';


export class CharacterController {
    constructor(
        environment = { scene: new THREE.Scene(), camera: new THREE.PerspectiveCamera() },
        charName = 'haha',
        physicWorld = new PhysicWorld()
    ) {
        this.environment = environment;
        this.charName = charName;
        this.physicWorld = physicWorld;
        this._Init();
    }

    async _Init() {
        this.healthbar = new CharacterHealthbar(this.charName);
        this.hp = 100;
        this._mixer = null;
        this._model = null;
        this._decceleration = new THREE.Vector3(-0.0005, -0.0001, -5.0);
        this._acceleration = new THREE.Vector3(1, 0.125, 50.0);
        this._velocity = new THREE.Vector3(0, 0, 0);
        this._position = new THREE.Vector3();
        this._animations = {};
       
        this.loader = new GLTFLoader();
        await this.loadModelFile(this.charName);

        this._stateMachine = new CharacterFSM(
            new BasicCharacterControllerProxy(this._animations), this._mixer, this.charName);
        this._input = new CharacterControllerInput();
        this._stateMachine.SetState('idle');
    }

    async loadModelFile(charName) {

        const files = [
            MODELS[charName]['run'],
            MODELS[charName]['punch'],
            MODELS[charName]['death'],
            MODELS[charName]['walkback'],
        ];

        const ani_name = ['run', 'punch', 'death', 'walkback'];

        const onLoadStandModel = (glb) => {
            const model = glb.scene;
            GraphicModelManager.model[charName] = model;
            AI_Entity.createAIController(charName, true);
            this._model = model;
            model.scale.set(...MODELS[charName]['scale']);
            model.position.set(...MODELS[charName]['position']);
            this.physicWorld.createPhysicBoxBody(charName, MODELS['woman_warior'].physicSize);
            this.environment.scene.add(model);
            this._mixer = new THREE.AnimationMixer(this._model);
            this._animations['idle'] = this._mixer.clipAction(glb.animations[0]);
        }

        const onLoadOtherModel = (glb, index) => {
            const name = ani_name[index];
            this._animations[name] = this._mixer.clipAction(glb.animations[0]);
        }

        const loadOtherFile = (url, index) => {
            this.loader.load(url, (glb)=> onLoadOtherModel(glb, index));
        }

        await new Promise((resolve) => {
            this.loader.load(MODELS[charName]['idle'], (glb) => {
                onLoadStandModel(glb);
                resolve();
            })
        });

        await Promise.all(files.map((url, index) => {
            return new Promise((resolve) => {
                loadOtherFile(url, index);
                resolve();
            });
        }));
    }

    Update(timeInSeconds) {
        
        if (!this._stateMachine._currentState) {
            return;
        }   

        if (Physic_Manager.model[this.charName].isCollision) {
            this._input._keys.forward = false;
        }

        if (Physic_Manager.model[this.charName].isBeingAttacked) {
            this.hp -= Physic_Manager.model[this.charName].decreaseHp;
            this.healthbar.setHp(this.hp);
            Physic_Manager.model[this.charName].decreaseHp = 0;
            Physic_Manager.model[this.charName].isBeingAttacked = false;
        }

        if (this.hp == 0) {
            this._stateMachine.SetState('death');
        }

        this._stateMachine.Update(timeInSeconds, this._input);

        const currentState = this._stateMachine._currentState;
        if (currentState.Name != 'punch' &&
            currentState.Name != 'run' &&
            currentState.Name != 'idle' &&
            currentState.Name != 'walkback'
        ) {
            return;
        }
        

        const velocity = this._velocity;
        const frameDecceleration = new THREE.Vector3(
            velocity.x * this._decceleration.x,
            velocity.y * this._decceleration.y,
            velocity.z * this._decceleration.z
        );
        frameDecceleration.multiplyScalar(timeInSeconds);
        frameDecceleration.z = Math.sign(frameDecceleration.z) * Math.min(
            Math.abs(frameDecceleration.z), Math.abs(velocity.z));
        velocity.add(frameDecceleration);

        const controlObject = this._model;
        const _Q = new THREE.Quaternion();
        const _A = new THREE.Vector3();
        const _R = controlObject.quaternion.clone();
        
        const acc = this._acceleration.clone();
        if (this._input._keys.shift) {
            acc.multiplyScalar(2.0);
        }

        if (this._input._keys.forward) {
            velocity.z += acc.z * timeInSeconds;
        }
        if (this._input._keys.backward) {
            velocity.z -= acc.z * timeInSeconds;
        }
        if (this._input._keys.left) {
            _A.set(0, 1, 0);
            _Q.setFromAxisAngle(_A, 4.0 * Math.PI * timeInSeconds * this._acceleration.y);
            _R.multiply(_Q);
        }
        if (this._input._keys.right) {
            _A.set(0, 1, 0);
            _Q.setFromAxisAngle(_A, 4.0 * -Math.PI * timeInSeconds * this._acceleration.y);
            _R.multiply(_Q);
        }

        controlObject.quaternion.copy(_R);

        const oldPosition = new THREE.Vector3();
        oldPosition.copy(controlObject.position);

        const forward = new THREE.Vector3(0, 0, 1);
        forward.applyQuaternion(controlObject.quaternion);
        forward.normalize();

        const sideways = new THREE.Vector3(1, 0, 0);
        sideways.applyQuaternion(controlObject.quaternion);
        sideways.normalize();

        const speed = 0.08;
        sideways.multiplyScalar(velocity.x * timeInSeconds * speed);
        forward.multiplyScalar(velocity.z * timeInSeconds * speed);

        const pos = controlObject.position.clone();
        pos.add(forward);
        pos.add(sideways);

        controlObject.position.copy(pos);

        this.physicWorld.updateByKey(this.charName);
    }
};