import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Box, Cylinder, Sphere, Cone, Text, Float } from '@react-three/drei';
import * as THREE from 'three';

// Animated Building Component
const Building = ({ position, height, width, depth, color, hasLights = true }) => {
    const buildingRef = useRef();
    const lightsRef = useRef();

    useFrame((state) => {
        if (buildingRef.current) {
            buildingRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.5 + position[0]) * 0.05;
        }
        if (lightsRef.current && hasLights) {
            lightsRef.current.children.forEach((light, index) => {
                light.material.opacity = 0.5 + Math.sin(state.clock.elapsedTime * 2 + index) * 0.3;
            });
        }
    });

    const windows = useMemo(() => {
        const windowsArray = [];
        const rows = Math.floor(height / 0.5);
        const cols = Math.floor(width / 0.3);
        
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                if (Math.random() > 0.3) { // Not all windows are lit
                    windowsArray.push({
                        position: [
                            (j - cols / 2) * 0.3,
                            (i - rows / 2) * 0.5,
                            width / 2 + 0.01
                        ],
                        color: Math.random() > 0.7 ? '#ffd700' : '#87ceeb'
                    });
                }
            }
        }
        return windowsArray;
    }, [height, width]);

    return (
        <group position={position}>
            {/* Main building */}
            <Box ref={buildingRef} args={[width, height, depth]} position={[0, height / 2, 0]}>
                <meshStandardMaterial color={color} />
            </Box>
            
            {/* Windows */}
            {hasLights && (
                <group ref={lightsRef}>
                    {windows.map((window, index) => (
                        <Box
                            key={index}
                            args={[0.2, 0.3, 0.02]}
                            position={window.position}
                        >
                            <meshBasicMaterial 
                                color={window.color} 
                                transparent 
                                opacity={0.8}
                            />
                        </Box>
                    ))}
                </group>
            )}
            
            {/* Rooftop antenna */}
            <Cylinder 
                args={[0.02, 0.02, 0.5]} 
                position={[0, height + 0.25, 0]}
            >
                <meshStandardMaterial color="#666666" />
            </Cylinder>
        </group>
    );
};

// Iconic Landmarks
const EiffelTower = ({ position, scale = 1 }) => {
    const towerRef = useRef();

    useFrame((state) => {
        if (towerRef.current) {
            towerRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.05;
        }
    });

    return (
        <group ref={towerRef} position={position} scale={scale}>
            {/* Base */}
            <Box args={[2, 0.2, 2]} position={[0, 0.1, 0]}>
                <meshStandardMaterial color="#8b4513" />
            </Box>
            
            {/* Tower structure */}
            <Cone args={[1, 3]} position={[0, 1.5, 0]}>
                <meshStandardMaterial color="#cd853f" wireframe />
            </Cone>
            <Cone args={[0.7, 2]} position={[0, 3.5, 0]}>
                <meshStandardMaterial color="#cd853f" wireframe />
            </Cone>
            <Cone args={[0.4, 1.5]} position={[0, 5.25, 0]}>
                <meshStandardMaterial color="#cd853f" wireframe />
            </Cone>
            
            {/* Top antenna */}
            <Cylinder args={[0.02, 0.02, 1]} position={[0, 6.5, 0]}>
                <meshStandardMaterial color="#666666" />
            </Cylinder>
        </group>
    );
};

// Statue of Liberty
const StatueOfLiberty = ({ position, scale = 1 }) => {
    const statueRef = useRef();

    useFrame((state) => {
        if (statueRef.current) {
            statueRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.02;
        }
    });

    return (
        <group ref={statueRef} position={position} scale={scale}>
            {/* Base */}
            <Cylinder args={[1.5, 1.5, 1]} position={[0, 0.5, 0]}>
                <meshStandardMaterial color="#8fbc8f" />
            </Cylinder>
            
            {/* Body */}
            <Cylinder args={[0.5, 0.7, 3]} position={[0, 2.5, 0]}>
                <meshStandardMaterial color="#2e8b57" />
            </Cylinder>
            
            {/* Head */}
            <Sphere args={[0.4, 16, 16]} position={[0, 4.5, 0]}>
                <meshStandardMaterial color="#2e8b57" />
            </Sphere>
            
            {/* Crown */}
            <Cone args={[0.3, 0.5]} position={[0, 5.2, 0]}>
                <meshStandardMaterial color="#ffd700" />
            </Cone>
            
            {/* Torch */}
            <Cylinder args={[0.05, 0.05, 1]} position={[0.8, 4, 0]}>
                <meshStandardMaterial color="#8b4513" />
            </Cylinder>
            <Sphere args={[0.2, 8, 8]} position={[0.8, 4.7, 0]}>
                <meshBasicMaterial color="#ffa500" />
            </Sphere>
        </group>
    );
};

// Flying Helicopters
const Helicopters = () => {
    const helicoptersRef = useRef();

    const helicopters = useMemo(() => {
        return [...Array(3)].map((_, i) => ({
            offset: i * 2,
            speed: 0.3 + Math.random() * 0.2,
            radius: 15 + Math.random() * 5,
            height: 8 + Math.random() * 4
        }));
    }, []);

    useFrame((state) => {
        if (helicoptersRef.current) {
            helicoptersRef.current.children.forEach((helicopter, index) => {
                const data = helicopters[index];
                const time = state.clock.elapsedTime * data.speed + data.offset;
                
                helicopter.position.x = Math.cos(time) * data.radius;
                helicopter.position.z = Math.sin(time) * data.radius;
                helicopter.position.y = data.height + Math.sin(time * 2) * 0.5;
                
                helicopter.rotation.y = time + Math.PI / 2;
                
                // Rotate propeller
                const propeller = helicopter.children[1];
                if (propeller) {
                    propeller.rotation.y += 0.5;
                }
            });
        }
    });

    return (
        <group ref={helicoptersRef}>
            {helicopters.map((_, index) => (
                <group key={index} scale={0.3}>
                    {/* Helicopter body */}
                    <Sphere args={[0.8, 8, 8]} position={[0, 0, 0]}>
                        <meshStandardMaterial color="#ff4444" />
                    </Sphere>
                    
                    {/* Main rotor */}
                    <Box args={[4, 0.05, 0.2]} position={[0, 0.5, 0]}>
                        <meshStandardMaterial color="#333333" />
                    </Box>
                    
                    {/* Tail */}
                    <Cylinder args={[0.1, 0.1, 2]} position={[-1.5, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                        <meshStandardMaterial color="#ff4444" />
                    </Cylinder>
                    
                    {/* Tail rotor */}
                    <Box args={[0.8, 0.05, 0.1]} position={[-2.5, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                        <meshStandardMaterial color="#333333" />
                    </Box>
                </group>
            ))}
        </group>
    );
};

// Traffic and Cars
const MovingCars = () => {
    const carsRef = useRef();

    const cars = useMemo(() => {
        return [...Array(8)].map((_, i) => ({
            lane: Math.floor(i / 2),
            direction: i % 2 === 0 ? 1 : -1,
            speed: 0.02 + Math.random() * 0.01,
            color: ['#ff0000', '#0000ff', '#ffff00', '#00ff00'][Math.floor(Math.random() * 4)]
        }));
    }, []);

    useFrame((state) => {
        if (carsRef.current) {
            carsRef.current.children.forEach((car, index) => {
                const data = cars[index];
                car.position.x += data.direction * data.speed;
                
                // Reset position when car goes off screen
                if (Math.abs(car.position.x) > 20) {
                    car.position.x = -data.direction * 20;
                }
            });
        }
    });

    return (
        <group ref={carsRef}>
            {cars.map((car, index) => (
                <group
                    key={index}
                    position={[
                        (Math.random() - 0.5) * 40,
                        0.2,
                        -8 + car.lane * 0.5
                    ]}
                >
                    {/* Car body */}
                    <Box args={[0.8, 0.3, 0.4]}>
                        <meshStandardMaterial color={car.color} />
                    </Box>
                    
                    {/* Wheels */}
                    <Cylinder args={[0.1, 0.1, 0.05]} position={[0.3, -0.2, 0.2]} rotation={[Math.PI / 2, 0, 0]}>
                        <meshStandardMaterial color="#333333" />
                    </Cylinder>
                    <Cylinder args={[0.1, 0.1, 0.05]} position={[-0.3, -0.2, 0.2]} rotation={[Math.PI / 2, 0, 0]}>
                        <meshStandardMaterial color="#333333" />
                    </Cylinder>
                    <Cylinder args={[0.1, 0.1, 0.05]} position={[0.3, -0.2, -0.2]} rotation={[Math.PI / 2, 0, 0]}>
                        <meshStandardMaterial color="#333333" />
                    </Cylinder>
                    <Cylinder args={[0.1, 0.1, 0.05]} position={[-0.3, -0.2, -0.2]} rotation={[Math.PI / 2, 0, 0]}>
                        <meshStandardMaterial color="#333333" />
                    </Cylinder>
                </group>
            ))}
        </group>
    );
};

// Main City Skyline Component
const CitySkyline = ({ 
    className = "",
    showLandmarks = true,
    showTraffic = true,
    cameraPosition = [20, 15, 20]
}) => {
    const buildings = useMemo(() => [
        { position: [-8, 0, -5], height: 6, width: 2, depth: 2, color: '#4a5568' },
        { position: [-5, 0, -3], height: 8, width: 1.5, depth: 1.5, color: '#2d3748' },
        { position: [-2, 0, -4], height: 10, width: 2.5, depth: 2.5, color: '#1a202c' },
        { position: [1, 0, -2], height: 7, width: 2, depth: 2, color: '#4a5568' },
        { position: [4, 0, -5], height: 9, width: 1.8, depth: 1.8, color: '#2d3748' },
        { position: [7, 0, -3], height: 5, width: 1.5, depth: 1.5, color: '#4a5568' },
        { position: [10, 0, -4], height: 12, width: 3, depth: 3, color: '#1a202c' },
        { position: [-10, 0, 2], height: 4, width: 1.2, depth: 1.2, color: '#718096' },
        { position: [-6, 0, 3], height: 6, width: 1.8, depth: 1.8, color: '#4a5568' },
        { position: [8, 0, 2], height: 8, width: 2.2, depth: 2.2, color: '#2d3748' }
    ], []);

    return (
        <div className={`w-full h-full ${className}`}>
            <Canvas
                camera={{ position: cameraPosition, fov: 60 }}
                style={{ 
                    background: 'linear-gradient(to bottom, #1a202c 0%, #2d3748 50%, #4a5568 100%)' 
                }}
            >
                <ambientLight intensity={0.3} />
                <directionalLight
                    position={[10, 10, 5]}
                    intensity={0.8}
                    color="#ffd700"
                />
                <pointLight position={[-10, 8, -5]} intensity={0.6} color="#ff6b6b" />
                <pointLight position={[10, 6, 5]} intensity={0.4} color="#4169e1" />

                {/* Ground */}
                <Box args={[50, 0.1, 30]} position={[0, -0.05, 0]}>
                    <meshStandardMaterial color="#2c2c2c" />
                </Box>

                {/* Buildings */}
                {buildings.map((building, index) => (
                    <Building
                        key={index}
                        position={building.position}
                        height={building.height}
                        width={building.width}
                        depth={building.depth}
                        color={building.color}
                    />
                ))}

                {/* Landmarks */}
                {showLandmarks && (
                    <>
                        <EiffelTower position={[-12, 0, -8]} scale={0.8} />
                        <StatueOfLiberty position={[12, 0, -6]} scale={0.6} />
                    </>
                )}

                <Helicopters />
                
                {showTraffic && <MovingCars />}

                {/* Floating welcome text */}
                <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.8}>
                    <Text
                        position={[0, 12, 0]}
                        fontSize={2}
                        color="#ffd700"
                        anchorX="center"
                        anchorY="middle"
                    >
                        Explore the World
                    </Text>
                </Float>

                <fog attach="fog" args={['#1a202c', 20, 50]} />
            </Canvas>
        </div>
    );
};

export default CitySkyline;