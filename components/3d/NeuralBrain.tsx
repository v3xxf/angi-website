"use client";

import { useRef, useMemo, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, Line } from "@react-three/drei";
import * as THREE from "three";
import { motion } from "framer-motion";
import { agentCategories } from "@/lib/agents-data";

function BrainNodes({ isProcessing }: { isProcessing: boolean }) {
  const pointsRef = useRef<THREE.Points>(null);
  
  const nodeCount = 300;
  
  const positions = useMemo(() => {
    const pos = new Float32Array(nodeCount * 3);
    
    for (let i = 0; i < nodeCount; i++) {
      const i3 = i * 3;
      
      // Create brain-like shape (ellipsoid)
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 3 + Math.random() * 1.5;
      
      pos[i3] = r * Math.sin(phi) * Math.cos(theta) * 1.2; // wider
      pos[i3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.9; // shorter
      pos[i3 + 2] = r * Math.cos(phi);
    }
    
    return pos;
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.1;
      
      if (isProcessing) {
        pointsRef.current.rotation.y += 0.01;
      }
    }
  });

  return (
    <Points ref={pointsRef} positions={positions}>
      <PointMaterial
        transparent
        color={isProcessing ? "#00fff2" : "#00d4ff"}
        size={0.08}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

function Connections({ isProcessing }: { isProcessing: boolean }) {
  const linesRef = useRef<THREE.Group>(null);
  
  const connections = useMemo(() => {
    const lines = [];
    
    for (let i = 0; i < 50; i++) {
      const theta1 = Math.random() * Math.PI * 2;
      const phi1 = Math.acos(2 * Math.random() - 1);
      const r1 = 3 + Math.random() * 1;
      
      const theta2 = theta1 + (Math.random() - 0.5);
      const phi2 = phi1 + (Math.random() - 0.5) * 0.5;
      const r2 = 3 + Math.random() * 1;
      
      const start = new THREE.Vector3(
        r1 * Math.sin(phi1) * Math.cos(theta1) * 1.2,
        r1 * Math.sin(phi1) * Math.sin(theta1) * 0.9,
        r1 * Math.cos(phi1)
      );
      
      const end = new THREE.Vector3(
        r2 * Math.sin(phi2) * Math.cos(theta2) * 1.2,
        r2 * Math.sin(phi2) * Math.sin(theta2) * 0.9,
        r2 * Math.cos(phi2)
      );
      
      lines.push([start, end]);
    }
    
    return lines;
  }, []);

  useFrame((state) => {
    if (linesRef.current) {
      linesRef.current.rotation.y = state.clock.elapsedTime * 0.1;
    }
  });

  return (
    <group ref={linesRef}>
      {connections.map((points, i) => (
        <Line
          key={i}
          points={points}
          color={isProcessing ? "#a855f7" : "#00d4ff"}
          lineWidth={0.5}
          transparent
          opacity={isProcessing ? 0.6 : 0.2}
        />
      ))}
    </group>
  );
}

function PulsingCore({ isProcessing }: { isProcessing: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      const scale = 0.5 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      meshRef.current.scale.setScalar(isProcessing ? scale * 1.5 : scale);
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshBasicMaterial
        color={isProcessing ? "#00fff2" : "#00d4ff"}
        transparent
        opacity={0.3}
      />
    </mesh>
  );
}

export default function NeuralBrain() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const simulateProcessing = () => {
    setIsProcessing(true);
    setTimeout(() => setIsProcessing(false), 3000);
  };

  return (
    <section className="py-32 relative overflow-hidden">
      <div className="absolute inset-0 circuit-bg opacity-30" />
      
      <div className="max-w-7xl mx-auto px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="font-hud text-sm text-hud-cyan tracking-wider mb-4 block">
            NEURAL ARCHITECTURE
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            The <span className="gradient-text">Brain</span>
          </h2>
          <p className="text-xl text-foreground-secondary max-w-2xl mx-auto">
            Watch Angi&apos;s neural network process your requests in real-time
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* 3D Brain */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative aspect-square"
          >
            <div className="absolute inset-0 rounded-full bg-gradient-radial from-hud-blue/10 to-transparent" />
            <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
              <ambientLight intensity={0.5} />
              <BrainNodes isProcessing={isProcessing} />
              <Connections isProcessing={isProcessing} />
              <PulsingCore isProcessing={isProcessing} />
            </Canvas>
            
            {/* Status indicator */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 hud-panel px-4 py-2">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isProcessing ? "bg-hud-cyan animate-pulse" : "bg-green-400"}`} />
                <span className="font-hud text-xs text-hud-cyan tracking-wider">
                  {isProcessing ? "PROCESSING..." : "READY"}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Categories */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="space-y-4">
              {agentCategories.slice(0, 6).map((category) => (
                <motion.div
                  key={category.id}
                  onMouseEnter={() => setActiveCategory(category.id)}
                  onMouseLeave={() => setActiveCategory(null)}
                  onClick={simulateProcessing}
                  className={`hud-panel p-4 cursor-pointer transition-all ${
                    activeCategory === category.id ? "border-hud-cyan" : ""
                  }`}
                  whileHover={{ x: 10 }}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center text-xl"
                      style={{
                        background: `linear-gradient(135deg, ${category.color}40, ${category.color}10)`,
                        border: `1px solid ${category.color}`,
                        boxShadow: activeCategory === category.id ? `0 0 20px ${category.color}40` : "none",
                      }}
                    >
                      {category.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-white">{category.name}</h3>
                      <p className="text-sm text-foreground-secondary">
                        Neural pathways for {category.name.toLowerCase()} tasks
                      </p>
                    </div>
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{
                        background: activeCategory === category.id ? category.color : "rgba(0, 212, 255, 0.3)",
                        boxShadow: activeCategory === category.id ? `0 0 10px ${category.color}` : "none",
                      }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.button
              onClick={simulateProcessing}
              disabled={isProcessing}
              className="mt-8 w-full hud-panel p-4 text-center font-hud text-hud-cyan tracking-wider hover:bg-hud-blue/10 transition-colors disabled:opacity-50"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isProcessing ? "PROCESSING..." : "SIMULATE TASK"}
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
