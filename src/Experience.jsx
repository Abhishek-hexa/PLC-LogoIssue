/* eslint-disable no-case-declarations */
import { useRef } from 'react';
import LoadCameraControls from './LoadCameraControls/LoadCameraControls';
import LoadEnvironment from './LoadEnvironment/LoadEnvironment';
import LoadTinJar from './LoadTinJar/LoadTinJar';
import Manipulator from './Manipulator/Manipulator';
import * as THREE from 'three';
import { useState } from 'react';
import { useEffect } from 'react';
import { useSnapshot } from 'valtio';
import globalStateData from './globalState/globalState';

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
                const angleDiff = globalStateData.manipulatorData.angleDiff;
                let normal = e.normal;
                const n = normal.clone();
                n.multiplyScalar(10);
                n.add(e.point);

                dummyObject.position.copy(e.point);
                dummyObject.lookAt(n);
                angleDiff ? dummyObject.rotateZ(angleDiff) : null;
                const normalRotation = dummyObject.rotation;

                const blendedRotation = [
                    normalRotation.x,
                    normalRotation.y,
                    normalRotation.z,
                ];

                globalStateData.manipulatorData = {
                    ...manipulatorData,
                    position: [point.x, point.y, point.z + 0.002],
                    rotation: blendedRotation,
                };
                break;
            default:
                break;
        }
    };
    // const move = (e) => {
    //     e.stopPropagation();

    //     if (!mouseData?.isDown) return;

    //     const point = e.point;
    //     if (!point) return;

    //     loadCameraControlsRef.current.enabled = false;

    //     switch (mouseData.type) {
    //         case 'move': {
    //             // Get current manipulator data
    //             const currentRotation = [...manipulatorData.rotation];
    //             const fixedDirection = e.normal;
    //             const currentZ = fixedDirection.z;

    //             // Check if the normal's Z direction has flipped
    //             const previousZ = manipulatorData.previousNormalZ;
    //             if (
    //                 previousZ !== undefined &&
    //                 Math.sign(currentZ) !== Math.sign(previousZ)
    //             ) {
    //                 // Adjust Z rotation by 180 degrees (π radians) to compensate
    //                 currentRotation[2] += Math.PI;
    //                 // Normalize the angle to stay within [0, 2π)
    //                 currentRotation[2] =
    //                     ((currentRotation[2] % (2 * Math.PI)) + 2 * Math.PI) %
    //                     (2 * Math.PI);
    //             }

    //             // Compute new rotation based on the normal
    //             const n = point.clone().add(fixedDirection);
    //             dummyObject.position.copy(point);
    //             dummyObject.lookAt(n);
    //             const normalEuler = new THREE.Euler().setFromQuaternion(
    //                 dummyObject.quaternion,
    //             );

    //             // Blend rotations: new X/Y from normal, adjusted Z from current
    //             const blendedRotation = [
    //                 normalEuler.x,
    //                 normalEuler.y,
    //                 currentRotation[2],
    //             ];
    //             console.log(globalStateData.manipulatorData.rotation);
    //             // Update global state with new data and store current normal Z
    //             globalStateData.manipulatorData = {
    //                 ...manipulatorData,
    //                 previousNormalZ: currentZ,
    //                 position: [point.x, point.y, point.z + 0.002],
    //                 rotation: blendedRotation,
    //             };
    //             break;
    //         }
    //         default:
    //             break;
    //     }
    // };

    return (
        <>
            <LoadCameraControls ref={loadCameraControlsRef} />
            <LoadEnvironment />
            <LoadTinJar move={move} />
            <Manipulator />
        </>
    );
}
