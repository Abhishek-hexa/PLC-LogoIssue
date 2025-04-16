import { CameraControls } from '@react-three/drei';
import { forwardRef, useEffect } from 'react';

const LoadCameraControls = forwardRef(function LoadCameraControls(prop, ref) {
    useEffect(() => {
        window.cameraControls = ref.current;
    }, []);

    return (
        <CameraControls
            minDistance={0.01}
            maxDistance={100}
            minPolarAngle={-Math.PI / 2}
            maxPolarAngle={Math.PI / 2}
            ref={ref}
        />
    );
});

export default LoadCameraControls;
