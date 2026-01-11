import { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Box, Cylinder, Text, Html, Float, Trail } from '@react-three/drei';
import * as THREE from 'three';

// Interactive Timeline Node
const TimelineNode = ({ position, data, isActive, onClick }) => {
    const nodeRef = useRef();
    const [hovered, setHovered] = useState(false);

    useFrame((state) => {
        if (nodeRef.current) {
            const scale = isActive ? 1.2 : hovered ? 1.1 : 1;
            nodeRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.1);
            
            if (isActive) {
                nodeRef.current.rotation.y += 0.02;
            }
        }
    });

    return (
        <group position={position}>
            <Float speed={2} rotationIntensity={0.3} floatIntensity={0.5}>
                <Sphere
                    ref={nodeRef}
                    args={[0.5, 32, 32]}
                    onPointerEnter={() => setHovered(true)}
                    onPointerLeave={() => setHovered(false)}
                    onClick={onClick}
                >
                    <meshStandardMaterial
                        color={isActive ? '#ffd700' : data.color}
                        emissive={isActive ? '#ffd700' : data.color}
                        emissiveIntensity={isActive ? 0.4 : 0.2}
                        metalness={0.8}
                        roughness={0.2}
                    />
                </Sphere>
            </Float>
            
            {/* Timeline info */}
            {(isActive || hovered) && (
                <Html position={[0, 1, 0]} center>
                    <div className="bg-white/95 backdrop-blur-sm px-4 py-3 rounded-xl shadow-xl border border-white/30 max-w-xs">
                        <h3 className="font-bold text-gray-800 text-lg mb-1">{data.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{data.description}</p>
                        <div className="flex items-center justify-between text-xs">
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                {data.duration}
                            </span>
                            <span className="font-semibold text-green-600">
                                ₹{data.price.toLocaleString()}
                            </span>
                        </div>
                    </div>
                </Html>
            )}
            
            {/* Connection indicator */}
            <Cylinder args={[0.02, 0.02, 2]} position={[0, -1.5, 0]}>
                <meshBasicMaterial color={data.color} transparent opacity={0.6} />
            </Cylinder>
        </group>
    );
};

// Animated Travel Path
const TravelPath = ({ nodes }) => {
    const pathRef = useRef();
    
    useFrame((state) => {
        if (pathRef.current) {
            pathRef.current.rotation.y += 0.005;
        }
    });

    return (
        <group ref={pathRef}>
            {nodes.map((node, index) => {
                if (index < nodes.length - 1) {
                    const start = new THREE.Vector3(...node.position);
                    const end = new THREE.Vector3(...nodes[index + 1].position);
                    const distance = start.distanceTo(end);
                    const midpoint = start.clone().lerp(end, 0.5);
                    
                    return (
                        <Cylinder
                            key={index}
                            args={[0.02, 0.02, distance]}
                            position={[midpoint.x, midpoint.y, midpoint.z]}
                            lookAt={end}
                        >
                            <meshBasicMaterial 
                                color="#4fc3f7" 
                                transparent 
                                opacity={0.6}
                            />
                        </Cylinder>
                    );
                }
                return null;
            })}
        </group>
    );
};

// Moving Travel Vehicle
const TravelVehicle = ({ path, speed = 0.1 }) => {
    const vehicleRef = useRef();
    const [currentIndex, setCurrentIndex] = useState(0);

    useFrame((state) => {
        if (vehicleRef.current && path.length > 1) {
            const time = (state.clock.elapsedTime * speed) % 1;
            const segmentIndex = Math.floor(time * (path.length - 1));
            const segmentProgress = (time * (path.length - 1)) % 1;
            
            if (segmentIndex < path.length - 1) {
                const start = new THREE.Vector3(...path[segmentIndex].position);
                const end = new THREE.Vector3(...path[segmentIndex + 1].position);
                
                vehicleRef.current.position.lerpVectors(start, end, segmentProgress);
                
                // Look at direction
                const direction = end.clone().sub(start).normalize();
                vehicleRef.current.lookAt(
                    vehicleRef.current.position.clone().add(direction)
                );
                
                setCurrentIndex(segmentIndex);
            }
        }
    });

    return (
        <Trail
            width={2}
            length={8}
            color="#ff6b6b"
            attenuation={(t) => t * t}
        >
            <group ref={vehicleRef} scale={0.3}>
                {/* Airplane model */}
                <Cylinder args={[0.2, 0.3, 3]} rotation={[0, 0, Math.PI / 2]}>
                    <meshStandardMaterial color="#ffffff" metalness={0.8} roughness={0.2} />
                </Cylinder>
                
                <Box args={[0.3, 4, 0.1]} position={[-0.5, 0, 0]}>
                    <meshStandardMaterial color="#4fc3f7" metalness={0.7} roughness={0.2} />
                </Box>
                
                <Box args={[0.1, 1.5, 0.8]} position={[-1.3, 0, 0.3]}>
                    <meshStandardMaterial color="#4fc3f7" metalness={0.7} roughness={0.2} />
                </Box>
            </group>
        </Trail>
    );
};

// Destination Showcase
const DestinationShowcase = ({ activeNode }) => {
    const showcaseRef = useRef();

    useFrame((state) => {
        if (showcaseRef.current) {
            showcaseRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
        }
    });

    if (!activeNode) return null;

    return (
        <group ref={showcaseRef} position={[0, -8, 0]}>
            {/* Destination preview */}
            <Box args={[6, 4, 0.2]} position={[0, 0, 0]}>
                <meshStandardMaterial color="#f8f9fa" />
            </Box>
            
            {/* Preview content */}
            <Html position={[0, 0, 0.2]} center>
                <div className="w-96 h-64 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg p-6 text-white">
                    <h2 className="text-2xl font-bold mb-4">{activeNode.title}</h2>
                    <p className="text-sm mb-4 opacity-90">{activeNode.fullDescription}</p>
                    <div className="flex justify-between items-center">
                        <div className="text-sm">
                            <div>Duration: {activeNode.duration}</div>
                            <div>Best Time: {activeNode.bestTime}</div>
                        </div>
                        <div className="text-right">
                            <div className="text-2xl font-bold">₹{activeNode.price.toLocaleString()}</div>
                            <button className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold mt-2 hover:bg-gray-100 transition-colors">
                                Book Now
                            </button>
                        </div>
                    </div>
                </div>
            </Html>
        </group>
    );
};

// Main Travel Timeline Component
const TravelTimeline = ({ 
    className = "",
    cameraPosition = [15, 10, 15]
}) => {
    const [activeNodeIndex, setActiveNodeIndex] = useState(0);

    const timelineData = useMemo(() => [
        {
            position: [-8, 4, -4],
            title: "Bali Paradise",
            description: "Tropical beaches and cultural wonders",
            fullDescription: "Experience the magic of Bali with pristine beaches, ancient temples, and vibrant culture. Includes luxury resort stay and guided tours.",
            duration: "7 Days",
            bestTime: "Apr-Oct",
            price: 45000,
            color: "#ff6b6b"
        },
        {
            position: [-4, 6, 2],
            title: "Dubai Luxury",
            description: "Modern marvels and desert adventures",
            fullDescription: "Discover Dubai's architectural wonders, luxury shopping, and thrilling desert safaris. Stay in 5-star hotels with world-class amenities.",
            duration: "5 Days",
            bestTime: "Nov-Mar",
            price: 55000,
            color: "#4ecdc4"
        },
        {
            position: [0, 8, -2],
            title: "Goa Beaches",
            description: "Sun, sand, and vibrant nightlife",
            fullDescription: "Relax on golden beaches, explore Portuguese heritage, and enjoy Goa's famous nightlife. Perfect blend of relaxation and adventure.",
            duration: "4 Days",
            bestTime: "Oct-Mar",
            price: 25000,
            color: "#45b7d1"
        },
        {
            position: [4, 6, 4],
            title: "Kerala Backwaters",
            description: "Serene waters and lush landscapes",
            fullDescription: "Cruise through tranquil backwaters, stay in traditional houseboats, and experience Kerala's natural beauty and Ayurvedic treatments.",
            duration: "6 Days",
            bestTime: "Sep-Mar",
            price: 35000,
            color: "#96ceb4"
        },
        {
            position: [8, 4, 0],
            title: "Manali Adventure",
            description: "Mountain peaks and thrilling activities",
            fullDescription: "Adventure in the Himalayas with trekking, paragliding, and snow activities. Experience mountain culture and breathtaking landscapes.",
            duration: "5 Days",
            bestTime: "Mar-Jun",
            price: 30000,
            color: "#feca57"
        }
    ], []);

    return (
        <div className={`w-full h-full ${className}`}>
            <Canvas
                camera={{ position: cameraPosition, fov: 60 }}
                style={{ 
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
                }}
            >
                <ambientLight intensity={0.4} />
                <directionalLight
                    position={[15, 15, 8]}
                    intensity={1.2}
                    color="#ffd700"
                />
                <pointLight position={[-15, 8, -8]} intensity={0.6} color="#ff6b6b" />
                <pointLight position={[15, 6, 8]} intensity={0.4} color="#4ecdc4" />

                {/* Timeline nodes */}
                {timelineData.map((node, index) => (
                    <TimelineNode
                        key={index}
                        position={node.position}
                        data={node}
                        isActive={activeNodeIndex === index}
                        onClick={() => setActiveNodeIndex(index)}
                    />
                ))}

                {/* Travel path */}
                <TravelPath nodes={timelineData} />
                
                {/* Moving vehicle */}
                <TravelVehicle path={timelineData} speed={0.05} />

                {/* Destination showcase */}
                <DestinationShowcase activeNode={timelineData[activeNodeIndex]} />

                {/* Timeline title */}
                <Float speed={1} rotationIntensity={0.1} floatIntensity={0.3}>
                    <Text
                        position={[0, 12, 0]}
                        fontSize={2}
                        color="#ffffff"
                        anchorX="center"
                        anchorY="middle"
                        font="/fonts/Inter-Bold.woff"
                    >
                        Your Journey Awaits
                    </Text>
                </Float>

                {/* Interactive instructions */}
                <Html position={[0, -12, 0]} center>
                    <div className="text-white text-center">
                        <p className="text-lg font-semibold mb-2">Interactive Travel Timeline</p>
                        <p className="text-sm opacity-80">Click on destinations to explore • Watch the journey unfold</p>
                    </div>
                </Html>

                <fog attach="fog" args={['#667eea', 20, 50]} />
            </Canvas>
        </div>
    );
};

export default TravelTimeline;