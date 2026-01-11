import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Box, Cylinder, Cone } from '@react-three/drei';
import * as THREE from 'three';

// Airplane Model Component
const AirplaneModel = ({ position = [0, 0, 0], scale = 1 }) => {
    const groupRef = useRef();
    const propellerRef = useRef();

    useFrame((state) => {
        if (groupRef.current) {
            // Gentle floating animation
            groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
            groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
        }
        if (propellerRef.current) {
            // Fast spinning propeller
            propellerRef.current.rotation.z += 0.5;
        }
    });

    return (
        <group ref={groupRef} position={position} scale={scale}>
            {/* Fuselage (main body) */}
            <Cylinder args={[0.15, 0.25, 3]} rotation={[0, 0, Math.PI / 2]} position={[0, 0, 0]}>
                <meshStandardMaterial color="#e5e7eb" metalness={0.8} roughness={0.2} />
            </Cylinder>

            {/* Nose */}
            <Cone args={[0.15, 0.8]} rotation={[0, 0, -Math.PI / 2]} position={[1.9, 0, 0]}>
                <meshStandardMaterial color="#dc2626" metalness={0.6} roughness={0.3} />
            </Cone>

            {/* Wings */}
            <Box args={[0.3, 4, 0.1]} position={[-0.5, 0, 0]}>
                <meshStandardMaterial color="#3b82f6" metalness={0.7} roughness={0.2} />
            </Box>

            {/* Tail */}
            <Box args={[0.1, 1.5, 0.8]} position={[-1.3, 0, 0.3]}>
                <meshStandardMaterial color="#3b82f6" metalness={0.7} roughness={0.2} />
            </Box>

            {/* Horizontal stabilizer */}
            <Box args={[0.1, 2, 0.1]} position={[-1.3, 0, 0]}>
                <meshStandardMaterial color="#3b82f6" metalness={0.7} roughness={0.2} />
            </Box>

            {/* Propeller */}
            <group ref={propellerRef} position={[2.3, 0, 0]}>
                <Box args={[0.05, 1.5, 0.05]}>
                    <meshStandardMaterial color="#374151" metalness={0.9} roughness={0.1} />
                </Box>
                <Box args={[0.05, 0.05, 1.5]}>
                    <meshStandardMaterial color="#374151" metalness={0.9} roughness={0.1} />
                </Box>
            </group>

            {/* Landing gear */}
            <Cylinder args={[0.05, 0.05, 0.5]} position={[0.5, -0.4, 0]}>
                <meshStandardMaterial color="#1f2937" />
            </Cylinder>
            <Cylinder args={[0.05, 0.05, 0.5]} position={[-0.5, -0.4, 0]}>
                <meshStandardMaterial color="#1f2937" />
            </Cylinder>
        </group>
    );
};

// Flying Path Animation
const FlyingAirplane = () => {
    const airplaneRef = useRef();

    useFrame((state) => {
        if (airplaneRef.current) {
            const time = state.clock.elapsedTime * 0.3;
            const radius = 4;
            
            airplaneRef.current.position.x = Math.cos(time) * radius;
            airplaneRef.current.position.z = Math.sin(time) * radius;
            airplaneRef.current.position.y = Math.sin(time * 2) * 0.5;
            
            // Make airplane face the direction it's moving
            airplaneRef.current.rotation.y = time + Math.PI / 2;
            airplaneRef.current.rotation.z = Math.sin(time * 2) * 0.2;
        }
    });

    return (
        <group ref={airplaneRef}>
            <AirplaneModel scale={0.3} />
        </group>
    );
};

// Main Airplane3D Component
const Airplane3D = ({ 
    className = "", 
    showPath = true, 
    interactive = true,
    cameraPosition = [8, 4, 8] 
}) => {
    return (
        <div className={`w-full h-full ${className}`}>
            <Canvas
                camera={{ position: cameraPosition, fov: 50 }}
                style={{ background: 'transparent' }}
            >
                <ambientLight intensity={0.4} />
                <directionalLight 
                    position={[10, 10, 5]} 
                    intensity={1} 
                    castShadow
                    shadow-mapSize-width={2048}
                    shadow-mapSize-height={2048}
                />
                <pointLight position={[-10, -10, -5]} intensity={0.3} color="#fbbf24" />

                {showPath ? <FlyingAirplane /> : <AirplaneModel />}

                {/* Cloud-like particles */}
                <group>
                    {[...Array(20)].map((_, i) => (
                        <mesh
                            key={i}
                            position={[
                                (Math.random() - 0.5) * 20,
                                (Math.random() - 0.5) * 10,
                                (Math.random() - 0.5) * 20
                            ]}
                        >
                            <sphereGeometry args={[0.5 + Math.random() * 0.5, 8, 8]} />
                            <meshBasicMaterial 
                                color="white" 
                                transparent 
                                opacity={0.3} 
                            />
                        </mesh>
                    ))}
                </group>

                {interactive && (
                    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
                        <planeGeometry args={[20, 20]} />
                        <meshStandardMaterial 
                            color="#e0f2fe" 
                            transparent 
                            opacity={0.1} 
                        />
                    </mesh>
                )}
            </Canvas>
        </div>
    );
};

export default Airplane3D;