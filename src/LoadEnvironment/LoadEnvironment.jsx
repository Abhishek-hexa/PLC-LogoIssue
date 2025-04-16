import { Environment } from '@react-three/drei';
const LoadEnvironment = () => {
    return (
        <>
            <Environment
                far={100}
                files={
                    '/assets/texture/photo_studio_1K_4daadb58-48b5-4c79-b1aa-f48b74c2a280.exr'
                }
            />
            <spotLight castShadow intensity={2} position={[10, 8, 4]} />
            <directionalLight castShadow position={[0, 1, 0]} intensity={1.5} />
        </>
    );
};

export default LoadEnvironment;
