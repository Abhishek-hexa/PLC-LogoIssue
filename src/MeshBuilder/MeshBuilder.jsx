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
                defaultPos = [
                    0.007383805451391482, 0.11826410847025945,
                    0.06023130616090583,
                ];
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

                raycaster.set(upLiftedPoint, rayDirection);

                const intersects = raycaster.intersectObject(ref.current, true);
                if (intersects.length > 0) {
                    defaultNormal = intersects[0].normal;
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
                defaultPos = [
                    0.01917499625852005, 0.07997076888782557,
                    0.01033799988031382,
                ];
                defaultNormal = new THREE.Vector3(
                    0.01917499625852005,
                    0.07323132975528404,
                    -9.991662000119685,
                );
                break;
            case 'frontoutside':
                defaultPos = [
                    0.019984598936568083, 0.07997076888782557,
                    0.06023130616090583,
                ];
                defaultNormal = new THREE.Vector3(
                    0.019984598936568083,
                    0.07997076888782557,
                    10.091629068553448,
                );
                break;
            case 'Jar':
                defaultPos = [
                    0.01734962116276329, 0.05332992313939302,
                    0.08324896520546525,
                ];
                defaultNormal = new THREE.Vector3(
                    -0.8273229034761411,
                    -0.03662904975732841,
                    10.03935150661017,
                );
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
                    globalStateData.currentMeshObject,
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
                    defaultNormal = glassFrontIntersections[0].normal;
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
                    defaultNormal = glassBackIntersections[0].normal;
                    glassBackPosition.copy(glassBackIntersections[0].point);
                }
                break;

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
