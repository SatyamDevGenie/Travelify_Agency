import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Box, Cylinder, Text, Float, Html, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

// Professional Logo Animation
const AnimatedLogo = () => {
    const logoRef = useRef();
    const ringsRef = useRef();

    useFrame((state) => {
        if (logoRef.current) {
            logoRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
            logoRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.2;
        }
        if (ringsRef.current) {
            ringsRef.current.rotation.z += 0.01;
            ringsRef.current.rotation.x += 0.005;
        }
    });

    return (
        <group position={[0, 2, 0]}>
            {/* Main logo sphere */}
            <Float speed={2} rotationIntensity={0.3} floatIntensity={0.5}>
                <Sphere ref={logoRef} args={[1, 64, 64]}>
                    <meshStandardMaterial
                        color="#4f46e5"
                        metalness={0.8}
                        roughness={0.1}
                        emissive="#4f46e5"
                        emissiveIntensity={0.2}
                    />
                </Sphere>
            </Float>
            
            {/* Orbital rings */}
            <group ref={ringsRef}>
                {[...Array(3)].map((_, i) => (
                    <mesh key={i} rotation={[Math.PI / 2, 0, i * Math.PI / 3]}>
                        <torusGeometry args={[1.5 + i * 0.3, 0.02, 16, 100]} />
                        <meshStandardMaterial
                            color={['#ff6b6b', '#4ecdc4', '#ffd93d'][i]}
                            metalness={0.9}
                            roughness={0.1}
                            emissive={['#ff6b6b', '#4ecdc4', '#ffd93d'][i]}
                            emissiveIntensity={0.3}
                        />
                    </mesh>
                ))}
            </group>
            
            {/* Sparkle effects */}
            <Sparkles
                count={100}
                scale={4}
                size={3}
                speed={0.4}
                color="#ffd700"
            />
        </group>
    );
};

// Professional Statistics Display
const StatsDisplay = () => {
    const stats = useMemo(() => [
        { label: "Happy Travelers", value: "50,000+", color: "#ff6b6b", position: [-6, 1, 2] },
        { label: "Destinations", value: "100+", color: "#4ecdc4", position: [6, 1, 2] },
        { label: "Years Experience", value: "15+", color: "#ffd93d", position: [-6, -1, 2] },
        { label: "5★ Reviews", value: "25,000+", color: "#a8e6cf", position: [6, -1, 2] }
    ], []);

    return (
        <group>
            {stats.map((stat, index) => (
                <Float key={index} speed={1 + index * 0.2} rotationIntensity={0.2} floatIntensity={0.6}>
                    <group position={stat.position}>
                        {/* Stat background */}
                        <Box args={[2.5, 1, 0.1]}>
                            <meshStandardMaterial
                                color="white"
                                transparent
                                opacity={0.9}
                                metalness={0.1}
                                roughness={0.1}
                            />
                        </Box>
                        
                        {/* Stat content */}
                        <Html position={[0, 0, 0.1]} center>
                            <div className="text-center p-3 w-40">
                                <div 
                                    className="text-3xl font-bold mb-1"
                                    style={{ color: stat.color }}
                                >
                                    {stat.value}
                                </div>
                                <div className="text-sm text-gray-600 font-medium">
                                    {stat.label}
                                </div>
                            </div>
                        </Html>
                        
                        {/* Accent glow */}
                        <Sphere args={[0.1, 16, 16]} position={[0, 0.6, 0]}>
                            <meshBasicMaterial
                                color={stat.color}
                                emissive={stat.color}
                                emissiveIntensity={0.8}
                            />
                        </Sphere>
                    </group>
                </Float>
            ))}
        </group>
    );
};

// Professional Feature Showcase
const FeatureShowcase = () => {
    const featuresRef = useRef();

    const features = useMemo(() => [
        { 
            title: "AI-Powered Planning", 
            icon: "🤖", 
            position: [-8, 4, -3],
            color: "#667eea"
        },
        { 
            title: "Real-time GPS", 
            icon: "📍", 
            position: [8, 4, -3],
            color: "#764ba2"
        },
        { 
            title: "24/7 Support", 
            icon: "🛟", 
            position: [-8, -4, -3],
            color: "#f093fb"
        },
        { 
            title: "Instant Booking", 
            icon: "⚡", 
            position: [8, -4, -3],
            color: "#f5576c"
        }
    ], []);

    useFrame((state) => {
        if (featuresRef.current) {
            featuresRef.current.children.forEach((feature, index) => {
                feature.rotation.y = Math.sin(state.clock.elapsedTime + index) * 0.1;
                feature.position.y = features[index].position[1] + Math.sin(state.clock.elapsedTime * 2 + index) * 0.2;
            });
        }
    });

    return (
        <group ref={featuresRef}>
            {features.map((feature, index) => (
                <Float key={index} speed={1.5} rotationIntensity={0.4} floatIntensity={0.8}>
                    <group position={feature.position}>
                        {/* Feature container */}
                        <Cylinder args={[1, 1, 0.2]} rotation={[Math.PI / 2, 0, 0]}>
                            <meshStandardMaterial
                                color={feature.color}
                                metalness={0.6}
                                roughness={0.2}
                                emissive={feature.color}
                                emissiveIntensity={0.1}
                            />
                        </Cylinder>
                        
                        {/* Feature content */}
                        <Html position={[0, 0, 0.2]} center>
                            <div className="text-center text-white p-4 w-32">
                                <div className="text-3xl mb-2">{feature.icon}</div>
                                <div className="text-sm font-bold">{feature.title}</div>
                            </div>
                        </Html>
                        
                        {/* Connecting beam */}
                        <Cylinder args={[0.02, 0.02, 3]} position={[0, 0, -1.5]}>
                            <meshBasicMaterial
                                color={feature.color}
                                transparent
                                opacity={0.6}
                            />
                        </Cylinder>
                    </group>
                </Float>
            ))}
        </group>
    );
};

// Professional Particle Field
const ParticleField = () => {
    const particlesRef = useRef();
    
    const particleCount = 500;
    const positions = useMemo(() => {
        const pos = new Float32Array(particleCount * 3);
        for (let i = 0; i < particleCount; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 50;
            pos[i * 3 + 1] = (Math.random() - 0.5) * 30;
            pos[i * 3 + 2] = (Math.random() - 0.5) * 50;
        }
        return pos;
    }, []);

    const colors = useMemo(() => {
        const col = new Float32Array(particleCount * 3);
        const colorPalette = [
            new THREE.Color('#4f46e5'),
            new THREE.Color('#06b6d4'),
            new THREE.Color('#10b981'),
            new THREE.Color('#f59e0b'),
            new THREE.Color('#ef4444')
        ];
        
        for (let i = 0; i < particleCount; i++) {
            const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
            col[i * 3] = color.r;
            col[i * 3 + 1] = color.g;
            col[i * 3 + 2] = color.b;
        }
        return col;
    }, []);

    useFrame((state) => {
        if (particlesRef.current) {
            const positions = particlesRef.current.geometry.attributes.position.array;
            
            for (let i = 0; i < particleCount; i++) {
                positions[i * 3 + 1] += Math.sin(state.clock.elapsedTime + i * 0.01) * 0.01;
                positions[i * 3] += Math.cos(state.clock.elapsedTime + i * 0.005) * 0.005;
            }
            
            particlesRef.current.geometry.attributes.position.needsUpdate = true;
        }
    });

    return (
        <points ref={particlesRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={particleCount}
                    array={positions}
                    itemSize={3}
                />
                <bufferAttribute
                    attach="attributes-color"
                    count={particleCount}
                    array={colors}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.1}
                vertexColors
                transparent
                opacity={0.8}
                sizeAttenuation
                blending={THREE.AdditiveBlending}
            />
        </points>
    );
};

// Main Professional Hero Component
const ProfessionalHero = ({ 
    className = "",
    showBranding = true,
    cameraPosition = [0, 0, 12]
}) => {
    return (
        <div className={`w-full h-full ${className}`}>
            <Canvas
                camera={{ position: cameraPosition, fov: 75 }}
                style={{ 
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)' 
                }}
            >
                <ambientLight intensity={0.4} />
                <directionalLight
                    position={[10, 10, 5]}
                    intensity={1.5}
                    color="#ffffff"
                    castShadow
                />
                <pointLight position={[-10, 5, -5]} intensity={0.8} color="#4f46e5" />
                <pointLight position={[10, -5, 5]} intensity={0.6} color="#06b6d4" />

                <AnimatedLogo />
                <StatsDisplay />
                <FeatureShowcase />
                <ParticleField />

                {/* Professional branding */}
                {showBranding && (
                    <Float speed={1} rotationIntensity={0.1} floatIntensity={0.3}>
                        <Text
                            position={[0, -6, 0]}
                            fontSize={1.5}
                            color="#ffffff"
                            anchorX="center"
                            anchorY="middle"
                            font="/fonts/Inter-Bold.woff"
                        >
                            TRAVELIFY 2026
                        </Text>
                        <Text
                            position={[0, -7.5, 0]}
                            fontSize={0.8}
                            color="#e2e8f0"
                            anchorX="center"
                            anchorY="middle"
                            font="/fonts/Inter-Regular.woff"
                        >
                            The Future of Travel Technology
                        </Text>
                    </Float>
                )}

                <fog attach="fog" args={['#667eea', 15, 40]} />
            </Canvas>
        </div>
    );
};

export default ProfessionalHero;