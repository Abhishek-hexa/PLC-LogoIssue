import * as THREE from 'three';
import { Line } from '@react-three/drei';
import { useEffect } from 'react';
import EndPoint from './EndPoint';
import { useRef } from 'react';
import { useSnapshot } from 'valtio';
import globalStateData from '../globalState/globalState';
import { useThree } from '@react-three/fiber';

export default function Manipulator() {
    const globalState = useSnapshot(globalStateData);
    const groupRef = useRef();
    const { mouseData, manipulatorData, selectedLogoId } = globalState;
    const { position, size, rotation } = manipulatorData;
    const width = size[0];
    const height = size[1];
    const { scene } = useThree();

    useEffect(() => {
        if (!selectedLogoId) return;

        let logoData = globalState.logoArr.find((e) => e.id === selectedLogoId);
        if (!logoData) return;

        globalStateData.manipulatorData = {
            position: logoData.position,
            size: logoData.size,
            rotation: logoData.rotation,
        };
    }, [selectedLogoId]);

    useEffect(() => {
        if (!selectedLogoId) return;

        let logoData = globalState.logoArr.find((e) => e.id === selectedLogoId);
        if (!logoData) return;

        globalStateData.logoArr = globalState.logoArr.map((e) => {
            if (e.id === selectedLogoId) {
                return {
                    ...e,
                    position: position,
                    size: size,
                    rotation: rotation,
                };
            } else {
                return e;
            }
        });
    }, [manipulatorData]);

    const down = (e) => {
        e.stopPropagation();
        let mesh = e.object;
        let intersect = {
            point: e.point,
            object: mesh.name,
            isDown: true,
        };

        if (mesh.name === 'moveHelper') {
            intersect.type = 'move';
        } else if (mesh.name.includes('scaleHelper')) {
            intersect.type = 'scale';
        } else if (mesh.name.includes('rotateHelper')) {
            intersect.type = 'rotate';
            const manipulatorPos = new THREE.Vector3().fromArray(position);
            const mousePos = e.point;
            const dir = new THREE.Vector3()
                .subVectors(mousePos, manipulatorPos)
                .normalize();
            intersect.initialAngle = Math.atan2(dir.y, dir.x);
            intersect.initialRotation = [...rotation];
        }
        globalStateData.mouseData = intersect;
    };

    const up = (e) => {
        e.stopPropagation();
        globalStateData.mouseData = {
            isDown: false,
            object: null,
            point: null,
        };
    };

    const move = (e) => {
        e.stopPropagation();
        if (!mouseData?.isDown) return;

        const point = e.point;
        if (!point) return;

        window.cameraControls.enabled = false;

        if (mouseData.type === 'rotate') {
            const manipulatorPos = new THREE.Vector3().fromArray(position);
            const mousePos = point;
            const dir = new THREE.Vector3()
                .subVectors(mousePos, manipulatorPos)
                .normalize();
            const currentAngle = Math.atan2(dir.y, dir.x);
            const angleDiff = currentAngle - mouseData.initialAngle;
            console.log(angleDiff);
            groupRef.current.rotation.set(
                mouseData.initialRotation[0],
                mouseData.initialRotation[1],
                mouseData.initialRotation[2],
            );

            groupRef.current.rotateZ(angleDiff);

            globalStateData.manipulatorData = {
                ...manipulatorData,
                rotation: [
                    groupRef.current.rotation.x,
                    groupRef.current.rotation.y,
                    groupRef.current.rotation.z,
                ],
                angleDiff: angleDiff,
            };
            return;
        }

        let pickedObj = scene.getObjectByName(mouseData.object);
        if (!pickedObj) return;

        if (mouseData.type === 'scale') {
            let currentDist = new THREE.Vector3()
                .fromArray(position)
                .distanceTo(pickedObj.getWorldPosition(new THREE.Vector3()));

            let newDist = new THREE.Vector3()
                .fromArray(position)
                .distanceTo(point);
            let diff = newDist - currentDist;
            let scaleFactor = 1 + diff / currentDist;

            let newSize = {
                width: width * scaleFactor,
                height: height * scaleFactor,
            };
            globalStateData.manipulatorData = {
                ...manipulatorData,
                size: [
                    newSize.width,
                    newSize.height,
                    Math.max(newSize.width, newSize.height),
                ],
            };
        }
    };

    const isScale = mouseData?.type === 'scale';
    const isRotate = mouseData?.type === 'rotate';
    const lineRef = useRef();

    if (lineRef.current) {
        lineRef.current.material.depthTest = false;
        lineRef.current.renderOrder = 999;
    }

    return (
        <group
            name="manipulator"
            visible={selectedLogoId ? true : false}
            onPointerDown={down}
            onPointerUp={up}
            position={position}
            rotation={rotation}
            ref={groupRef}>
            <group>
                <EndPoint
                    position={[width / 2, height / 2, 0]}
                    name="scaleHelperTR"
                />
                <EndPoint
                    position={[-width / 2, height / 2, 0]}
                    name="scaleHelperTL"
                />
                <EndPoint
                    position={[width / 2, -height / 2, 0]}
                    name="scaleHelperBR"
                />
                <EndPoint
                    position={[-width / 2, -height / 2, 0]}
                    name="scaleHelperBL"
                />
                <EndPoint
                    position={[width / 2 + 0.05, 0, 0]}
                    name="rotateHelperRight"
                    color="blue"
                    size={0.002}
                />
                <EndPoint
                    position={[0, height / 2 + 0.05, 0]}
                    name="rotateHelperTop"
                    color="blue"
                    size={0.002}
                />
            </group>
            <Line
                points={[
                    [-width / 2, height / 2, 0],
                    [width / 2, height / 2, 0],
                    [width / 2, -height / 2, 0],
                    [-width / 2, -height / 2, 0],
                    [-width / 2, height / 2, 0],
                ]}
                color="black"
                lineWidth={5}
                dashed={false}
                ref={lineRef}
            />
            <mesh name="moveHelper" visible={false}>
                <planeGeometry args={[width, height]} />
                <meshStandardMaterial color="red" side={THREE.DoubleSide} />
            </mesh>
            <mesh
                visible={false}
                onPointerMove={isScale || isRotate ? move : undefined}
                name="dummyPlane">
                <planeGeometry args={[100, 100]} />
                <meshStandardMaterial color="red" transparent opacity={0.5} />
            </mesh>
        </group>
    );
}
