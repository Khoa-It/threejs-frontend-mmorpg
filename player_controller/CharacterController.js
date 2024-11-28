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
import { State_Manager } from '../modules/state_model_manager.js';
import { GraphicWorld } from '../modules/GraphicWorld.js';
import { StatManager } from '../manager_system/StatManager.js';


export class CharacterController {
    constructor(
        environment = new GraphicWorld(),
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

        this.isLoaded = false;
        this.isBeingKnockedBack = false; // Cờ đánh dấu việc bị đánh bật
        this.knockbackForce = new THREE.Vector3(0, 0, 0); // Lực đánh bật

        this.rotationConfiguration();
        
    }

    rotationConfiguration(){
        this.isRotating = false;
        this.targetRotation = 0;
        this.rotationSpeed = 55;
    }

    async loadModelFile(charName) {

        const files = [
            MODELS[charName]['run'],
            MODELS[charName]['normalskill'],
            MODELS[charName]['death'],
            MODELS[charName]['walkback'],
            MODELS[charName]['sweepfall'],
        ];

        const ani_name = ['run', 'normalskill', 'death', 'walkback', 'sweepfall'];

        const onLoadStandModel = (glb) => {
            const model = glb.scene;
            model.scale.set(...MODELS[charName]['scale']);
            model.position.set(...MODELS[charName]['position']);
            this.environment.scene.add(model);
            this._model = model;
            this._mixer = new THREE.AnimationMixer(this._model);
            this._animations['idle'] = this._mixer.clipAction(glb.animations[0]);
        }

        let countLoad = 0
        const detailTask = (glb, index) => {
            countLoad += 1;
            const name = ani_name[index];
            this._animations[name] = this._mixer.clipAction(glb.animations[0]);
            if (countLoad == files.length) afterLoad();
        }

        const onLoadOtherModel = (url, index) => {
            this.loader.load(url, (glb) => detailTask(glb, index));
        }

        const afterLoad = () => {
            GraphicModelManager.model[charName] = this._model;
            AI_Entity.createAIController(charName, true);
            State_Manager.addStateModel(charName);
            State_Manager.model[charName].isPlayer = true;
            this.physicWorld.createPhysicBoxBody(charName, MODELS[charName].physicSize);
            this.isLoaded = true;
        }

        await new Promise((resolve) => {
            this.loader.load(MODELS[charName]['idle'], (glb) => {
                onLoadStandModel(glb);
                resolve();
            })
        });

        await Promise.all(files.map((url, index) => {
            return new Promise((resolve) => {
                onLoadOtherModel(url, index);
                resolve();
            });
        }));
    }

    updateHp(timeInSeconds) {
        if (State_Manager.model[this.charName].isBeingAttacked) {
            this._stateMachine.SetState('sweepfall');
            // this.hp -= State_Manager.model[this.charName].damageReceived;
            const damaged = State_Manager.model[this.charName].damageReceived;
            this.hp = StatManager.decreaseHp(damaged,this.hp);
            this.healthbar.setHp(this.hp);
            // Thêm logic đánh bật
            this.isBeingKnockedBack = true; // Bắt đầu đánh bật
            this.knockbackForce.set(0, 0, 5); // Đặt lực đánh bật về phía sau (hoặc tùy chỉnh theo hướng đánh)

            State_Manager.model[this.charName].damageReceived = 0;
            State_Manager.model[this.charName].isBeingAttacked = false;
        }

        this.knockBack(timeInSeconds)

        if (this.hp <= 0) {
            this._stateMachine.SetState('death');
        }


    }

    knockBack(timeInSeconds) {
        if (this.isBeingKnockedBack) {
            // Giảm vị trí về phía sau
            const controlObject = this._model;
            const forward = new THREE.Vector3(0, 0, 1);
            forward.applyQuaternion(controlObject.quaternion);
            forward.normalize();

            // Di chuyển về phía sau theo lực đánh bật
            const knockbackDirection = forward.clone().negate(); // Hướng ngược lại
            const knockbackVelocity = knockbackDirection.multiplyScalar(this.knockbackForce.z * timeInSeconds);

            controlObject.position.add(knockbackVelocity);
            // Giảm dần lực đánh bật
            this.knockbackForce.z -= 0.1; // Giảm tốc dần, tùy chỉnh giá trị để phù hợp
            // Ngừng đánh bật khi lực nhỏ hơn một ngưỡng nhất định
            if (this.knockbackForce.z < 0) {
                this.isBeingKnockedBack = false;
                this.knockbackForce.set(0, 0, 0); // Reset lực
            }
        }
    }

    afterDash(condition = true){
        if (condition) {
            this.isRotating = true;
            this.targetRotation = this._model.rotation.y + Math.PI;           
        }
    }

    updateRotation(deltaTime){
        if (this.isRotating) {
            const currentRotation = this._model.rotation.y;
            this._model.rotation.y = THREE.MathUtils.lerp(currentRotation, this.targetRotation, this.rotationSpeed * deltaTime);
            if (Math.abs(this._model.rotation.y - this.targetRotation) < 0.5) {
                this.isRotating = false;
            }
        }else{
            this.targetRotation = 0;
            return;
        }
    }

    performDash(deltaTime) {
        if (this._input._keys.dash) {
            State_Manager.model[this.charName].isDashing = true;
            State_Manager.model[this.charName].dashTime = 0;
        }else{
            this.afterDash(State_Manager.model[this.charName].isDashing);
            State_Manager.model[this.charName].isDashing = false;
        }

        const direction = new THREE.Vector3();
        this._model.getWorldDirection(direction);
        if (State_Manager.model[this.charName].isDashing) {
            State_Manager.model[this.charName].dashTime += deltaTime;
            if (State_Manager.model[this.charName].dashTime < State_Manager.model[this.charName].dashDuration) {
                const dashDistance = State_Manager.model[this.charName].dashSpeed * deltaTime ;
                this._model.position.add(direction.multiplyScalar(dashDistance));
            } else {
                State_Manager.model[this.charName].isDashing = false;
                
            }
        }  
    }


    updatePos(timeInSeconds) {        
        if (Physic_Manager.model[this.charName].body.isCollision) {
            this._input._keys.forward = false;
        }

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


    }

    Update(timeInSeconds) {
        if (!this.isLoaded) return;

        if (!this._stateMachine._currentState) {
            return;
        }
        
        this._stateMachine.Update(timeInSeconds, this._input);
        this.performDash(timeInSeconds);
        this.updateRotation(timeInSeconds);
        this.updatePos(timeInSeconds);
        this.updateHp(timeInSeconds);
        Physic_Manager.updateByKey(this.charName);
        AI_Entity.updateByKey(timeInSeconds, 'woman_warior');
    }
};