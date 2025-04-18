import { useGLTF } from '@react-three/drei';
import { useEffect, useRef } from 'react';
import MeshBuilder from '../MeshBuilder/MeshBuilder';
import globalStateData from '../globalState/globalState';

const LoadTinJar = (props) => {
    const { scene, nodes } = useGLTF('/assets/glbFiles/4OzTinJarV2.0.0.glb');
    const objectRef = useRef();
    const tinRef = useRef();
    const sideRef = useRef();
    useEffect(() => {
        let logoMeshes = scene.children.filter(
            (child) => child.userData.isLogoMesh,
        );
        globalStateData.logoMeshes = logoMeshes.map((e) => e.name);
        globalStateData.selectedLogoMesh = logoMeshes[0]?.name;
    }, []);

    useEffect(() => {
        switch (globalStateData.selectedLogoMesh) {
            case 'Jar':
                globalStateData.currentMeshObject = tinRef.current;
                break;
            case 'Lid_Side':
                globalStateData.currentMeshObject = sideRef.current;
                break;
            default:
                globalStateData.currentMeshObject = tinRef.current;
                break;
        }
        props.cameraControls.current.fitToBox(objectRef.current, true);
    }, [globalStateData.selectedLogoMesh]);

    return (
        <group ref={objectRef} position={[0.02, 0.03, 0.05]}>
            <MeshBuilder mesh={nodes.Jar} move={props.move} ref={tinRef} />
            <MeshBuilder mesh={nodes.Tin} move={props.move} />
            <MeshBuilder mesh={nodes.Wax} />
            <MeshBuilder mesh={nodes.Wick} />
            {/* <MeshBuilder mesh={nodes.woodwick} /> */}
            <MeshBuilder mesh={nodes.Lid1} move={props.move} />
            {/* <MeshBuilder mesh={nodes.Ribbonend} />
            <MeshBuilder mesh={nodes.Ribbonknot} /> 
            <MeshBuilder mesh={nodes.Ribbontop} /> */}
            <MeshBuilder mesh={nodes.Lid2} move={props.move} />
            <MeshBuilder
                mesh={nodes.Lid_Side}
                ref={sideRef}
                move={props.move}
            />
        </group>
    );
};

export default LoadTinJar;
