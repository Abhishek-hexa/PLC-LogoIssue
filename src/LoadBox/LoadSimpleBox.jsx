import { useGLTF } from '@react-three/drei';
import { useEffect, useRef } from 'react';
import MeshBuilder from '../MeshBuilder/MeshBuilder';
import globalStateData from '../globalState/globalState';

const LoadSimpleBox = (props) => {
    const { scene, nodes } = useGLTF('/assets/glbFiles/twopartboxv3.0.1.glb');
    const objectRef = useRef();
    const topOutSideRef = useRef();
    const topFrontSide = useRef();
    const topRightSide = useRef();

    useEffect(() => {
        let logoMeshes = scene.children.filter(
            (child) => child.userData.isLogoMesh,
        );
        globalStateData.logoMeshes = logoMeshes.map((e) => e.name);
        globalStateData.selectedLogoMesh = logoMeshes[0]?.name;
    }, [scene.children]);
    useEffect(() => {
        switch (globalStateData.selectedLogoMesh) {
            case 'topside':
                globalStateData.currentMeshObject = topOutSideRef.current;
                break;
            case 'topfrontside':
                globalStateData.currentMeshObject = topFrontSide.current;
                break;
            case 'toprightside':
                globalStateData.currentMeshObject = topRightSide.current;
                break;

            default:
                globalStateData.currentMeshObject = null;
        }
        props.cameraControls.current.fitToBox(objectRef.current, true);
    }, [globalStateData.selectedLogoMesh]);

    return (
        <group ref={objectRef} position={[0, 0, 0]}>
            <MeshBuilder mesh={nodes.bottombackside} move={props.move} />
            <MeshBuilder mesh={nodes.bottomfrontside} move={props.move} />
            <MeshBuilder mesh={nodes.bottomleftside} move={props.move} />
            <MeshBuilder mesh={nodes.bottomrightside} move={props.move} />
            <MeshBuilder mesh={nodes.bottomside} move={props.move} />
            <MeshBuilder mesh={nodes.topbackside} move={props.move} />
            <MeshBuilder
                mesh={nodes.topfrontside}
                move={props.move}
                ref={topFrontSide}
            />
            <MeshBuilder mesh={nodes.topleftside} move={props.move} />
            <MeshBuilder
                mesh={nodes.toprightside}
                move={props.move}
                ref={topRightSide}
            />
            <MeshBuilder
                mesh={nodes.topside}
                move={props.move}
                ref={topOutSideRef}
            />
        </group>
    );
};

export default LoadSimpleBox;
