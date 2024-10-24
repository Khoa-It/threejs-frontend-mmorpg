import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import * as THREE from 'three';
import { GraphicModelManager } from "./three_model_manager.js";

export class ModelLoader {
    static gltfLoader = new GLTFLoader();
    static mtlLoader = new MTLLoader();
    static objLoader = new OBJLoader();
    static characterMixer = [];
    
    static loadObjFile(obj_url, mtl_url, scene, scale) {
        ModelLoader.mtlLoader.load(mtl_url, function (materials) {
            materials.preload();
            ModelLoader.objLoader.setMaterials(materials);
            ModelLoader.objLoader.load(obj_url, function (object) {
                object.scale.set(...scale)
                scene.add(object);
            });
        });
    }
    static async loadGtlfFile(gltf_url, scene, position, scale, init = null, key = null){
        await ModelLoader.gltfLoader.load(gltf_url, (gltf) => {
            const model = gltf.scene;
            model.position.set(...position);
            model.scale.set(...scale);
            scene.add(model);
            if (init) {
                init(model);
            }
            if (key) {
                GraphicModelManager.model[key] = model;
            }
        });
    }
    static loadGtlfFileAndAnimation(gltf_url, scene, position, scale){
        ModelLoader.gltfLoader.load(gltf_url, (gltf) => {
            const model = gltf.scene;
            model.position.set(...position);
            model.scale.set(...scale);
            const mixer = new THREE.AnimationMixer(model);
            const clips = gltf.animations;
            const clip = THREE.AnimationClip.findByName(clips, 'run');
            let action = mixer.clipAction(clip);
            console.log('action: ', clip);
            action.play();
            this.characterMixer.push(mixer);
            scene.add(model)
        });
    }

    static runAllAnimation(deltatime){
        if (this.characterMixer.length > 0) {
            for (const mixer of this.characterMixer) {
                // console.log('load animation');
                mixer.update(deltatime);
            }
        }
    }

}