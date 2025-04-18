import { Canvas } from '@react-three/fiber';
import Experience from './Experience';
import { useSnapshot } from 'valtio';
import globalStateData from './globalState/globalState';
import { useEffect } from 'react';
import * as THREE from 'three';
import { v4 as uuidv4 } from 'uuid';
import { ref } from 'valtio';
import './App.css';

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
        <div className="app-container">
            <div className="control-panel">
                <div className="upload-section">
                    <label className="upload-button">
                        Upload Logo
                        <input
                            type="file"
                            onChange={uploadImage}
                            accept="image/*"
                            className="file-input"
                        />
                    </label>
                </div>

                <div className="logo-selection">
                    <h3>Select Logo Type</h3>
                    <div className="radio-group">
                        {snap.logoMeshes.map((e, index) => (
                            <label key={index} className="radio-label">
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
                                    className="radio-input"
                                />
                                <span className="radio-custom"></span>
                                {e}
                            </label>
                        ))}
                    </div>
                </div>
            </div>

            <Canvas
                shadows
                camera={{
                    fov: 20,
                    position: [0, 0, 0.5],
                    near: 0.01,
                    far: 100,
                }}>
                <Experience />
            </Canvas>
        </div>
    );
}
