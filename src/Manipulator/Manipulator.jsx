import * as THREE from 'three';
import { Line } from '@react-three/drei';
import { useEffect, useMemo, useState } from 'react';
import EndPoint from './EndPoint';
import { useRef } from 'react';
import { useSnapshot } from 'valtio';
import globalStateData from '../globalState/globalState';
import { useThree } from '@react-three/fiber';
import { extend } from '@react-three/fiber';

extend({ ArrowHelper: THREE.ArrowHelper });

export default function Manipulator() {
    const globalState = useSnapshot(globalStateData);
    const groupRef = useRef();
    const arrowRef = useRef();

    const { mouseData, manipulatorData, selectedLogoId } = globalState;
    const { position, size, rotation } = manipulatorData;
    const width = size[0];
    const height = size[1];
    const { scene } = useThree();
    const [currentNormal, setCurrentNormal] = useState([0, 0, 1]);

    const dummyObject = new THREE.Object3D();
    const arrowParams = useMemo(() => {
        const origin = new THREE.Vector3(width / 2 + 0.005, 0, 0);
        const dir = new THREE.Vector3(0.02, 0, 0);
        const length = dir.length();
        const color = new THREE.Color('blue');
        return { origin, dir, length, color };
    }, [width]);
    useEffect(() => {
        if (!selectedLogoId) return;

        let logoData = globalState.logoArr.find((e) => e.id === selectedLogoId);
        if (!logoData) return;

        // Get the stored angleDiff for this logo, or use 0 if none exists
        const storedAngleDiff = globalState.logoRotations[selectedLogoId] || 0;

        globalStateData.manipulatorData = {
            position: logoData.position,
            size: logoData.size,
            rotation: logoData.rotation,
            angleDiff: storedAngleDiff,
        };
    }, [selectedLogoId]);

    useEffect(() => {
        if (!selectedLogoId) return;

        let logoData = globalState.logoArr.find((e) => e.id === selectedLogoId);
        if (!logoData) return;

        // Store the current angleDiff for this logo
        globalStateData.logoRotations[selectedLogoId] =
            manipulatorData.angleDiff;

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
    useEffect(() => {
        if (!arrowRef.current) return;

        const origin = new THREE.Vector3().fromArray(position);
        const normal = new THREE.Vector3().fromArray(currentNormal);

        arrowRef.current.position.copy(origin);
        arrowRef.current.setDirection(normal);
        arrowRef.current.setLength(0.5);
    }, [currentNormal, position]);
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
    function findClosestPoint(points, target) {
        if (points.length === 0) {
            return null;
        }

        let closestPoint = points[0];
        let minDistanceSq = target.distanceToSquared(points[0]);

        for (let i = 1; i < points.length; i++) {
            const distanceSq = target.distanceToSquared(points[i]);
            if (distanceSq < minDistanceSq) {
                minDistanceSq = distanceSq;
                closestPoint = points[i];
            }
        }
        return closestPoint;
    }
    function calculateClosestPointNormal(mesh, point) {
        const allMeshPositions = mesh.geometry.attributes.position.array;
        const allPanelPositionsVectors = [];
        for (let i = 0; i < allMeshPositions.length; i += 3) {
            allPanelPositionsVectors.push(
                new THREE.Vector3(
                    allMeshPositions[i],
                    allMeshPositions[i + 1],
                    allMeshPositions[i + 2],
                ),
            );
        }
        const closestPoint = findClosestPoint(allPanelPositionsVectors, point);
        if (!closestPoint) {
            console.error('closest point not found');
            return;
        }

        const closestPointIndex = allPanelPositionsVectors.findIndex((point) =>
            point.equals(closestPoint),
        );

        const allPanelNormals = mesh.geometry.attributes.normal.array;
        const closestPointNormal = new THREE.Vector3(
            allPanelNormals[closestPointIndex * 3],
            allPanelNormals[closestPointIndex * 3 + 1],
            allPanelNormals[closestPointIndex * 3 + 2],
        );

        return closestPointNormal;
    }
    const move = (e) => {
        e.stopPropagation();
        if (!mouseData?.isDown) return;

        const point = e.point;
        const normal = e.normal;
        if (!point) return;

        window.cameraControls.enabled = false;
        const selectedLogo = globalState.logoArr.find(
            (e) => e.id === selectedLogoId,
        );
        const tempNormal = new THREE.Vector3(
            selectedLogo.position[0],
            selectedLogo.position[1],
            selectedLogo.position[2],
        );
        const meshRef = globalStateData.currentMeshObject;
        const closestPointNormal = calculateClosestPointNormal(
            meshRef,
            tempNormal,
        );
        if (globalState.manipulatorData.meraNormal === null) {
            return;
        }
        globalStateData.manipulatorData.meraNormal = closestPointNormal;
        if (mouseData.type === 'rotate') {
            const manipulatorPos = new THREE.Vector3()
                .fromArray(position)
                .clone();
            const mousePos = point;
            const dir = new THREE.Vector3()
                .subVectors(mousePos.clone(), manipulatorPos.clone())
                .normalize();
            let currentAngle = Math.atan2(dir.y, dir.x);

            const sign = Math.sign(
                globalState.manipulatorData.meraNormal.clone().z,
            );
            currentAngle *= sign;

            const n = globalState.manipulatorData.meraNormal
                ? globalState.manipulatorData.meraNormal.clone()
                : normal.clone();
            n.multiplyScalar(10);
            n.add(e.point.clone());
            let angleDiff = currentAngle;

            angleDiff =
                globalState.manipulatorData.meraNormal.clone().z < 0
                    ? angleDiff + Math.PI
                    : angleDiff;

            dummyObject.position.copy(e.point);
            dummyObject.lookAt(n);
            angleDiff ? dummyObject.rotateZ(angleDiff) : null;
            const normalRotation = dummyObject.rotation;

            const blendedRotation = [
                normalRotation.x,
                normalRotation.y,
                normalRotation.z,
            ];
            groupRef.current.rotation.set(
                blendedRotation[0],
                blendedRotation[1],
                blendedRotation[2],
            );

            globalStateData.manipulatorData = {
                ...manipulatorData,
                rotation: [
                    blendedRotation[0],
                    blendedRotation[1],
                    blendedRotation[2],
                ],
                angleDiff: angleDiff,
            };
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
                    position={[width / 2 + 0.005, 0, 0]}
                    name="rotateHelperRight"
                    color="blue"
                    size={0.002}
                />
                <primitive
                    object={
                        new THREE.ArrowHelper(
                            arrowParams.dir.normalize(),
                            arrowParams.origin,
                            arrowParams.length,
                            arrowParams.color,
                            0.01, // headLength
                            0.007, // headWidth
                        )
                    }
                    ref={arrowRef}
                />
                {/* <EndPoint
                    position={[0, height / 2 + 0.05, 0]}
                    name="rotateHelperTop"
                    color="blue"
                    size={0.002}
                /> */}
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
