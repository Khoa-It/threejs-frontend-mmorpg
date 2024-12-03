import * as THREE from 'three'
import { MODELS, sc_arr } from '../assets.js';
import { ModelLoader } from './ModelLoader.js';
import { TREE_POSITION } from '../object_data/treedata.js';
import { ROCK_POSITION } from '../object_data/rockdata.js';
import { GRASS_POSITION } from '../object_data/grassdata.js';
import { AI_Entity } from './yuka_model_manager.js';
// import { SkeletonUtils } from 'https://cdn.jsdelivr.net/npm/three@0.158.0/examples/jsm/utils/SkeletonUtils.js';
import * as SkeletonUtils from 'three/addons/utils/SkeletonUtils.js';
import { GraphicWorld } from './GraphicWorld.js';

export class Map {
    constructor(environment = new GraphicWorld()) {
        this.environment = environment;
        this.textureLoader = new THREE.TextureLoader();
        this.createGround(environment.scene);
        this.createSky(environment.scene);
        this.createStree(environment.scene);
        this.createRock(environment.scene);
        this.createGrass(environment.scene);
        this.createTrail(environment.scene);
        this.createStartHouse(environment.scene);
    }
    createGround(scene) {
        const texture = this.textureLoader.load(MODELS['bg-ground'].img)
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        const repeatNum = 10;
        texture.repeat.set(repeatNum, repeatNum);
        const geometry = new THREE.PlaneGeometry(25, 25);
        const materials = new THREE.MeshStandardMaterial({ side: 2, map: texture });
        const mesh = new THREE.Mesh(geometry, materials);
        mesh.rotation.x = - Math.PI / 2;
        scene.add(mesh);
    }
    createSky(scene) {
        const loader = new THREE.CubeTextureLoader();
        const texture = loader.load([
            MODELS['bluesky'].url,  // Mặt phải
            MODELS['bluesky'].url,  // Mặt trái
            MODELS['bluesky'].url,  // Mặt trên
            MODELS['bluesky'].url,  // Mặt dưới
            MODELS['bluesky'].url,  // Mặt trước
            MODELS['bluesky'].url   // Mặt sau
        ]);
        scene.background = texture;
    }

    createTrail(scene) {
        const texture = this.textureLoader.load(MODELS['trail'].url)
        const geometry = new THREE.PlaneGeometry(2, 3);
        const materials = new THREE.MeshStandardMaterial({ side: 2, map: texture });
        const mesh = new THREE.Mesh(geometry, materials);
        const pos = [0.44353816160287474, 0.001, -0.33126998983409306];
        mesh.position.set(...pos);
        mesh.rotation.x = - Math.PI / 2;
        scene.add(mesh);
    }

    

    createStree(scene) {
        const cloneToManyTrees = (model) => {
            for (const pos of TREE_POSITION) {
                const scale = sc_arr(Math.floor(1 + Math.random()*3));
                const treeClone = SkeletonUtils.clone(model);
                treeClone.position.set(...pos);
                treeClone.scale.set(...scale);
                scene.add(treeClone);
            }
        }
        ModelLoader.gltfLoader.load(MODELS['tree'].model, (glb) => {
            const model = glb.scene;
            cloneToManyTrees(model);
        })
    }

    createGrass(scene) {
        const cloneToManyGrass = (model) => {
            for (const pos of GRASS_POSITION) {
                const grassClone = SkeletonUtils.clone(model);
                const scale = MODELS['grass'].scale;
                grassClone.position.set(...pos);
                grassClone.scale.set(...scale);
                scene.add(grassClone);
            }
        }
        ModelLoader.gltfLoader.load(MODELS['grass'].model, (glb) => {
            const model = glb.scene;
            cloneToManyGrass(model);
        })
    }

    createCreativeCube(scene) {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const materials = new THREE.MeshBasicMaterial({ color: 'red' });
        const mesh = new THREE.Mesh(geometry, materials);
        mesh.position.set(2, 0, -2)
        scene.add(mesh);
    }

    createRock(scene) {
        const cloneToManyRock = (model) => {
            for (const pos of ROCK_POSITION) {
                const rockClone = SkeletonUtils.clone(model);
                const scale = MODELS['rock'].scale;
                rockClone.position.set(...pos);
                rockClone.scale.set(...scale);
                scene.add(rockClone);
            }
        }
        ModelLoader.gltfLoader.load(MODELS['rock'].model, (glb) => {
            const model = glb.scene;
            cloneToManyRock(model);
        })
    }

    createStartHouse(scene) {
        ModelLoader.loadGtlfFile(MODELS['start_house'].model, scene, MODELS['start_house'].position, MODELS['start_house'].scale);
    }
}