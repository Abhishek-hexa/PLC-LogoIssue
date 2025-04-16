import { useGLTF } from '@react-three/drei';
import { useEffect, useRef } from 'react';
import MeshBuilder from '../MeshBuilder/MeshBuilder';
import globalStateData from '../globalState/globalState';

const LoadTinJar = (props) => {
    const { scene, nodes } = useGLTF('/assets/glbFiles/2OzTinJarV1.0.4.glb');
    const objectRef = useRef();

    useEffect(() => {
        let logoMeshes = scene.children.filter(
            (child) => child.userData.isLogoMesh,
        );
        globalStateData.logoMeshes = logoMeshes.map((e) => e.name);
        globalStateData.selectedLogoMesh = logoMeshes[0]?.name;
    }, []);
    return (
        <group ref={objectRef} position={[0.02, 0.03, 0.05]}>
            <MeshBuilder mesh={nodes.Tin} move={props.move} />
            <MeshBuilder mesh={nodes.wax} />
            <MeshBuilder mesh={nodes.wick} />
            <MeshBuilder mesh={nodes.woodwick} />
            <MeshBuilder mesh={nodes.Lid1} move={props.move} />
            {/* <MeshBuilder mesh={nodes.Ribbonend} />
            <MeshBuilder mesh={nodes.Ribbonknot} />
            <MeshBuilder mesh={nodes.Ribbontop} /> */}
            <MeshBuilder mesh={nodes.Lid} move={props.move} />
            <MeshBuilder mesh={nodes.dustlid} />
        </group>
    );
};

export default LoadTinJar;
