import { useGLTF } from '@react-three/drei';
import { useEffect, useRef } from 'react';
import MeshBuilder from '../MeshBuilder/MeshBuilder';
import globalStateData from '../globalState/globalState';

const LoadCandle = (props) => {
    const { scene, nodes } = useGLTF('/assets/glbFiles/9OzMainV4.9.glb');
    const objectRef = useRef();
    const glassBack = useRef();
    const glassFront = useRef();
    useEffect(() => {
        let logoMeshes = scene.children.filter(
            (child) => child.userData.isLogoMesh,
        );
        globalStateData.logoMeshes = logoMeshes.map((e) => e.name);
        globalStateData.selectedLogoMesh = logoMeshes[0]?.name;
    }, []);

    useEffect(() => {
        switch (globalStateData.selectedLogoMesh) {
            case 'GlassBack':
                globalStateData.currentMeshObject = glassBack.current;
                break;
            case 'GlassFront':
                globalStateData.currentMeshObject = glassFront.current;
                break;
            default:
                globalStateData.currentMeshObject = glassBack.current;
                break;
        }
        props.cameraControls.current.fitToBox(objectRef.current, true);
    }, [globalStateData.selectedLogoMesh]);

    return (
        <group ref={objectRef} position={[0.02, 0.03, 0.05]}>
            <MeshBuilder mesh={nodes.glassinner_1} move={props.move} />
            <MeshBuilder
                mesh={nodes.GlassBack}
                ref={glassBack}
                move={props.move}
            />
            <MeshBuilder
                mesh={nodes.GlassFront}
                ref={glassFront}
                move={props.move}
            />
            <MeshBuilder mesh={nodes.glassinner_2} move={props.move} />
        </group>
    );
};

export default LoadCandle;
