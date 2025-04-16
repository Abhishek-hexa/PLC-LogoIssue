import { Canvas } from '@react-three/fiber';
import Experience from './Experience';
import { useSnapshot } from 'valtio';
import globalStateData from './globalState/globalState';
import { useEffect } from 'react';
import * as THREE from 'three';
import { v4 as uuidv4 } from 'uuid';
import { ref } from 'valtio';

export default function App() {
    const snap = useSnapshot(globalStateData);

    useEffect(() => {}, [snap.selectedLogoMesh]);

    const uploadImage = (e) => {
        const file = e.target.files[0];
        const selectedName = snap.logoMeshes.find(
            (e) => e === snap.selectedLogoMesh,
        );
        if (!selectedName) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            // cache the image blob
            let blob = new Blob([e.target.result], { type: file.type });
            let url = URL.createObjectURL(blob);

            let newData = {
                name: selectedName,
                map: ref(new THREE.TextureLoader().load(url)),
                id: uuidv4(),
            };
            globalStateData.logoArr = [...globalStateData.logoArr, newData];
            globalStateData.selectedLogoId = newData.id;
        };
        reader.readAsArrayBuffer(file);
    };
    return (
        <>
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    zIndex: 1,
                    background: 'white',
                }}>
                <input type="file" onChange={uploadImage} />
                {snap.logoMeshes.map((e, index) => {
                    return (
                        <div key={index}>
                            <input
                                type="radio"
                                name="logo"
                                value={e}
                                defaultChecked={index === 0}
                                onChange={(e) => {
                                    globalStateData.selectedLogoMesh =
                                        e.target.value;
                                    globalStateData.selectedLogoId = null;
                                }}
                            />
                            <label>{e}</label>
                        </div>
                    );
                })}
            </div>
            <Canvas shadows camera={{ fov: 20, position: [0, 0, 0.5] }}>
                <Experience />
            </Canvas>
        </>
    );
}
