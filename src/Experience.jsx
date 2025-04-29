/* eslint-disable no-case-declarations */
import { useRef } from 'react';
import LoadCameraControls from './LoadCameraControls/LoadCameraControls';
import LoadEnvironment from './LoadEnvironment/LoadEnvironment';
import LoadTinJar from './LoadTinJar/LoadTinJar';
import Manipulator from './Manipulator/Manipulator';
import * as THREE from 'three';
import { useEffect } from 'react';
import { useSnapshot } from 'valtio';
import globalStateData from './globalState/globalState';
import LoadBox from './LoadBox/LoadBox';
import { AxesHelper } from 'three';
import LoadCandle from './LoadCandle/LoadCandle';
import LoadSimpleBox from './LoadBox/LoadSimpleBox';
export default function Experience() {
    const dummyObject = new THREE.Object3D();
    const globalState = useSnapshot(globalStateData);
    let loadCameraControlsRef = useRef();
    const { mouseData, manipulatorData } = globalState;

    useEffect(() => {
        if (!mouseData?.isDown) {
            loadCameraControlsRef.current.enabled = true;
        }
    }, [mouseData]);

    const move = (e) => {
        e.stopPropagation();

        if (!mouseData?.isDown) return;

        const point = e.point;
        if (!point) return;

        loadCameraControlsRef.current.enabled = false;

        switch (mouseData.type) {
            case 'move':
                let angleDiff = globalStateData.manipulatorData.angleDiff;
                let normal = e.face.normal;
                const n = normal.clone();

                let angleToRotate = angleDiff;
                if (Math.abs(normal.clone().y) > 0.9) {
                    n.z = Math.abs(n.z);
                }
                n.multiplyScalar(10);
                n.add(e.point);
                dummyObject.position.copy(e.point);
                dummyObject.lookAt(n);
                angleToRotate ? dummyObject.rotateZ(angleToRotate) : null;
                const normalRotation = dummyObject.rotation;

                const blendedRotation = [
                    normalRotation.x,
                    normalRotation.y,
                    normalRotation.z,
                ];

                globalStateData.manipulatorData = {
                    ...manipulatorData,
                    position: [
                        dummyObject.position.x,
                        dummyObject.position.y,
                        dummyObject.position.z + 0.002,
                    ],
                    rotation: blendedRotation,
                    manipulatorNormal: normal.clone(),
                };
                break;
            default:
                break;
        }
    };

    return (
        <>
            <LoadCameraControls ref={loadCameraControlsRef} />
            <LoadEnvironment />
            {/* <LoadTinJar cameraControls={loadCameraControlsRef} move={move} /> */}
            {/* <LoadCandle cameraControls={loadCameraControlsRef} move={move} /> */}
            {/* <LoadBox cameraControls={loadCameraControlsRef} move={move} /> */}
            <LoadSimpleBox cameraControls={loadCameraControlsRef} move={move} />
            <axesHelper />
            <Manipulator />
        </>
    );
}
