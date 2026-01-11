import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Cylinder, Box, Plane, Text, Float, Cloud } from '@react-three/drei';
import * as THREE from 'three';

// Animated Ocean Waves
const OceanWaves = () => {
    const oceanRef = useRef();
    
    const oceanMaterial = useMemo(() => {
        return new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                color1: { value: new THREE.Color('#0ea5e9') },
                color2: { value: new THREE.Color('#0284c7') },
                waveHeight: { value: 0.3 }
            },
            vertexShader: `
                uniform float time;
                uniform float waveHeight;
                varying vec2 vUv;
                varying float vWave;
                
                void main() {
                    vUv = uv;
                    
                    vec3 pos = position;
                    float wave1 = sin(pos.x * 2.0 + time * 2.0) * waveHeight;
                    float wave2 = sin(pos.z * 1.5 + time * 1.5) * waveHeight * 0.5;
                    float wave3 = sin((pos.x + pos.z) * 1.0 + time * 3.0) * waveHeight * 0.3;
                    
                    pos.y += wave1 + wave2 + wave3;
                    vWave = wave1 + wave2 + wave3;
                    
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                }
            `,
            fragmentShader: `
                uniform vec3 color1;
                uniform vec3 color2;
                varying vec2 vUv;
                varying float vWave;
                
                void main() {
                    vec3 color = mix(color1, color2, vWave + 0.5);
                    float foam = step(0.2, vWave);
                    color = mix(color, vec3(1.0), foam * 0.3);
                    
                    gl_FragColor = vec4(color, 0.9);
                }
            `,
            transparent: true,
            side: THREE.DoubleSide
        });
    }, []);

    useFrame((state) => {
        if (oceanRef.current) {
            oceanRef.current.material.uniforms.time.value = state.clock.elapsedTime;
        }
    });

    return (
        <mesh ref={oceanRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
            <planeGeometry args={[30, 30, 64, 64]} />
            <primitive object={oceanMaterial} />
        </mesh>
    );
};

// Tropical Palm Trees
const PalmTree = ({ position, scale = 1 }) => {
    const palmRef = useRef();
    const leavesRefs = useRef([]);

    useFrame((state) => {
        if (palmRef.current) {
            palmRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
        }
        leavesRefs.current.forEach((leaf, index) => {
            if (leaf) {
                leaf.rotation.z = Math.sin(state.clock.elapsedTime * 0.8 + index) * 0.2;
            }
        });
    });

    return (
        <group position={position} scale={scale}>
            {/* Palm trunk */}
            <group ref={palmRef}>
                <Cylinder args={[0.15, 0.2, 4]} position={[0, 2, 0]}>
                    <meshStandardMaterial color="#8b4513" roughness={0.8} />
                </Cylinder>
                
                {/* Palm leaves */}
                {[...Array(8)].map((_, i) => {
                    const angle = (i / 8) * Math.PI * 2;
                    return (
                        <group
                            key={i}
                            ref={(el) => (leavesRefs.current[i] = el)}
                            position={[0, 4, 0]}
                            rotation={[0, angle, Math.PI / 6]}
                        >
                            <Box args={[0.1, 2, 0.05]} position={[0, 1, 0]}>
                                <meshStandardMaterial color="#228b22" />
                            </Box>
                        </group>
                    );
                })}
            </group>
            
            {/* Coconuts */}
            {[...Array(3)].map((_, i) => (
                <Sphere
                    key={i}
                    args={[0.15, 8, 8]}
                    position={[
                        Math.cos(i * 2) * 0.3,
                        3.5 + Math.sin(i) * 0.2,
                        Math.sin(i * 2) * 0.3
                    ]}
                >
                    <meshStandardMaterial color="#8b4513" />
                </Sphere>
            ))}
        </group>
    );
};

// Beach Umbrella
const BeachUmbrella = ({ position, color = "#ff6b6b" }) => {
    const umbrellaRef = useRef();

    useFrame((state) => {
        if (umbrellaRef.current) {
            umbrellaRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
        }
    });

    return (
        <group ref={umbrellaRef} position={position}>
            {/* Umbrella pole */}
            <Cylinder args={[0.05, 0.05, 3]} position={[0, 1.5, 0]}>
                <meshStandardMaterial color="#8b4513" />
            </Cylinder>
            
            {/* Umbrella top */}
            <Sphere args={[1.5, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2]} position={[0, 3, 0]}>
                <meshStandardMaterial color={color} />
            </Sphere>
            
            {/* Beach chair */}
            <Box args={[0.8, 0.1, 1.2]} position={[1, 0.3, 0]}>
                <meshStandardMaterial color="#4169e1" />
            </Box>
            <Box args={[0.8, 1, 0.1]} position={[1, 0.8, -0.5]}>
                <meshStandardMaterial color="#4169e1" />
            </Box>
        </group>
    );
};

// Flying Seagulls
const Seagulls = () => {
    const seagullsRef = useRef();

    const seagulls = useMemo(() => {
        return [...Array(6)].map((_, i) => ({
            offset: i * 1.2,
            speed: 0.4 + Math.random() * 0.3,
            radius: 8 + Math.random() * 4,
            height: 5 + Math.random() * 3
        }));
    }, []);

    useFrame((state) => {
        if (seagullsRef.current) {
            seagullsRef.current.children.forEach((seagull, index) => {
                const data = seagulls[index];
                const time = state.clock.elapsedTime * data.speed + data.offset;
                
                seagull.position.x = Math.cos(time) * data.radius;
                seagull.position.z = Math.sin(time) * data.radius;
                seagull.position.y = data.height + Math.sin(time * 3) * 0.5;
                
                seagull.rotation.y = time + Math.PI / 2;
                seagull.rotation.z = Math.sin(time * 4) * 0.2;
            });
        }
    });

    return (
        <group ref={seagullsRef}>
            {seagulls.map((_, index) => (
                <group key={index} scale={0.3}>
                    {/* Seagull body */}
                    <Sphere args={[0.3, 8, 8]} position={[0, 0, 0]}>
                        <meshStandardMaterial color="#ffffff" />
                    </Sphere>
                    {/* Wings */}
                    <Box args={[1.5, 0.1, 0.3]} position={[0, 0, 0]}>
                        <meshStandardMaterial color="#f0f0f0" />
                    </Box>
                    {/* Beak */}
                    <Box args={[0.2, 0.1, 0.1]} position={[0.3, 0.1, 0]}>
                        <meshStandardMaterial color="#ffa500" />
                    </Box>
                </group>
            ))}
        </group>
    );
};

// Sailing Boat
const SailingBoat = () => {
    const boatRef = useRef();

    useFrame((state) => {
        if (boatRef.current) {
            const time = state.clock.elapsedTime * 0.2;
            boatRef.current.position.x = Math.cos(time) * 12;
            boatRef.current.position.z = Math.sin(time) * 8;
            boatRef.current.position.y = -0.3 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
            boatRef.current.rotation.y = time + Math.PI / 2;
            boatRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 1.5) * 0.1;
        }
    });

    return (
        <group ref={boatRef} scale={0.5}>
            {/* Boat hull */}
            <Box args={[3, 0.5, 1]} position={[0, 0, 0]}>
                <meshStandardMaterial color="#8b4513" />
            </Box>
            
            {/* Mast */}
            <Cylinder args={[0.05, 0.05, 4]} position={[0, 2, 0]}>
                <meshStandardMaterial color="#654321" />
            </Cylinder>
            
            {/* Sail */}
            <Plane args={[2, 3]} position={[0.8, 2, 0]} rotation={[0, -0.3, 0]}>
                <meshStandardMaterial color="#ffffff" side={THREE.DoubleSide} />
            </Plane>
        </group>
    );
};

// Beach Paradise Main Component
const BeachParadise = ({ 
    className = "",
    showText = true,
    cameraPosition = [12, 8, 12]
}) => {
    return (
        <div className={`w-full h-full ${className}`}>
            <Canvas
                camera={{ position: cameraPosition, fov: 60 }}
                style={{ 
                    background: 'linear-gradient(to bottom, #87ceeb 0%, #98d8e8 50%, #b0e0e6 100%)' 
                }}
            >
                <ambientLight intensity={0.6} />
                <directionalLight
                    position={[10, 10, 5]}
                    intensity={1.2}
                    color="#ffd700"
                    castShadow
                />
                <pointLight position={[-10, 5, -5]} intensity={0.4} color="#ff6b6b" />

                <OceanWaves />

                {/* Beach sand */}
                <Plane 
                    args={[20, 10]} 
                    rotation={[-Math.PI / 2, 0, 0]} 
                    position={[0, -0.45, 5]}
                >
                    <meshStandardMaterial color="#f4a460" roughness={0.9} />
                </Plane>

                {/* Palm trees */}
                <PalmTree position={[-6, 0, 3]} scale={1.2} />
                <PalmTree position={[-3, 0, 4]} scale={0.9} />
                <PalmTree position={[4, 0, 2]} scale={1.1} />
                <PalmTree position={[7, 0, 4]} scale={0.8} />

                {/* Beach umbrellas */}
                <BeachUmbrella position={[-2, 0, 6]} color="#ff6b6b" />
                <BeachUmbrella position={[2, 0, 7]} color="#4169e1" />
                <BeachUmbrella position={[6, 0, 6]} color="#32cd32" />

                <Seagulls />
                <SailingBoat />

                {/* Floating text */}
                {showText && (
                    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                        <Text
                            position={[0, 6, 0]}
                            fontSize={1.5}
                            color="#ffffff"
                            anchorX="center"
                            anchorY="middle"
                            font="/fonts/Inter-Bold.woff"
                        >
                            Paradise Awaits
                        </Text>
                    </Float>
                )}

                {/* Clouds */}
                <Cloud position={[-10, 8, -5]} speed={0.1} opacity={0.6} />
                <Cloud position={[10, 9, -3]} speed={0.15} opacity={0.5} />
                <Cloud position={[0, 10, -8]} speed={0.12} opacity={0.7} />

                <fog attach="fog" args={['#87ceeb', 15, 35]} />
            </Canvas>
        </div>
    );
};

export default BeachParadise;