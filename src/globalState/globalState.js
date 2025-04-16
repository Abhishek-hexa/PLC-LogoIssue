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
    },
    mouseData: {
        isDown: false,
        object: null,
        point: null,
        type: null,
        prevNormal: null,
    },
    initialZDirection: undefined,
});

export default globalStateData;
