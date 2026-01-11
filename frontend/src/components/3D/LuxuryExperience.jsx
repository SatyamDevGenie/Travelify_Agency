import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Box, Cylinder, Cone, Text, Float, Html, Trail, Sparkles, Cloud, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// Luxury Yacht
const LuxuryYacht = ({ position }) => {
    const yachtRef = useRef();

    useFrame((state) => {
        if (yachtRef.current) {
            const time = state.clock.elapsedTime * 0.1;
            yachtRef.current.position.x = position[0] + Math.cos(time) * 8;
            yachtRef.current.position.z = position[2] + Math.sin(time) * 6;
            yachtRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.1;
            yachtRef.current.rotation.y = time + Math.PI / 2;
            yachtRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 1.5) * 0.05;
        }
    });

    return (
        <group ref={yachtRef} scale={1.5}>
            {/* Yacht hull */}
            <Box args={[4, 0.8, 1.5]} position={[0, 0, 0]}>
                <meshStandardMaterial color="#ffffff" metalness={0.8} roughness={0.1} />
            </Box>
            
            {/* Upper deck */}
            <Box args={[3, 0.3, 1.2]} position={[0, 0.6, 0]}>
                <meshStandardMaterial color="#f8f9fa" metalness={0.6} roughness={0.2} />
            </Box>
            
            {/* Bridge */}
            <Box args={[1.5, 0.8, 1]} position={[0.5, 1.2, 0]}>
                <meshStandardMaterial color="#e9ecef" metalness={0.4} roughness={0.3} />
            </Box>
            
            {/* Mast */}
            <Cylinder args={[0.05, 0.05, 3]} position={[-0.5, 2, 0]}>
                <meshStandardMaterial color="#6c757d" metalness={0.9} roughness={0.1} />
            </Cylinder>
            
            {/* Luxury amenities */}
            <Sphere args={[0.2, 16, 16]} position={[-1.5, 0.9, 0]}>
                <meshStandardMaterial color="#007bff" emissive="#007bff" emissiveIntensity={0.3} />
            </Sphere>
            
            {/* Wake trail */}
            <Trail
                width={1}
                length={20}
                color="#ffffff"
                attenuation={(t) => t * t}
            >
                <Box args={[0.1, 0.1, 0.1]} position={[-2, -0.3, 0]}>
                    <meshBasicMaterial transparent opacity={0} />
                </Box>
            </Trail>
        </group>
    );
};

// Private Jet
const PrivateJet = ({ position }) => {
    const jetRef = useRef();

    useFrame((state) => {
        if (jetRef.current) {
            const time = state.clock.elapsedTime * 0.2;
            jetRef.current.position.x = Math.cos(time) * 15;
            jetRef.current.position.z = Math.sin(time) * 12;
            jetRef.current.position.y = 8 + Math.sin(time * 2) * 2;
            jetRef.current.rotation.y = time + Math.PI / 2;
        }
    });

    return (
        <Trail
            width={3}
            length={15}
            color="#4fc3f7"
            attenuation={(t) => t * t}
        >
            <group ref={jetRef} scale={0.8}>
                {/* Fuselage */}
                <Cylinder args={[0.3, 0.4, 5]} rotation={[0, 0, Math.PI / 2]}>
                    <meshStandardMaterial color="#ffffff" metalness={0.9} roughness={0.1} />
                </Cylinder>
                
                {/* Nose */}
                <Cone args={[0.3, 1.5]} rotation={[0, 0, -Math.PI / 2]} position={[3.25, 0, 0]}>
                    <meshStandardMaterial color="#e3f2fd" metalness={0.8} roughness={0.2} />
                </Cone>
                
                {/* Wings */}
                <Box args={[0.4, 6, 0.2]} position={[-0.5, 0, 0]}>
                    <meshStandardMaterial color="#bbdefb" metalness={0.7} roughness={0.2} />
                </Box>
                
                {/* Tail */}
                <Box args={[0.2, 2, 1.5]} position={[-2, 0, 0.5]}>
                    <meshStandardMaterial color="#90caf9" metalness={0.7} roughness={0.2} />
                </Box>
                
                {/* Engines */}
                <Cylinder args={[0.15, 0.2, 1]} position={[1, 2, 0]} rotation={[0, 0, Math.PI / 2]}>
                    <meshStandardMaterial color="#64b5f6" metalness={0.8} roughness={0.1} />
                </Cylinder>
                <Cylinder args={[0.15, 0.2, 1]} position={[1, -2, 0]} rotation={[0, 0, Math.PI / 2]}>
                    <meshStandardMaterial color="#64b5f6" metalness={0.8} roughness={0.1} />
                </Cylinder>
                
                {/* Luxury details */}
                <Sparkles
                    count={30}
                    scale={8}
                    size={2}
                    speed={0.4}
                    color="#ffd700"
                />
            </group>
        </Trail>
    );
};

// Luxury Resort
const LuxuryResort = ({ position }) => {
    const resortRef = useRef();

    useFrame((state) => {
        if (resortRef.current) {
            resortRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.02;
        }
    });

    return (
        <group ref={resortRef} position={position}>
            {/* Main building */}
            <Box args={[6, 3, 4]} position={[0, 1.5, 0]}>
                <meshStandardMaterial color="#fff3e0" metalness={0.1} roughness={0.8} />
            </Box>
            
            {/* Roof */}
            <Cone args={[4, 1]} position={[0, 3.5, 0]}>
                <meshStandardMaterial color="#8d6e63" />
            </Cone>
            
            {/* Pool */}
            <Cylinder args={[2, 2, 0.2]} position={[0, 0.1, 6]}>
                <meshStandardMaterial 
                    color="#00bcd4" 
                    transparent 
                    opacity={0.8}
                    metalness={0.1}
                    roughness={0.1}
                />
            </Cylinder>
            
            {/* Palm trees */}
            {[...Array(6)].map((_, i) => {
                const angle = (i / 6) * Math.PI * 2;
                const radius = 8;
                const x = Math.cos(angle) * radius;
                const z = Math.sin(angle) * radius;
                
                return (
                    <group key={i} position={[x, 0, z]}>
                        {/* Trunk */}
                        <Cylinder args={[0.2, 0.3, 4]} position={[0, 2, 0]}>
                            <meshStandardMaterial color="#8d6e63" />
                        </Cylinder>
                        
                        {/* Leaves */}
                        {[...Array(8)].map((_, j) => {
                            const leafAngle = (j / 8) * Math.PI * 2;
                            return (
                                <Box
                                    key={j}
                                    args={[0.1, 2, 0.05]}
                                    position={[
                                        Math.cos(leafAngle) * 0.5,
                                        4.5,
                                        Math.sin(leafAngle) * 0.5
                                    ]}
                                    rotation={[0, leafAngle, Math.PI / 6]}
                                >
                                    <meshStandardMaterial color="#4caf50" />
                                </Box>
                            );
                        })}
                    </group>
                );
            })}
            
            {/* Luxury amenities markers */}
            <Float speed={2} rotationIntensity={0.5} floatIntensity={0.8}>
                <Sphere args={[0.1, 16, 16]} position={[2, 4, 2]}>
                    <meshBasicMaterial color="#ffd700" />
                </Sphere>
                <Html position={[2, 4.5, 2]} center>
                    <div className="bg-black/80 text-white px-2 py-1 rounded text-xs">
                        5★ Spa
                    </div>
                </Html>
            </Float>
            
            <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.6}>
                <Sphere args={[0.1, 16, 16]} position={[-2, 4, 2]}>
                    <meshBasicMaterial color="#ff4081" />
                </Sphere>
                <Html position={[-2, 4.5, 2]} center>
                    <div className="bg-black/80 text-white px-2 py-1 rounded text-xs">
                        Michelin Restaurant
                    </div>
                </Html>
            </Float>
        </group>
    );
};

// Floating Luxury Icons
const LuxuryIcons = () => {
    const iconsRef = useRef();

    const icons = useMemo(() => [
        { position: [-10, 8, -5], color: '#ffd700', type: 'crown' },
        { position: [10, 6, -8], color: '#ff6b6b', type: 'diamond' },
        { position: [0, 12, 5], color: '#4ecdc4', type: 'star' },
        { position: [-8, 4, 8], color: '#a8e6cf', type: 'gem' },
        { position: [12, 10, 2], color: '#ff8b94', type: 'luxury' }
    ], []);

    useFrame((state) => {
        if (iconsRef.current) {
            iconsRef.current.children.forEach((icon, index) => {
                icon.rotation.y += 0.02;
                icon.position.y = icons[index].position[1] + Math.sin(state.clock.elapsedTime + index) * 0.5;
            });
        }
    });

    return (
        <group ref={iconsRef}>
            {icons.map((icon, index) => (
                <Float key={index} speed={1 + index * 0.2} rotationIntensity={0.5} floatIntensity={1}>
                    <group position={icon.position}>
                        {icon.type === 'crown' && (
                            <Cone args={[0.3, 0.6]} position={[0, 0.3, 0]}>
                                <meshStandardMaterial 
                                    color={icon.color} 
                                    emissive={icon.color}
                                    emissiveIntensity={0.3}
                                    metalness={0.8}
                                    roughness={0.1}
                                />
                            </Cone>
                        )}
                        
                        {icon.type === 'diamond' && (
                            <Cone args={[0.2, 0.4]} rotation={[Math.PI, 0, 0]}>
                                <meshStandardMaterial 
                                    color={icon.color} 
                                    emissive={icon.color}
                                    emissiveIntensity={0.4}
                                    metalness={0.9}
                                    roughness={0.05}
                                />
                            </Cone>
                        )}
                        
                        {icon.type === 'star' && (
                            <Sphere args={[0.2, 5, 5]}>
                                <meshStandardMaterial 
                                    color={icon.color} 
                                    emissive={icon.color}
                                    emissiveIntensity={0.5}
                                />
                            </Sphere>
                        )}
                        
                        <Sparkles
                            count={20}
                            scale={2}
                            size={3}
                            speed={0.6}
                            color={icon.color}
                        />
                    </group>
                </Float>
            ))}
        </group>
    );
};

// Premium Water Surface
const PremiumWater = () => {
    const waterRef = useRef();

    const waterMaterial = useMemo(() => {
        return new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                color1: { value: new THREE.Color('#00bcd4') },
                color2: { value: new THREE.Color('#0097a7') },
                color3: { value: new THREE.Color('#ffffff') }
            },
            vertexShader: `
                uniform float time;
                varying vec2 vUv;
                varying float vWave;
                
                void main() {
                    vUv = uv;
                    
                    vec3 pos = position;
                    float wave1 = sin(pos.x * 1.5 + time * 2.0) * 0.2;
                    float wave2 = sin(pos.z * 1.2 + time * 1.8) * 0.15;
                    float wave3 = sin((pos.x + pos.z) * 0.8 + time * 2.5) * 0.1;
                    
                    pos.y += wave1 + wave2 + wave3;
                    vWave = wave1 + wave2 + wave3;
                    
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                }
            `,
            fragmentShader: `
                uniform vec3 color1;
                uniform vec3 color2;
                uniform vec3 color3;
                varying vec2 vUv;
                varying float vWave;
                
                void main() {
                    vec3 color = mix(color1, color2, vWave + 0.5);
                    float foam = step(0.15, vWave);
                    color = mix(color, color3, foam * 0.4);
                    
                    // Add luxury shimmer
                    float shimmer = sin(vUv.x * 20.0) * sin(vUv.y * 20.0) * 0.1;
                    color += shimmer;
                    
                    gl_FragColor = vec4(color, 0.85);
                }
            `,
            transparent: true,
            side: THREE.DoubleSide
        });
    }, []);

    useFrame((state) => {
        if (waterRef.current) {
            waterRef.current.material.uniforms.time.value = state.clock.elapsedTime;
        }
    });

    return (
        <mesh ref={waterRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
            <planeGeometry args={[50, 50, 128, 128]} />
            <primitive object={waterMaterial} />
        </mesh>
    );
};

// Main Luxury Experience Component
const LuxuryExperience = ({ 
    className = "",
    showText = true,
    enableControls = false,
    cameraPosition = [20, 12, 20]
}) => {
    return (
        <div className={`w-full h-full ${className}`}>
            <Canvas
                camera={{ position: cameraPosition, fov: 60 }}
                style={{ 
                    background: 'linear-gradient(to bottom, #e1f5fe 0%, #b3e5fc 30%, #81d4fa 70%, #4fc3f7 100%)' 
                }}
            >
                <ambientLight intensity={0.6} />
                <directionalLight
                    position={[20, 20, 10]}
                    intensity={1.5}
                    color="#ffd700"
                    castShadow
                />
                <pointLight position={[-20, 10, -10]} intensity={0.8} color="#ff6b6b" />
                <pointLight position={[20, 8, 10]} intensity={0.6} color="#4ecdc4" />

                <LuxuryYacht position={[0, 0, 0]} />
                <PrivateJet position={[0, 8, 0]} />
                <LuxuryResort position={[0, 0, -15]} />
                <LuxuryIcons />
                <PremiumWater />

                {/* Premium clouds */}
                <Cloud position={[-15, 12, -8]} speed={0.1} opacity={0.6} color="#ffffff" />
                <Cloud position={[15, 14, -5]} speed={0.15} opacity={0.5} color="#f8f9fa" />
                <Cloud position={[0, 16, -12]} speed={0.12} opacity={0.7} color="#ffffff" />

                {enableControls && (
                    <OrbitControls
                        enableZoom={true}
                        enablePan={true}
                        enableRotate={true}
                        autoRotate={false}
                        minDistance={10}
                        maxDistance={50}
                        dampingFactor={0.05}
                        enableDamping={true}
                        maxPolarAngle={Math.PI / 2.2}
                    />
                )}

                {/* Luxury branding */}
                {showText && (
                    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
                        <Text
                            position={[0, 18, 0]}
                            fontSize={2.5}
                            color="#ffd700"
                            anchorX="center"
                            anchorY="middle"
                            font="/fonts/Inter-Bold.woff"
                        >
                            {enableControls ? "Drag to Explore Luxury • Scroll to Zoom" : "Luxury Travel Redefined"}
                        </Text>
                    </Float>
                )}

                <fog attach="fog" args={['#e1f5fe', 25, 60]} />
            </Canvas>
        </div>
    );
};

export default LuxuryExperience;