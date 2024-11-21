import * as THREE from 'three'
import { MODELS, sc_arr } from '../assets.js';
import { ModelLoader } from './ModelLoader.js';
import { TREE_POSITION } from '../object_data/treedata.js';
import { ROCK_POSITION } from '../object_data/rockdata.js';
import { GRASS_POSITION } from '../object_data/grassdata.js';
import { AI_Entity } from './yuka_model_manager.js';

export class Map {
    constructor(environment = { scene, camera }) {
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
        for (const pos of TREE_POSITION) {
            const scale = sc_arr(Math.floor(1 + Math.random()*3));
            ModelLoader.loadGtlfFile(
                MODELS['tree'].model,
                scene,
                pos,
                scale,
                null,
                null,
            )
        }
    }

    createGrass(scene) {
        for (const pos of GRASS_POSITION) {
            ModelLoader.loadGtlfFile(MODELS['grass'].model, scene, pos, MODELS['grass'].scale);
        }
    }

    createCreativeCube(scene) {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const materials = new THREE.MeshBasicMaterial({ color: 'red' });
        const mesh = new THREE.Mesh(geometry, materials);
        mesh.position.set(2, 0, -2)
        scene.add(mesh);
        // AI_Entity.createAIController('cube');
    }

    createRock(scene) {
        for (const pos of ROCK_POSITION) {
            ModelLoader.loadGtlfFile(MODELS['rock'].model, scene, pos, MODELS['rock'].scale);
        }
    }

    createStartHouse(scene) {
        ModelLoader.loadGtlfFile(MODELS['start_house'].model, scene, MODELS['start_house'].position, MODELS['start_house'].scale);
    }
}