import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Box, Cylinder, Cone, Text, Float, Trail, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

// Hot Air Balloon
const HotAirBalloon = ({ position, color = "#ff6b6b" }) => {
    const balloonRef = useRef();
    const basketRef = useRef();

    useFrame((state) => {
        if (balloonRef.current) {
            balloonRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.8) * 0.3;
            balloonRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
        }
        if (basketRef.current) {
            basketRef.current.position.y = position[1] - 2 + Math.sin(state.clock.elapsedTime * 0.8) * 0.3;
            basketRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
        }
    });

    return (
        <group position={position}>
            {/* Balloon */}
            <Sphere ref={balloonRef} args={[2, 16, 16]} position={[0, 0, 0]}>
                <meshStandardMaterial color={color} />
            </Sphere>
            
            {/* Balloon stripes */}
            <Sphere args={[2.01, 16, 16]} position={[0, 0, 0]}>
                <meshBasicMaterial 
                    color="#ffffff" 
                    transparent 
                    opacity={0.3}
                    wireframe
                />
            </Sphere>
            
            {/* Basket */}
            <Box ref={basketRef} args={[1, 0.8, 1]} position={[0, -2, 0]}>
                <meshStandardMaterial color="#8b4513" />
            </Box>
            
            {/* Ropes */}
            {[...Array(8)].map((_, i) => {
                const angle = (i / 8) * Math.PI * 2;
                const x = Math.cos(angle) * 1.5;
                const z = Math.sin(angle) * 1.5;
                return (
                    <Cylinder
                        key={i}
                        args={[0.02, 0.02, 2]}
                        position={[x / 2, -1, z / 2]}
                        rotation={[0, 0, Math.atan2(z, x)]}
                    >
                        <meshStandardMaterial color="#654321" />
                    </Cylinder>
                );
            })}
        </group>
    );
};

// Magical Floating Crystals
const FloatingCrystals = () => {
    const crystalsRef = useRef();

    const crystals = useMemo(() => {
        return [...Array(12)].map((_, i) => ({
            position: [
                (Math.random() - 0.5) * 30,
                Math.random() * 15 + 5,
                (Math.random() - 0.5) * 30
            ],
            rotation: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI],
            speed: Math.random() * 0.02 + 0.01,
            color: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57'][Math.floor(Math.random() * 5)]
        }));
    }, []);

    useFrame((state) => {
        if (crystalsRef.current) {
            crystalsRef.current.children.forEach((crystal, index) => {
                const data = crystals[index];
                crystal.rotation.x += data.speed;
                crystal.rotation.y += data.speed * 0.7;
                crystal.position.y += Math.sin(state.clock.elapsedTime * 2 + index) * 0.01;
            });
        }
    });

    return (
        <group ref={crystalsRef}>
            {crystals.map((crystal, index) => (
                <group key={index} position={crystal.position}>
                    <Cone args={[0.5, 2]} rotation={crystal.rotation}>
                        <meshStandardMaterial 
                            color={crystal.color} 
                            transparent 
                            opacity={0.8}
                            emissive={crystal.color}
                            emissiveIntensity={0.2}
                        />
                    </Cone>
                    <Sparkles
                        count={20}
                        scale={2}
                        size={3}
                        speed={0.4}
                        color={crystal.color}
                    />
                </group>
            ))}
        </group>
    );
};

// Flying Dragons
const Dragons = () => {
    const dragonsRef = useRef();

    const dragons = useMemo(() => {
        return [...Array(3)].map((_, i) => ({
            offset: i * 2.5,
            speed: 0.15 + Math.random() * 0.1,
            radius: 20 + Math.random() * 10,
            height: 12 + Math.random() * 8,
            color: ['#ff4757', '#3742fa', '#2ed573'][i]
        }));
    }, []);

    useFrame((state) => {
        if (dragonsRef.current) {
            dragonsRef.current.children.forEach((dragon, index) => {
                const data = dragons[index];
                const time = state.clock.elapsedTime * data.speed + data.offset;
                
                dragon.position.x = Math.cos(time) * data.radius;
                dragon.position.z = Math.sin(time) * data.radius;
                dragon.position.y = data.height + Math.sin(time * 2) * 2;
                
                dragon.rotation.y = time + Math.PI / 2;
                dragon.rotation.z = Math.sin(time * 3) * 0.2;
            });
        }
    });

    return (
        <group ref={dragonsRef}>
            {dragons.map((dragon, index) => (
                <group key={index} scale={0.8}>
                    <Trail
                        width={2}
                        length={10}
                        color={dragon.color}
                        attenuation={(t) => t * t}
                    >
                        <group>
                            {/* Dragon body */}
                            <Cylinder args={[0.3, 0.5, 3]} rotation={[0, 0, Math.PI / 2]}>
                                <meshStandardMaterial color={dragon.color} />
                            </Cylinder>
                            
                            {/* Dragon head */}
                            <Cone args={[0.4, 1]} position={[2, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
                                <meshStandardMaterial color={dragon.color} />
                            </Cone>
                            
                            {/* Wings */}
                            <Box args={[0.2, 4, 0.1]} position={[0, 1.5, 0]} rotation={[0, 0, Math.PI / 6]}>
                                <meshStandardMaterial color={dragon.color} transparent opacity={0.7} />
                            </Box>
                            <Box args={[0.2, 4, 0.1]} position={[0, -1.5, 0]} rotation={[0, 0, -Math.PI / 6]}>
                                <meshStandardMaterial color={dragon.color} transparent opacity={0.7} />
                            </Box>
                            
                            {/* Tail */}
                            <Cylinder args={[0.1, 0.3, 2]} position={[-2.5, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                                <meshStandardMaterial color={dragon.color} />
                            </Cylinder>
                        </group>
                    </Trail>
                </group>
            ))}
        </group>
    );
};

// Magical Portals
const MagicalPortals = () => {
    const portalsRef = useRef();

    const portals = useMemo(() => [
        { position: [-15, 8, -10], color: '#9c88ff' },
        { position: [15, 6, -8], color: '#ffd93d' },
        { position: [0, 12, -15], color: '#6bcf7f' }
    ], []);

    useFrame((state) => {
        if (portalsRef.current) {
            portalsRef.current.children.forEach((portal, index) => {
                portal.rotation.z += 0.02;
                portal.children[0].rotation.y += 0.03;
                portal.children[1].rotation.y -= 0.02;
            });
        }
    });

    return (
        <group ref={portalsRef}>
            {portals.map((portal, index) => (
                <group key={index} position={portal.position}>
                    {/* Outer ring */}
                    <Cylinder args={[3, 3, 0.2, 32]} rotation={[Math.PI / 2, 0, 0]}>
                        <meshStandardMaterial 
                            color={portal.color} 
                            transparent 
                            opacity={0.3}
                            emissive={portal.color}
                            emissiveIntensity={0.5}
                        />
                    </Cylinder>
                    
                    {/* Inner swirl */}
                    <Cylinder args={[2, 2, 0.1, 16]} rotation={[Math.PI / 2, 0, 0]}>
                        <meshBasicMaterial 
                            color={portal.color} 
                            transparent 
                            opacity={0.6}
                            wireframe
                        />
                    </Cylinder>
                    
                    <Sparkles
                        count={50}
                        scale={6}
                        size={4}
                        speed={0.6}
                        color={portal.color}
                    />
                </group>
            ))}
        </group>
    );
};

// Floating Islands Chain
const FloatingIslandChain = () => {
    const islandsRef = useRef();

    const islands = useMemo(() => {
        return [...Array(5)].map((_, i) => ({
            position: [
                Math.cos(i * 1.2) * 12,
                4 + i * 2,
                Math.sin(i * 1.2) * 12
            ],
            size: 1.5 - i * 0.2,
            color: `hsl(${120 + i * 30}, 70%, 50%)`
        }));
    }, []);

    useFrame((state) => {
        if (islandsRef.current) {
            islandsRef.current.children.forEach((island, index) => {
                island.rotation.y += 0.005;
                island.position.y = islands[index].position[1] + Math.sin(state.clock.elapsedTime + index) * 0.2;
            });
        }
    });

    return (
        <group ref={islandsRef}>
            {islands.map((island, index) => (
                <group key={index} position={island.position}>
                    {/* Island base */}
                    <Sphere args={[island.size, 16, 16]}>
                        <meshStandardMaterial color={island.color} />
                    </Sphere>
                    
                    {/* Waterfall */}
                    <Cylinder 
                        args={[0.1, 0.2, 3]} 
                        position={[island.size * 0.8, -2, 0]}
                    >
                        <meshBasicMaterial 
                            color="#87ceeb" 
                            transparent 
                            opacity={0.6}
                        />
                    </Cylinder>
                    
                    {/* Trees */}
                    {[...Array(3)].map((_, treeIndex) => {
                        const angle = (treeIndex / 3) * Math.PI * 2;
                        const x = Math.cos(angle) * island.size * 0.6;
                        const z = Math.sin(angle) * island.size * 0.6;
                        
                        return (
                            <group key={treeIndex} position={[x, island.size * 0.5, z]}>
                                <Cylinder args={[0.1, 0.1, 1]}>
                                    <meshStandardMaterial color="#8b4513" />
                                </Cylinder>
                                <Sphere args={[0.3, 8, 8]} position={[0, 0.8, 0]}>
                                    <meshStandardMaterial color="#228b22" />
                                </Sphere>
                            </group>
                        );
                    })}
                </group>
            ))}
        </group>
    );
};

// Main Adventure Scene Component
const AdventureScene = ({ 
    className = "",
    showText = true,
    cameraPosition = [25, 15, 25]
}) => {
    return (
        <div className={`w-full h-full ${className}`}>
            <Canvas
                camera={{ position: cameraPosition, fov: 60 }}
                style={{ 
                    background: 'linear-gradient(to bottom, #667eea 0%, #764ba2 50%, #f093fb 100%)' 
                }}
            >
                <ambientLight intensity={0.4} />
                <directionalLight
                    position={[20, 20, 10]}
                    intensity={1}
                    color="#ffd700"
                />
                <pointLight position={[-20, 10, -10]} intensity={0.6} color="#ff6b6b" />
                <pointLight position={[20, 8, 10]} intensity={0.4} color="#4ecdc4" />

                {/* Hot air balloons */}
                <HotAirBalloon position={[-10, 8, -5]} color="#ff6b6b" />
                <HotAirBalloon position={[8, 12, -8]} color="#4ecdc4" />
                <HotAirBalloon position={[0, 15, 5]} color="#feca57" />

                <FloatingCrystals />
                <Dragons />
                <MagicalPortals />
                <FloatingIslandChain />

                {/* Adventure text */}
                {showText && (
                    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
                        <Text
                            position={[0, 20, 0]}
                            fontSize={3}
                            color="#ffffff"
                            anchorX="center"
                            anchorY="middle"
                        >
                            Adventure Awaits
                        </Text>
                    </Float>
                )}

                {/* Magical particles everywhere */}
                <Sparkles
                    count={200}
                    scale={50}
                    size={2}
                    speed={0.3}
                    color="#ffd700"
                />

                <fog attach="fog" args={['#667eea', 30, 80]} />
            </Canvas>
        </div>
    );
};

export default AdventureScene;