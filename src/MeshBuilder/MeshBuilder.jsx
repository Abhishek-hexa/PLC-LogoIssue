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
    if (props.color && !props.material) {
        meshMaterial = props.mesh.material;
        meshMaterial.color.set(new THREE.Color(props.color));
    } else if (props.material && props.color) {
        meshMaterial = props.material;
        meshMaterial.color.set(new THREE.Color(props.color));
    } else if (props.material && !props.color) {
        meshMaterial = props.material;
    } else if (!props.material && !props.color) {
        meshMaterial = props.mesh.material;
    }
    const logos = globalState.logoArr.filter((e) => e.name == props.mesh.name);

    let defaultPos = [
        0.0442476835846901, 0.05171097137033939, 0.06989955827593804,
    ];
    let defaultRot = [
        -0.028024421525668045, 0.5888754552421681, 0.015568317377550699,
    ];
    const defaultSize = props.mesh.userData.size
        ? props.mesh.userData.size.split(',').map((e) => parseFloat(e))
        : [0.05, 0.05, 0.05];

    let defaultNormal = [
        5.598510083258152, 0.2847219749540091, 8.382292389124633,
    ];

    const meshLogos = logos.filter((e) => e.name == props?.mesh.name);
    let isUpdate = false;
    meshLogos.forEach((e) => {
        if (!e.position) {
            isUpdate = true;
        }
    });
    if (isUpdate) {
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
