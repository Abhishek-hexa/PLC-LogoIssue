/* eslint-disable no-case-declarations */
/* eslint-disable react/display-name */
import * as THREE from 'three';
import { Decal } from '@react-three/drei';
import { useSnapshot } from 'valtio';
import globalStateData from '../globalState/globalState';
import React from 'react';
import { Utils3d } from '../utils/Utils3d';
import { useThree } from '@react-three/fiber';

const MeshBuilder = React.forwardRef((props, ref) => {
    let globalState = useSnapshot(globalStateData);
    const { scene } = useThree();
    const { mouseData } = globalState;
    let meshMaterial;

    const defaultColor = new THREE.Color('white');

    if (props.color && !props.material) {
        meshMaterial = props.mesh.material;
        meshMaterial.color.set(new THREE.Color(props.color));
    } else if (props.material && props.color) {
        meshMaterial = props.material;
        meshMaterial.color.set(new THREE.Color(props.color));
    } else if (props.material && !props.color) {
        meshMaterial = props.material;
        meshMaterial.color.copy(defaultColor);
    } else if (!props.material && !props.color) {
        meshMaterial = props.mesh.material;
        meshMaterial.color.copy(defaultColor);
    }

    const logos = globalState.logoArr.filter((e) => e.name == props.mesh.name);
    let defaultPos = [
        0.007383805451391482, 0.11826410847025945, 0.06023130616090583,
    ];
    let defaultRot = [
        -0.028024421525668045, 0.5888754552421681, 0.015568317377550699,
    ];
    const defaultSize = props.mesh.userData.size
        ? props.mesh.userData.size.split(',').map((e) => parseFloat(e))
        : [0.05, 0.05, 0.05];

    let defaultNormal = new THREE.Vector3(
        0.021399414007969773,
        10.102013433384716,
        -0.5182240307254551,
    );

    const meshLogos = logos.filter((e) => e.name == props?.mesh.name);
    let isUpdate = false;
    meshLogos.forEach((e) => {
        if (!e.position) {
            isUpdate = true;
        }
    });
    if (isUpdate) {
        switch (globalStateData.selectedLogoMesh) {
            case 'topoutside':
                defaultPos = [0, 0.065838, -0.05295];
                const position = new THREE.Vector3(
                    defaultPos[0],
                    defaultPos[1],
                    defaultPos[2],
                );
                const closetPointNormal = Utils3d.calculateClosestPointNormal(
                    globalStateData.currentMeshObject,
                    position,
                );
                const rayDirection = closetPointNormal.clone().negate();
                const raycaster = new THREE.Raycaster();
                const upLiftedPoint =
                    Utils3d.upLiftAPointIntheDirectionOfNormal(
                        position.clone(),
                        closetPointNormal.clone(),
                        0.005,
                    );
                const sphereGeometryTop = new THREE.SphereGeometry(
                    0.01,
                    16,
                    16,
                );
                const sphereMaterialTop = new THREE.MeshBasicMaterial({
                    color: 0xff0000,
                });
                const debugSphereTop = new THREE.Mesh(
                    sphereGeometryTop,
                    sphereMaterialTop,
                );
                debugSphereTop.position.copy(upLiftedPoint);
                scene.add(debugSphereTop);

                const arrowHelperTop = new THREE.ArrowHelper(
                    rayDirection,
                    upLiftedPoint,
                    0.2,
                    0x00ff00,
                );
                scene.add(arrowHelperTop);
                raycaster.set(upLiftedPoint, rayDirection);
                const intersects = raycaster.intersectObject(ref.current, true);
                if (intersects.length > 0) {
                    defaultNormal = intersects[0].face.normal;
                    position.copy(intersects[0].point);
                }
                break;
            case 'leftoutside':
                defaultPos = [
                    -0.021616000235080774, 0.08054081410082709,
                    0.047727907492016594,
                ];
                defaultNormal = new THREE.Vector3(
                    -10.021616000235081,
                    0.08054081410082709,
                    0.04572790749201659,
                );
                break;
            case 'rightoutside':
                defaultPos = [
                    0.06161545634269726, 0.07722432208200242,
                    0.05031269673415649,
                ];
                defaultNormal = new THREE.Vector3(
                    10.061615456342697,
                    0.07722432208200242,
                    0.04831269673415649,
                );
                break;
            case 'backoutside':
                const defaultBackJarPosition = [-0.05, 0.042388, -0.041662];
                const backOutsidePosition = new THREE.Vector3(
                    defaultBackJarPosition[0],
                    defaultBackJarPosition[1],
                    defaultBackJarPosition[2],
                );
                const backOutsideNormal = Utils3d.calculateClosestPointNormal(
                    ref.current,
                    backOutsidePosition,
                );
                const backRayDirection = backOutsideNormal.clone().negate();
                let adjustedBackPosition =
                    Utils3d.upLiftAPointIntheDirectionOfNormal(
                        backOutsidePosition.clone(),
                        backOutsideNormal.clone(),
                        0.05,
                    );

                const sphereGeometry = new THREE.SphereGeometry(0.01, 16, 16);
                const sphereMaterial = new THREE.MeshBasicMaterial({
                    color: 0xff0000,
                });
                const debugSphere = new THREE.Mesh(
                    sphereGeometry,
                    sphereMaterial,
                );
                debugSphere.position.copy(adjustedBackPosition);
                scene.add(debugSphere);

                const arrowHelper = new THREE.ArrowHelper(
                    backRayDirection,
                    adjustedBackPosition,
                    0.2,
                    0x00ff00,
                );
                scene.add(arrowHelper);

                const backRaycaster = new THREE.Raycaster();
                backRaycaster.set(adjustedBackPosition, backRayDirection);
                const backIntersections = backRaycaster.intersectObject(
                    ref.current,
                    true,
                );
                if (backIntersections.length > 0) {
                    defaultNormal = backIntersections[0].face.normal;
                    backOutsidePosition.copy(backIntersections[0].point);
                }
                break;

            case 'frontoutside':
                if (props.boxRef.current) {
                    const defaultFrontJarPosition = [0, 0.042388, 0.041383];
                    const frontOutsidePosition = new THREE.Vector3(
                        defaultFrontJarPosition[0],
                        defaultFrontJarPosition[1],
                        defaultFrontJarPosition[2],
                    );
                    frontOutsidePosition.add(props.boxRef.current.position);
                    // Add sphere at default position (before any adjustments)
                    const defaultPositionSphereGeo = new THREE.SphereGeometry(
                        0.01,
                        16,
                        16,
                    );
                    const defaultPositionSphereMat =
                        new THREE.MeshBasicMaterial({
                            color: 0x0000ff, // Blue color for default position
                        });
                    const defaultPositionSphere = new THREE.Mesh(
                        defaultPositionSphereGeo,
                        defaultPositionSphereMat,
                    );
                    defaultPositionSphere.position.copy(
                        frontOutsidePosition.clone(),
                    );
                    scene.add(defaultPositionSphere);

                    const frontOutsideNormal =
                        Utils3d.calculateClosestPointNormal(
                            ref.current,
                            frontOutsidePosition,
                        );
                    const frontSideRayDirection = frontOutsideNormal
                        .clone()
                        .negate();
                    // .add(props.boxRef.current.position);
                    const adjustedFrontPosition =
                        Utils3d.upLiftAPointIntheDirectionOfNormal(
                            frontOutsidePosition.clone(),
                            frontOutsideNormal.clone(),
                            0.005,
                        );

                    // Red sphere at adjusted position
                    const sphereGeometryFront = new THREE.SphereGeometry(
                        0.01,
                        16,
                        16,
                    );
                    const sphereMaterialFront = new THREE.MeshBasicMaterial({
                        color: 0xff0000,
                    });
                    const debugSphereFront = new THREE.Mesh(
                        sphereGeometryFront,
                        sphereMaterialFront,
                    );
                    debugSphereFront.position.copy(
                        adjustedFrontPosition.clone(),
                    );
                    scene.add(debugSphereFront);

                    // Green arrow showing ray direction
                    const arrowHelperFront = new THREE.ArrowHelper(
                        frontSideRayDirection,
                        adjustedFrontPosition.clone(),
                        0.2,
                        0x00ff00,
                    );
                    scene.add(arrowHelperFront);

                    const frontRaycaster = new THREE.Raycaster();
                    frontRaycaster.set(
                        adjustedFrontPosition,
                        frontSideRayDirection,
                    );
                    const frontIntersections = frontRaycaster.intersectObject(
                        ref.current,
                        true,
                    );
                    debugger;
                    if (frontIntersections.length > 0) {
                        defaultNormal = frontIntersections[0].face.normal;
                        frontOutsidePosition.copy(frontIntersections[0].point);
                    }
                }

                break;
            case 'Jar':
                defaultPos = [
                    0.01734962116276329, 0.05332992313939302,
                    0.08324896520546525,
                ];
                const jarPosition = new THREE.Vector3(
                    defaultPos[0],
                    defaultPos[1],
                    defaultPos[2],
                );
                const jarNormal = Utils3d.calculateClosestPointNormal(
                    globalStateData.currentMeshObject,
                    jarPosition,
                );
                const frontRayDirection = jarNormal.clone().negate();
                const jarLiftedPosition =
                    Utils3d.upLiftAPointIntheDirectionOfNormal(
                        jarPosition.clone(),
                        jarNormal.clone(),
                        0.005,
                    );
                const jarRaycaster = new THREE.Raycaster();
                jarRaycaster.set(jarLiftedPosition, frontRayDirection);
                console.log(ref.current);
                const jarIntersections = jarRaycaster.intersectObject(
                    ref.current,
                    true,
                );
                if (jarIntersections.length > 0) {
                    defaultNormal = jarIntersections[0].face.normal;
                    console.log(defaultNormal);
                    jarPosition.copy(jarIntersections[0].point);
                }
                break;

            case 'Lid_Side':
                defaultPos = [
                    0.05421435158634437, 0.06719581148090548,
                    0.050523138631589554,
                ];
                defaultNormal = new THREE.Vector3(
                    9.827752464226725,
                    2.183312394828226,
                    0.04852313863158955,
                );
                break;
            case 'GlassFront':
                defaultPos = [
                    -0.005356870461734404, 0.08484233975891825,
                    0.08314672843369543,
                ];
                const glassFrontPosition = new THREE.Vector3(
                    defaultPos[0],
                    defaultPos[1],
                    defaultPos[2],
                );
                const glassFrontNormal = Utils3d.calculateClosestPointNormal(
                    ref.current,
                    glassFrontPosition,
                );

                const glassFrontRayDirection = glassFrontNormal
                    .clone()
                    .negate();
                const glassFrontLiftedPosition =
                    Utils3d.upLiftAPointIntheDirectionOfNormal(
                        glassFrontPosition.clone(),
                        glassFrontNormal.clone(),
                        0.005,
                    );
                const glassFrontRaycaster = new THREE.Raycaster();

                glassFrontRaycaster.set(
                    glassFrontLiftedPosition,
                    glassFrontRayDirection,
                );

                const glassFrontIntersections =
                    glassFrontRaycaster.intersectObject(ref.current, true);
                if (glassFrontIntersections.length > 0) {
                    defaultNormal = glassFrontIntersections[0].face.normal;
                    glassFrontPosition.copy(glassFrontIntersections[0].point);
                }
                break;
            case 'GlassBack':
                defaultPos = [
                    0.03705962431734593, 0.07398426791552337,
                    0.016707997116143417,
                ];
                const glassBackPosition = new THREE.Vector3(
                    defaultPos[0],
                    defaultPos[1],
                    defaultPos[2],
                );
                const glassBackNormal = Utils3d.calculateClosestPointNormal(
                    globalStateData.currentMeshObject,
                    glassBackPosition,
                );

                const glassBackRayDirection = glassBackNormal.clone().negate();
                const glassBackLiftedPosition =
                    Utils3d.upLiftAPointIntheDirectionOfNormal(
                        glassBackPosition.clone(),
                        glassBackNormal.clone(),
                        0.005,
                    );
                const glassBackRaycaster = new THREE.Raycaster();

                glassBackRaycaster.set(
                    glassBackLiftedPosition,
                    glassBackRayDirection,
                );

                const glassBackIntersections =
                    glassBackRaycaster.intersectObject(ref.current, true);
                if (glassBackIntersections.length > 0) {
                    defaultNormal = glassBackIntersections[0].face.normal;
                    glassBackPosition.copy(glassBackIntersections[0].point);
                }
                break;
            case 'topside':
                defaultPos = [0, 0.1099, 0.001283];
                const topsidePosition = new THREE.Vector3(
                    defaultPos[0],
                    defaultPos[1],
                    defaultPos[2],
                );
                const topsideNormal = Utils3d.calculateClosestPointNormal(
                    globalStateData.currentMeshObject,
                    topsidePosition,
                );
                const topsideRayDirection = topsideNormal.clone().negate();
                const topsideLiftedPosition =
                    Utils3d.upLiftAPointIntheDirectionOfNormal(
                        topsidePosition.clone(),
                        topsideNormal.clone(),
                        0.005,
                    );
                const topsideRaycaster = new THREE.Raycaster();

                topsideRaycaster.set(
                    topsideLiftedPosition,
                    topsideRayDirection,
                );
                const topsideIntersections = topsideRaycaster.intersectObject(
                    ref.current,
                    true,
                );
                if (topsideIntersections.length > 0) {
                    defaultNormal = topsideIntersections[0].face.normal;
                    topsidePosition.copy(topsideIntersections[0].point);
                }
                break;
            case 'topfrontside':
                defaultPos = [0, 0.065838, 0.055515];
                const topfrontsidePosition = new THREE.Vector3(
                    defaultPos[0],
                    defaultPos[1],
                    defaultPos[2],
                );
                const topfrontsideNormal = Utils3d.calculateClosestPointNormal(
                    globalStateData.currentMeshObject,
                    topfrontsidePosition,
                );
                const topfrontsideRayDirection = topfrontsideNormal
                    .clone()
                    .negate();
                const topfrontsideLiftedPosition =
                    Utils3d.upLiftAPointIntheDirectionOfNormal(
                        topfrontsidePosition.clone(),
                        topfrontsideNormal.clone(),
                        0.005,
                    );
                const topfrontsideRaycaster = new THREE.Raycaster();

                topfrontsideRaycaster.set(
                    topfrontsideLiftedPosition,
                    topfrontsideRayDirection,
                );

                const topfrontsideIntersections =
                    topfrontsideRaycaster.intersectObject(ref.current, true);
                if (topfrontsideIntersections.length > 0) {
                    defaultNormal = topfrontsideIntersections[0].face.normal;
                    topfrontsidePosition.copy(
                        topfrontsideIntersections[0].point,
                    );
                }
                break;
            case ''
            default:
                break;
        }
        globalStateData.logoArr = globalStateData.logoArr.map((e) => {
            if (e.name == props.mesh.name && !e.position) {
                const dummyObject = new THREE.Object3D();
                const p = new THREE.Vector3(
                    defaultPos[0],
                    defaultPos[1],
                    defaultPos[2],
                );
                dummyObject.position.copy(p);
                const n = defaultNormal.clone();
                n.multiplyScalar(10);
                n.add(p);
                dummyObject.lookAt(n);
                dummyObject.rotateZ(defaultRot[2]);

                e.position = [
                    dummyObject.position.x,
                    dummyObject.position.y,
                    dummyObject.position.z,
                ];
                e.rotation = [
                    dummyObject.rotation.x,
                    dummyObject.rotation.y,
                    dummyObject.rotation.z,
                ];
                e.size = defaultSize;
                e.manipulatorNormal = defaultNormal;
            }
            return e;
        });
    }
    const selectLogo = (id) => {
        let logo = globalState.logoArr.find((e) => e.id == id);
        if (!logo) return;

        globalStateData.selectedLogoId = logo.id;
        globalStateData.selectedLogoMesh = props.mesh.name;
    };
    const finalMeshLogos = meshLogos.filter((e) => e.position);
    return (
        <>
            <mesh
                ref={ref}
                onPointerMove={
                    mouseData?.type == 'move'
                        ? (e) => {
                              props.move(e);
                          }
                        : undefined
                }
                castShadow={props.castShadow}
                receiveShadow={props.receiveShadow}
                geometry={props.mesh.geometry}
                position={0}
                rotation={props.mesh.rotation}
                material={!meshMaterial ? props.material : meshMaterial}
                visible={props.visible}
                name={props.mesh.name}>
                {finalMeshLogos.map((e, index) => {
                    return (
                        <Decal
                            key={index}
                            scale={e.size}
                            position={[
                                e.position[0] - 0.02,
                                e.position[1] - 0.03,
                                e.position[2] - 0.05,
                            ]}
                            rotation={e.rotation}
                            map={e.map}
                            onClick={() => selectLogo(e.id)}
                        />
                    );
                })}
            </mesh>
        </>
    );
});

export default MeshBuilder;
