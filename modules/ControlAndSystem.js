import * as THREE from 'three';
import { Physic_Manager } from './cannon_model_manager.js';
export class ControlAndSystem {
    static moveObject() {

    }
    static logInfoByUserMouse(camera, scene) {
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();
        window.addEventListener('click', onClick, false);
        function onClick(event) {
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(scene.children, true);
            if (intersects.length > 0) {
                const intersectedPoint = intersects[0].point;
                console.log(`[${intersectedPoint.x}, ${intersectedPoint.y}, ${intersectedPoint.z}],`);
            }
        }
    }

    static moveCameraAndLogInfo(camera){
        document.addEventListener('keydown', (e)=> {
            const key = e.key;
            switch (key) {
                case 'ArrowUp':
                    camera.position.z += 1;
                    break;
                default:
                    break;
            }
        })
    }

    static logMessageSuccess(mes, data){
        console.log(`%c${mes}`, 'color: green; font-weight: bold;', data);
    }

}