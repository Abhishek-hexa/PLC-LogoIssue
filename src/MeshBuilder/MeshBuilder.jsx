/* eslint-disable react/display-name */
import * as THREE from 'three';
import { Decal } from '@react-three/drei';
import { useSnapshot } from 'valtio';
import globalStateData from '../globalState/globalState';
import React from 'react';

const MeshBuilder = React.forwardRef((props, ref) => {
    let globalState = useSnapshot(globalStateData);
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
        meshMaterial.color.copy(defaultColor); // Set to white
    } else if (!props.material && !props.color) {
        meshMaterial = props.mesh.material;
        meshMaterial.color.copy(defaultColor); // Set to white
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
                defaultNormal = new THREE.Vector3(
                    0.002317513651015523,
                    10.104889200312131,
                    0.547928180116126,
                );
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
            default:
                break;
        }
        globalStateData.logoArr = globalStateData.logoArr.map((e) => {
            if (e.name == props.mesh.name && !e.position) {
                e.position = defaultPos;
                e.rotation = defaultRot;
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
