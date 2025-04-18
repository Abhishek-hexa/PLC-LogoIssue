import { proxy } from 'valtio';

const globalStateData = proxy({
    texture: './uv.jpg',
    logoMeshes: [],
    selectedLogoMesh: null,
    selectedLogoId: null,
    logoArr: [],
    manipulatorData: {
        position: [0, 0.02, 0.025],
        size: [0.01, 0.01],
        rotation: [0, 0, 0],
        angleDiff: 0,
        manipulatorNormal: null,
    },
    mouseData: {
        isDown: false,
        object: null,
        point: null,
        type: null,
        prevNormal: null,
    },
    initialZDirection: undefined,
    logoRotations: {}, // Store angleDiff for each logo
    currentMeshObject: null, // Store the actual mesh object instead of the ref
    currentBoxRef: null,

    // Method to access the current mesh (if needed)
    getCurrentMesh() {
        return this.currentMeshObject;
    },
});

export default globalStateData;
