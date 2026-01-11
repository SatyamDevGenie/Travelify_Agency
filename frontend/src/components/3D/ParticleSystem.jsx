import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Floating Particles Component
const FloatingParticles = ({ count = 200, color = "#fbbf24" }) => {
    const pointsRef = useRef();
    
    const { positions, velocities } = useMemo(() => {
        const positions = new Float32Array(count * 3);
        const velocities = new Float32Array(count * 3);
        
        for (let i = 0; i < count; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 20;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
            
            velocities[i * 3] = (Math.random() - 0.5) * 0.02;
            velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.02;
            velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02;
        }
        
        return { positions, velocities };
    }, [count]);

    useFrame(() => {
        if (pointsRef.current) {
            const positions = pointsRef.current.geometry.attributes.position.array;
            
            for (let i = 0; i < count; i++) {
                positions[i * 3] += velocities[i * 3];
                positions[i * 3 + 1] += velocities[i * 3 + 1];
                positions[i * 3 + 2] += velocities[i * 3 + 2];
                
                // Wrap around boundaries
                if (Math.abs(positions[i * 3]) > 10) velocities[i * 3] *= -1;
                if (Math.abs(positions[i * 3 + 1]) > 10) velocities[i * 3 + 1] *= -1;
                if (Math.abs(positions[i * 3 + 2]) > 10) velocities[i * 3 + 2] *= -1;
            }
            
            pointsRef.current.geometry.attributes.position.needsUpdate = true;
        }
    });

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={count}
                    array={positions}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.1}
                color={color}
                transparent
                opacity={0.6}
                sizeAttenuation
                blending={THREE.AdditiveBlending}
            />
        </points>
    );
};

// Travel-themed particles (planes, hearts, stars)
const TravelParticles = ({ count = 50 }) => {
    const groupRef = useRef();
    
    const particles = useMemo(() => {
        const temp = [];
        for (let i = 0; i < count; i++) {
            temp.push({
                position: [
                    (Math.random() - 0.5) * 30,
                    (Math.random() - 0.5) * 20,
                    (Math.random() - 0.5) * 30
                ],
                rotation: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI],
                speed: Math.random() * 0.02 + 0.01,
                type: Math.floor(Math.random() * 3) // 0: plane, 1: heart, 2: star
            });
        }
        return temp;
    }, [count]);

    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.children.forEach((child, index) => {
                const particle = particles[index];
                child.rotation.x += particle.speed;
                child.rotation.y += particle.speed * 0.5;
                child.position.y += Math.sin(state.clock.elapsedTime + index) * 0.01;
            });
        }
    });

    return (
        <group ref={groupRef}>
            {particles.map((particle, index) => (
                <mesh
                    key={index}
                    position={particle.position}
                    rotation={particle.rotation}
                    scale={0.3}
                >
                    {particle.type === 0 && (
                        <>
                            <boxGeometry args={[0.5, 0.1, 0.1]} />
                            <meshStandardMaterial color="#3b82f6" />
                        </>
                    )}
                    {particle.type === 1 && (
                        <>
                            <sphereGeometry args={[0.1, 8, 8]} />
                            <meshStandardMaterial color="#ef4444" />
                        </>
                    )}
                    {particle.type === 2 && (
                        <>
                            <coneGeometry args={[0.1, 0.3, 5]} />
                            <meshStandardMaterial color="#fbbf24" />
                        </>
                    )}
                </mesh>
            ))}
        </group>
    );
};

// Main Particle System Component
const ParticleSystem = ({ 
    className = "",
    type = "floating", // "floating", "travel", "both"
    particleCount = 200,
    color = "#fbbf24"
}) => {
    return (
        <div className={`w-full h-full ${className}`}>
            <Canvas
                camera={{ position: [0, 0, 10], fov: 75 }}
                style={{ background: 'transparent' }}
            >
                <ambientLight intensity={0.2} />
                
                {(type === "floating" || type === "both") && (
                    <FloatingParticles count={particleCount} color={color} />
                )}
                
                {(type === "travel" || type === "both") && (
                    <TravelParticles count={Math.floor(particleCount / 4)} />
                )}
            </Canvas>
        </div>
    );
};

export default ParticleSystem;