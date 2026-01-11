import { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Stars, OrbitControls, Text, Html, Float } from '@react-three/drei';
import * as THREE from 'three';

// Premium Earth with Real Destinations
const PremiumEarth = () => {
    const meshRef = useRef();
    const materialRef = useRef();
    const [hoveredDestination, setHoveredDestination] = useState(null);

    // Real travel destinations with coordinates
    const destinations = useMemo(() => [
        { name: "Bali, Indonesia", lat: -8.3405, lng: 115.0920, color: "#ff6b6b", tours: 15 },
        { name: "Dubai, UAE", lat: 25.2048, lng: 55.2708, color: "#4ecdc4", tours: 12 },
        { name: "Goa, India", lat: 15.2993, lng: 74.1240, color: "#45b7d1", tours: 18 },
        { name: "London, UK", lat: 51.5074, lng: -0.1278, color: "#96ceb4", tours: 8 },
        { name: "Thailand", lat: 15.8700, lng: 100.9925, color: "#feca57", tours: 22 },
        { name: "Manali, India", lat: 32.2396, lng: 77.1887, color: "#ff9ff3", tours: 10 },
        { name: "Kerala, India", lat: 10.8505, lng: 76.2711, color: "#54a0ff", tours: 14 }
    ], []);

    // Convert lat/lng to 3D coordinates
    const latLngTo3D = (lat, lng, radius = 2.1) => {
        const phi = (90 - lat) * (Math.PI / 180);
        const theta = (lng + 180) * (Math.PI / 180);
        
        return {
            x: -(radius * Math.sin(phi) * Math.cos(theta)),
            y: radius * Math.cos(phi),
            z: radius * Math.sin(phi) * Math.sin(theta)
        };
    };

    // Create realistic Earth texture
    const earthTexture = useMemo(() => {
        const canvas = document.createElement('canvas');
        canvas.width = 1024;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');
        
        // Create realistic Earth gradient
        const gradient = ctx.createLinearGradient(0, 0, 1024, 512);
        gradient.addColorStop(0, '#1e3a8a'); // Deep ocean
        gradient.addColorStop(0.2, '#1e40af'); // Ocean
        gradient.addColorStop(0.4, '#059669'); // Land
        gradient.addColorStop(0.6, '#16a34a'); // Forest
        gradient.addColorStop(0.8, '#ca8a04'); // Desert
        gradient.addColorStop(1, '#ffffff'); // Ice caps
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 1024, 512);
        
        // Add continents
        ctx.fillStyle = '#16a34a';
        // Africa
        ctx.fillRect(480, 200, 120, 180);
        // Asia
        ctx.fillRect(600, 150, 200, 150);
        // Europe
        ctx.fillRect(450, 120, 80, 60);
        // Americas
        ctx.fillRect(200, 180, 60, 200);
        ctx.fillRect(150, 100, 40, 120);
        
        // Add cloud patterns
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        for (let i = 0; i < 50; i++) {
            const x = Math.random() * 1024;
            const y = Math.random() * 512;
            const size = Math.random() * 30 + 10;
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
        }
        
        const texture = new THREE.CanvasTexture(canvas);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        return texture;
    }, []);

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += 0.003;
            meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.05;
        }
        if (materialRef.current) {
            materialRef.current.distort = 0.05 + Math.sin(state.clock.elapsedTime * 0.5) * 0.02;
        }
    });

    return (
        <group>
            {/* Main Earth */}
            <Sphere ref={meshRef} args={[2, 128, 64]} position={[0, 0, 0]}>
                <MeshDistortMaterial
                    ref={materialRef}
                    map={earthTexture}
                    distort={0.05}
                    speed={1}
                    roughness={0.1}
                    metalness={0.2}
                />
            </Sphere>
            
            {/* Atmosphere layers */}
            <Sphere args={[2.05, 64, 32]} position={[0, 0, 0]}>
                <meshBasicMaterial
                    color="#87ceeb"
                    transparent
                    opacity={0.15}
                    side={THREE.BackSide}
                />
            </Sphere>
            
            <Sphere args={[2.1, 32, 16]} position={[0, 0, 0]}>
                <meshBasicMaterial
                    color="#4f46e5"
                    transparent
                    opacity={0.08}
                    side={THREE.BackSide}
                />
            </Sphere>

            {/* Destination Markers */}
            {destinations.map((dest, index) => {
                const pos = latLngTo3D(dest.lat, dest.lng);
                return (
                    <group key={index} position={[pos.x, pos.y, pos.z]}>
                        {/* Pulsing marker */}
                        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.8}>
                            <Sphere 
                                args={[0.03, 16, 16]}
                                onPointerEnter={() => setHoveredDestination(dest)}
                                onPointerLeave={() => setHoveredDestination(null)}
                            >
                                <meshBasicMaterial 
                                    color={dest.color} 
                                    emissive={dest.color}
                                    emissiveIntensity={0.5}
                                />
                            </Sphere>
                        </Float>
                        
                        {/* Destination info */}
                        {hoveredDestination === dest && (
                            <Html position={[0, 0.2, 0]} center>
                                <div className="bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg border border-white/20">
                                    <h3 className="font-bold text-gray-800 text-sm">{dest.name}</h3>
                                    <p className="text-xs text-gray-600">{dest.tours} tours available</p>
                                </div>
                            </Html>
                        )}
                        
                        {/* Connecting lines to Earth */}
                        <mesh>
                            <cylinderGeometry args={[0.001, 0.001, 0.3]} />
                            <meshBasicMaterial color={dest.color} transparent opacity={0.6} />
                        </mesh>
                    </group>
                );
            })}
        </group>
    );
};

// Orbital Satellites and Space Stations
const SpaceElements = () => {
    const satellitesRef = useRef();
    
    const satellites = useMemo(() => {
        return [...Array(8)].map((_, i) => ({
            radius: 3 + Math.random() * 2,
            speed: 0.01 + Math.random() * 0.02,
            offset: i * 0.8,
            size: 0.02 + Math.random() * 0.01
        }));
    }, []);

    useFrame((state) => {
        if (satellitesRef.current) {
            satellitesRef.current.children.forEach((satellite, index) => {
                const data = satellites[index];
                const time = state.clock.elapsedTime * data.speed + data.offset;
                
                satellite.position.x = Math.cos(time) * data.radius;
                satellite.position.z = Math.sin(time) * data.radius;
                satellite.position.y = Math.sin(time * 2) * 0.5;
                
                satellite.rotation.y = time;
            });
        }
    });

    return (
        <group ref={satellitesRef}>
            {satellites.map((sat, index) => (
                <group key={index}>
                    {/* Satellite body */}
                    <mesh scale={sat.size * 50}>
                        <boxGeometry args={[0.02, 0.01, 0.03]} />
                        <meshStandardMaterial color="#silver" metalness={0.8} roughness={0.2} />
                    </mesh>
                    
                    {/* Solar panels */}
                    <mesh scale={sat.size * 50} position={[0.015, 0, 0]}>
                        <boxGeometry args={[0.001, 0.02, 0.01]} />
                        <meshStandardMaterial color="#1e40af" metalness={0.3} />
                    </mesh>
                    <mesh scale={sat.size * 50} position={[-0.015, 0, 0]}>
                        <boxGeometry args={[0.001, 0.02, 0.01]} />
                        <meshStandardMaterial color="#1e40af" metalness={0.3} />
                    </mesh>
                </group>
            ))}
        </group>
    );
};

// Premium Globe Component
const Globe3D = ({ 
    className = "", 
    showDestinations = true, 
    enableControls = false 
}) => {
    return (
        <div className={`w-full h-full ${className}`}>
            <Canvas
                camera={{ position: [0, 0, 8], fov: 45 }}
                style={{ background: 'radial-gradient(circle, #0f172a 0%, #000000 100%)' }}
            >
                <ambientLight intensity={0.2} />
                <directionalLight position={[10, 10, 5]} intensity={1.5} color="#ffd700" />
                <pointLight position={[-10, -10, -5]} intensity={0.8} color="#4f46e5" />
                <pointLight position={[5, 5, 5]} intensity={0.6} color="#06b6d4" />
                
                <Stars
                    radius={100}
                    depth={50}
                    count={2000}
                    factor={6}
                    saturation={0}
                    fade
                    speed={0.5}
                />
                
                <PremiumEarth />
                <SpaceElements />
                
                {enableControls && (
                    <OrbitControls
                        enableZoom={true}
                        enablePan={true}
                        enableRotate={true}
                        autoRotate={false}
                        minDistance={4}
                        maxDistance={15}
                        dampingFactor={0.05}
                        enableDamping={true}
                    />
                )}
                
                {!enableControls && (
                    <OrbitControls
                        enableZoom={false}
                        enablePan={false}
                        autoRotate
                        autoRotateSpeed={0.3}
                        minDistance={4}
                        maxDistance={15}
                    />
                )}
                
                {/* Floating brand text */}
                <Float speed={1} rotationIntensity={0.2} floatIntensity={0.3}>
                    <Text
                        position={[0, -4, 0]}
                        fontSize={0.5}
                        color="#ffffff"
                        anchorX="center"
                        anchorY="middle"
                    >
                        {enableControls ? "Drag to Explore • Scroll to Zoom" : "Explore the World with Travelify 2026"}
                    </Text>
                </Float>
            </Canvas>
        </div>
    );
};

export default Globe3D;