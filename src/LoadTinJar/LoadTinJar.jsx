import { useGLTF } from '@react-three/drei';
import { useEffect, useRef } from 'react';
import MeshBuilder from '../MeshBuilder/MeshBuilder';
import globalStateData from '../globalState/globalState';

const LoadTinJar = (props) => {
    const { scene, nodes } = useGLTF('/assets/glbFiles/4OzTinJarV2.0.0.glb');
    const objectRef = useRef();
    const tinRef = useRef();

    useEffect(() => {
        let logoMeshes = scene.children.filter(
            (child) => child.userData.isLogoMesh,
        );
        globalStateData.logoMeshes = logoMeshes.map((e) => e.name);
        globalStateData.selectedLogoMesh = logoMeshes[0]?.name;
    }, []);

    useEffect(() => {
        // Store the actual mesh object itself, not the ref
        if (tinRef.current) {
            globalStateData.currentMeshObject = tinRef.current;
            props.cameraControls.current.fitToBox(objectRef.current, true);
        }
    }, [tinRef.current]); // Dependency on the current value

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
            {/* <MeshBuilder mesh={nodes.Lid} move={props.move} /> */}
            <MeshBuilder mesh={nodes.Dust_Lid} />
        </group>
    );
};

export default LoadTinJar;
