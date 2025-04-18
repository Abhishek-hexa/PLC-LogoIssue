import { useGLTF } from '@react-three/drei';
import { useEffect, useRef } from 'react';
import MeshBuilder from '../MeshBuilder/MeshBuilder';
import globalStateData from '../globalState/globalState';

const LoadBox = (props) => {
    const { scene, nodes } = useGLTF('/assets/glbFiles/foldedboxv2.0.8.glb');
    const objectRef = useRef();
    const topOutSideRef = useRef();
    const leftOutSideRef = useRef();
    const rightOutSideRef = useRef();
    const backOutSideRef = useRef();
    const frontOutSideRef = useRef();

    useEffect(() => {
        let logoMeshes = scene.children.filter(
            (child) => child.userData.isLogoMesh,
        );
        globalStateData.logoMeshes = logoMeshes.map((e) => e.name);
        globalStateData.selectedLogoMesh = logoMeshes[0]?.name;
    }, [scene.children]);

    useEffect(() => {
        switch (globalStateData.selectedLogoMesh) {
            case 'topoutside':
                globalStateData.currentMeshObject = topOutSideRef.current;
                break;
            case 'leftoutside':
                globalStateData.currentMeshObject = leftOutSideRef.current;
                break;
            case 'rightoutside':
                globalStateData.currentMeshObject = rightOutSideRef.current;
                break;
            case 'backoutside':
                globalStateData.currentMeshObject = backOutSideRef.current;
                break;
            case 'frontoutside':
                globalStateData.currentMeshObject = frontOutSideRef.current;
                break;
            default:
                globalStateData.currentMeshObject = null;
        }
        props.cameraControls.current.fitToBox(objectRef.current, true);
    }, [globalStateData.selectedLogoMesh]);

    return (
        <group ref={objectRef} position={[0.02, 0.03, 0.05]}>
            <MeshBuilder
                mesh={nodes.backoutside}
                move={props.move}
                ref={backOutSideRef}
            />
            <MeshBuilder mesh={nodes.bottomoutside} move={props.move} />
            <MeshBuilder
                mesh={nodes.frontoutside}
                move={props.move}
                ref={frontOutSideRef}
            />
            <MeshBuilder mesh={nodes.leftfoldoutside} move={props.move} />
            <MeshBuilder
                mesh={nodes.leftoutside}
                move={props.move}
                ref={leftOutSideRef}
            />
            <MeshBuilder mesh={nodes.rightfoldoutside} move={props.move} />
            <MeshBuilder
                mesh={nodes.rightoutside}
                move={props.move}
                ref={rightOutSideRef}
            />
            <MeshBuilder
                mesh={nodes.topoutside}
                move={props.move}
                ref={topOutSideRef}
            />
            <MeshBuilder mesh={nodes.topoutside1} move={props.move} />
        </group>
    );
};

export default LoadBox;
