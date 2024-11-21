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
        ModelLoader.gltfLoader.load(MODELS['tree'].model, (glb) => {
            let mesh;

            // Tìm đối tượng Mesh đầu tiên
            glb.scene.traverse((child) => {
                if (child.isMesh) {
                    mesh = child;
                }
            });

            if (!mesh) {
                console.error('No Mesh found in the GLTF file');
                return;
            }

            console.log('Mesh found:', mesh);

            const geometry = mesh.geometry;
            const material = mesh.material;

            console.log('Geometry:', geometry);
            console.log('Material:', material);

            // Tạo InstancedMesh
            const instanceMesh = new THREE.InstancedMesh(geometry, material, TREE_POSITION.length);
            instanceMesh.castShadow = true;
            instanceMesh.receiveShadow = true;
            let i = 0;
            for (const pos of TREE_POSITION) {
                const matrix = new THREE.Matrix4();
                const scale = Math.ceil(1 + Math.random() * (4 - 1));

                // Thiết lập vị trí
                matrix.setPosition(pos[0], pos[1], pos[2]);

                // Áp dụng scale
                const scaleMatrix = new THREE.Matrix4().makeScale(scale, scale, scale);
                matrix.multiply(scaleMatrix);

                // Gán ma trận vào InstancedMesh
                instanceMesh.setMatrixAt(i++, matrix);

                console.log(`Instance ${i} Position:`, pos, 'Scale:', scale);
            }

            scene.add(instanceMesh);
            console.log('InstancedMesh added to scene:', instanceMesh);
            console.log(scene);

        })
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