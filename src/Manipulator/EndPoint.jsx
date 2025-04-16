import { useRef } from 'react';
import * as THREE from 'three';

export default function EndPoint({
    position,
    name,
    color = 'red',
    size = 0.003,
}) {
    const meshRef = useRef();

    return (
        <mesh position={position} name={name} ref={meshRef} renderOrder={1000}>
            <sphereGeometry args={[size, 16, 16]} />
            <meshStandardMaterial color={color} />
        </mesh>
    );
}
