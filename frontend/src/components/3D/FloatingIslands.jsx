import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Box, Cylinder, MeshWobbleMaterial, Float, Cloud, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// Single Island Component
const Island = ({ position, scale = 1, color = "#22c55e" }) => {
    const islandRef = useRef();
    const treeRefs = useRef([]);

    useFrame((state) => {
        if (islandRef.current) {
            islandRef.current.rotation.y += 0.002;
            islandRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.1;
        }
        
        // Animate trees
        treeRefs.current.forEach((tree, index) => {
            if (tree) {
                tree.rotation.z = Math.sin(state.clock.elapsedTime * 2 + index) * 0.1;
            }
        });
    });

    return (
        <Float speed={1} rotationIntensity={0.5} floatIntensity={0.5}>
            <group ref={islandRef} position={position} scale={scale}>
                {/* Island base */}
                <Sphere args={[1, 16, 16]} position={[0, 0, 0]}>
                    <MeshWobbleMaterial
                        color={color}
                        factor={0.1}
                        speed={2}
                        roughness={0.8}
                    />
                </Sphere>

                {/* Underwater part */}
                <Cylinder args={[0.8, 0.3, 1.5]} position={[0, -1.2, 0]}>
                    <meshStandardMaterial color="#8b5cf6" roughness={0.9} />
                </Cylinder>

                {/* Trees */}
                {[...Array(3)].map((_, i) => {
                    const angle = (i / 3) * Math.PI * 2;
                    const radius = 0.6;
                    const x = Math.cos(angle) * radius;
                    const z = Math.sin(angle) * radius;
                    
                    return (
                        <group
                            key={i}
                            ref={(el) => (treeRefs.current[i] = el)}
                            position={[x, 0.5, z]}
                        >
                            {/* Tree trunk */}
                            <Cylinder args={[0.05, 0.08, 0.6]} position={[0, 0.3, 0]}>
                                <meshStandardMaterial color="#92400e" />
                            </Cylinder>
                            {/* Tree leaves */}
                            <Sphere args={[0.2, 8, 8]} position={[0, 0.8, 0]}>
                                <meshStandardMaterial color="#16a34a" />
                            </Sphere>
                        </group>
                    );
                })}

                {/* Beach */}
                <Cylinder args={[1.1, 1.1, 0.1]} position={[0, -0.05, 0]}>
                    <meshStandardMaterial color="#fbbf24" roughness={0.9} />
                </Cylinder>

                {/* Water around island */}
                <Cylinder args={[2, 2, 0.05]} position={[0, -0.5, 0]}>
                    <meshStandardMaterial
                        color="#0ea5e9"
                        transparent
                        opacity={0.7}
                        roughness={0.1}
                        metalness={0.1}
                    />
                </Cylinder>
            </group>
        </Float>
    );
};

// Multiple Islands Scene
const IslandsScene = () => {
    const islands = useMemo(() => [
        { position: [-3, 0, -2], scale: 0.8, color: "#22c55e" },
        { position: [2, 1, -1], scale: 1.2, color: "#16a34a" },
        { position: [0, -0.5, 2], scale: 0.6, color: "#15803d" },
        { position: [-1, 0.8, 1], scale: 0.9, color: "#166534" },
        { position: [3, -0.3, 0.5], scale: 0.7, color: "#14532d" },
    ], []);

    return (
        <group>
            {islands.map((island, index) => (
                <Island
                    key={index}
                    position={island.position}
                    scale={island.scale}
                    color={island.color}
                />
            ))}
            
            {/* Floating clouds */}
            <Cloud
                position={[-4, 3, -3]}
                speed={0.2}
                opacity={0.4}
                color="#ffffff"
            />
            <Cloud
                position={[4, 2.5, -2]}
                speed={0.3}
                opacity={0.3}
                color="#f8fafc"
            />
            <Cloud
                position={[0, 4, 1]}
                speed={0.25}
                opacity={0.35}
                color="#ffffff"
            />
        </group>
    );
};

// Animated water surface
const WaterSurface = () => {
    const waterRef = useRef();

    useFrame((state) => {
        if (waterRef.current) {
            waterRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
            waterRef.current.material.uniforms.time.value = state.clock.elapsedTime;
        }
    });

    const waterMaterial = useMemo(() => {
        return new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                color: { value: new THREE.Color('#0ea5e9') }
            },
            vertexShader: `
                uniform float time;
                varying vec2 vUv;
                varying vec3 vPosition;
                
                void main() {
                    vUv = uv;
                    vPosition = position;
                    
                    vec3 pos = position;
                    pos.z += sin(pos.x * 2.0 + time) * 0.1;
                    pos.z += sin(pos.y * 1.5 + time * 1.2) * 0.1;
                    
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                }
            `,
            fragmentShader: `
                uniform float time;
                uniform vec3 color;
                varying vec2 vUv;
                varying vec3 vPosition;
                
                void main() {
                    float wave = sin(vPosition.x * 3.0 + time) * 0.5 + 0.5;
                    vec3 finalColor = mix(color, vec3(1.0), wave * 0.2);
                    
                    gl_FragColor = vec4(finalColor, 0.8);
                }
            `,
            transparent: true,
        });
    }, []);

    return (
        <mesh ref={waterRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
            <planeGeometry args={[20, 20, 32, 32]} />
            <primitive object={waterMaterial} />
        </mesh>
    );
};

// Main FloatingIslands Component
const FloatingIslands = ({ 
    className = "",
    showWater = true,
    enableControls = false,
    cameraPosition = [8, 6, 8]
}) => {
    return (
        <div className={`w-full h-full ${className}`}>
            <Canvas
                camera={{ position: cameraPosition, fov: 60 }}
                style={{ background: 'linear-gradient(to bottom, #87ceeb 0%, #98d8e8 100%)' }}
            >
                <ambientLight intensity={0.4} />
                <directionalLight
                    position={[10, 10, 5]}
                    intensity={1}
                    castShadow
                    shadow-mapSize-width={2048}
                    shadow-mapSize-height={2048}
                />
                <pointLight position={[-10, 5, -5]} intensity={0.3} color="#fbbf24" />

                <IslandsScene />
                
                {showWater && <WaterSurface />}

                {enableControls && (
                    <OrbitControls
                        enableZoom={true}
                        enablePan={true}
                        enableRotate={true}
                        autoRotate={false}
                        minDistance={3}
                        maxDistance={20}
                        dampingFactor={0.05}
                        enableDamping={true}
                        maxPolarAngle={Math.PI / 2}
                    />
                )}

                {/* Fog for depth */}
                <fog attach="fog" args={['#87ceeb', 5, 20]} />
            </Canvas>
        </div>
    );
};

export default FloatingIslands;