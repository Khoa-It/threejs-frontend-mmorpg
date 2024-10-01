import * as THREE from 'three';
export class ThirdPersonCamera {
    static currentPosition = new THREE.Vector3();
    static currentLookat = new THREE.Vector3();

    static caculatorIdealOffset(model = new THREE.Mesh()) {
        let idealOffset = new THREE.Vector3(0, 0.5, -0.5);
        const quaternion = new THREE.Quaternion().copy(model.quaternion);
        idealOffset.applyQuaternion(quaternion);
        idealOffset.add(model.position);
        return idealOffset;
    }

    static caculatorIdealLookat(model = new THREE.Mesh()){
        let lookAt = new THREE.Vector3(0, 0.5, 1);
        const quaternion = new THREE.Quaternion().copy(model.quaternion);
        lookAt.applyQuaternion(quaternion);
        lookAt.add(model.position);
        return lookAt;
    }

    static update(camera = new THREE.PerspectiveCamera(), model) {
        const idealOffset = ThirdPersonCamera.caculatorIdealOffset(model);
        const idealLookat = ThirdPersonCamera.caculatorIdealLookat(model);
        const lerpAlpha = 0.1;
        ThirdPersonCamera.currentPosition.lerp(idealOffset, lerpAlpha);
        ThirdPersonCamera.currentLookat.lerp(idealLookat, lerpAlpha);
        camera.position.copy(ThirdPersonCamera.currentPosition);
        camera.lookAt(ThirdPersonCamera.currentLookat);
        
        
    }

}
