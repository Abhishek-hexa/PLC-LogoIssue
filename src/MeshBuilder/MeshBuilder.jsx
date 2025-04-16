import * as THREE from 'three';
import { Decal } from '@react-three/drei';
import { useSnapshot } from 'valtio';
import globalStateData from '../globalState/globalState';
import { MathUtils } from 'three/src/math/MathUtils.js';

const MeshBuilder = (props) => {
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

    const defaultPos = [0.02, 0.03, 0.05];
    const defaultRot = props.mesh.userData.rotation
        ? props.mesh.userData.rotation
              .split(',')
              .map((e) => MathUtils.degToRad(parseFloat(e)))
        : [0, 0, 0];
    const defaultSize = props.mesh.userData.size
        ? props.mesh.userData.size.split(',').map((e) => parseFloat(e))
        : [0.05, 0.05, 0.05];

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
};

export default MeshBuilder;
