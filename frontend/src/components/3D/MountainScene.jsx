import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Cone, Sphere, Box, Cloud, Sky, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// Single Mountain Component
const Mountain = ({ position, height = 3, color = "#6b7280" }) => {
    const mountainRef = useRef();

    useFrame((state) => {
        if (mountainRef.current) {
            mountainRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.05;
        }
    });

    return (
        <group ref={mountainRef} position={position}>
            {/* Mountain base */}
            <Cone args={[2, height, 8]} position={[0, height / 2, 0]}>
                <meshStandardMaterial color={color} roughness={0.9} />
            </Cone>
            
            {/* Snow cap */}
            <Cone args={[0.8, height * 0.3, 8]} position={[0, height * 0.85, 0]}>
                <meshStandardMaterial color="#ffffff" roughness={0.3} />
            </Cone>
            
            {/* Trees around base */}
            {[...Array(6)].map((_, i) => {
                const angle = (i / 6) * Math.PI * 2;
                const radius = 2.5;
                const x = Math.cos(angle) * radius;
                const z = Math.sin(angle) * radius;
                
                return (
                    <group key={i} position={[x, 0, z]}>
                        {/* Tree trunk */}
                        <Box args={[0.1, 0.8, 0.1]} position={[0, 0.4, 0]}>
                            <meshStandardMaterial color="#92400e" />
                        </Box>
                        {/* Tree leaves */}
                        <Cone args={[0.3, 1, 6]} position={[0, 1.2, 0]}>
                            <meshStandardMaterial color="#16a34a" />
                        </Cone>
                    </group>
                );
            })}
        </group>
    );
};

// Animated Sun
const AnimatedSun = () => {
    const sunRef = useRef();

    useFrame((state) => {
        if (sunRef.current) {
            const time = state.clock.elapsedTime * 0.1;
            sunRef.current.position.x = Math.cos(time) * 8;
            sunRef.current.position.y = 6 + Math.sin(time) * 2;
            sunRef.current.position.z = Math.sin(time) * 3;
        }
    });

    return (
        <group ref={sunRef}>
            <Sphere args={[0.5, 16, 16]}>
                <meshBasicMaterial color="#fbbf24" />
            </Sphere>
            <pointLight intensity={1} color="#fbbf24" />
        </group>
    );
};

// Flying Birds
const FlyingBirds = () => {
    const birdsRef = useRef();

    const birds = useMemo(() => {
        return [...Array(8)].map((_, i) => ({
            offset: i * 0.5,
            speed: 0.3 + Math.random() * 0.2,
            radius: 6 + Math.random() * 2,
            height: 4 + Math.random() * 2
        }));
    }, []);

    useFrame((state) => {
        if (birdsRef.current) {
            birdsRef.current.children.forEach((bird, index) => {
                const birdData = birds[index];
                const time = state.clock.elapsedTime * birdData.speed + birdData.offset;
                
                bird.position.x = Math.cos(time) * birdData.radius;
                bird.position.z = Math.sin(time) * birdData.radius;
                bird.position.y = birdData.height + Math.sin(time * 2) * 0.5;
                
                bird.rotation.y = time + Math.PI / 2;
            });
        }
    });

    return (
        <group ref={birdsRef}>
            {birds.map((_, index) => (
                <group key={index}>
                    {/* Simple bird shape */}
                    <Box args={[0.2, 0.05, 0.05]}>
                        <meshStandardMaterial color="#374151" />
                    </Box>
                    <Box args={[0.05, 0.05, 0.3]} position={[0, 0, 0]}>
                        <meshStandardMaterial color="#374151" />
                    </Box>
                </group>
            ))}
        </group>
    );
};

// Terrain with grass
const Terrain = () => {
    const terrainRef = useRef();

    useFrame((state) => {
        if (terrainRef.current && terrainRef.current.material.uniforms) {
            terrainRef.current.material.uniforms.time.value = state.clock.elapsedTime;
        }
    });

    const terrainMaterial = useMemo(() => {
        return new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                grassColor: { value: new THREE.Color('#22c55e') },
                dirtColor: { value: new THREE.Color('#92400e') }
            },
            vertexShader: `
                uniform float time;
                varying vec2 vUv;
                varying float vElevation;
                
                void main() {
                    vUv = uv;
                    
                    vec3 pos = position;
                    float elevation = sin(pos.x * 0.3) * sin(pos.z * 0.3) * 0.5;
                    pos.y += elevation;
                    
                    vElevation = elevation;
                    
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                }
            `,
            fragmentShader: `
                uniform vec3 grassColor;
                uniform vec3 dirtColor;
                varying vec2 vUv;
                varying float vElevation;
                
                void main() {
                    vec3 color = mix(dirtColor, grassColor, vElevation + 0.5);
                    gl_FragColor = vec4(color, 1.0);
                }
            `
        });
    }, []);

    return (
        <mesh ref={terrainRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
            <planeGeometry args={[30, 30, 64, 64]} />
            <primitive object={terrainMaterial} />
        </mesh>
    );
};

// Main Mountain Scene Component
const MountainScene = ({ 
    className = "",
    showSky = true,
    showBirds = true,
    enableControls = false,
    cameraPosition = [10, 8, 10]
}) => {
    const mountains = useMemo(() => [
        { position: [-4, 0, -3], height: 4, color: "#6b7280" },
        { position: [2, 0, -5], height: 5, color: "#4b5563" },
        { position: [6, 0, -2], height: 3.5, color: "#6b7280" },
        { position: [-2, 0, -8], height: 6, color: "#374151" },
        { position: [0, 0, 2], height: 2.5, color: "#9ca3af" }
    ], []);

    return (
        <div className={`w-full h-full ${className}`}>
            <Canvas
                camera={{ position: cameraPosition, fov: 60 }}
                style={{ background: 'linear-gradient(to bottom, #87ceeb 0%, #98d8e8 50%, #b8e6b8 100%)' }}
            >
                {showSky && <Sky sunPosition={[100, 20, 100]} />}
                
                <ambientLight intensity={0.4} />
                <directionalLight
                    position={[10, 10, 5]}
                    intensity={1}
                    castShadow
                />

                <AnimatedSun />
                
                {mountains.map((mountain, index) => (
                    <Mountain
                        key={index}
                        position={mountain.position}
                        height={mountain.height}
                        color={mountain.color}
                    />
                ))}

                <Terrain />

                {showBirds && <FlyingBirds />}

                {/* Clouds */}
                <Cloud position={[-8, 6, -5]} speed={0.1} opacity={0.4} />
                <Cloud position={[8, 7, -3]} speed={0.15} opacity={0.3} />
                <Cloud position={[0, 8, -8]} speed={0.12} opacity={0.35} />

                {enableControls && (
                    <OrbitControls
                        enableZoom={true}
                        enablePan={true}
                        enableRotate={true}
                        autoRotate={false}
                        minDistance={5}
                        maxDistance={25}
                        dampingFactor={0.05}
                        enableDamping={true}
                        maxPolarAngle={Math.PI / 2}
                    />
                )}

                <fog attach="fog" args={['#87ceeb', 10, 30]} />
            </Canvas>
        </div>
    );
};

export default MountainScene;