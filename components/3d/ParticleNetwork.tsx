"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

function ParticleField() {
  const ref = useRef<THREE.Points>(null);
  
  const particleCount = 500;
  
  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    const colorPalette = [
      new THREE.Color("#2563eb"), // blue
      new THREE.Color("#8b5cf6"), // purple
      new THREE.Color("#06b6d4"), // cyan
      new THREE.Color("#10b981"), // green
      new THREE.Color("#f59e0b"), // amber
    ];
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      
      // Spread particles in a sphere
      const radius = 15 + Math.random() * 10;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);
      
      // Random color from palette
      const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;
    }
    
    return [positions, colors];
  }, []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.05;
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
    }
  });

  return (
    <Points ref={ref} positions={positions} colors={colors} stride={3}>
      <PointMaterial
        transparent
        vertexColors
        size={0.15}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

function ConnectionLines() {
  const ref = useRef<THREE.LineSegments>(null);
  
  const lineCount = 100;
  
  const positions = useMemo(() => {
    const positions = new Float32Array(lineCount * 6);
    
    for (let i = 0; i < lineCount; i++) {
      const i6 = i * 6;
      
      // Start point
      const radius1 = 10 + Math.random() * 8;
      const theta1 = Math.random() * Math.PI * 2;
      const phi1 = Math.acos(2 * Math.random() - 1);
      
      positions[i6] = radius1 * Math.sin(phi1) * Math.cos(theta1);
      positions[i6 + 1] = radius1 * Math.sin(phi1) * Math.sin(theta1);
      positions[i6 + 2] = radius1 * Math.cos(phi1);
      
      // End point (nearby)
      const offset = 3 + Math.random() * 4;
      positions[i6 + 3] = positions[i6] + (Math.random() - 0.5) * offset;
      positions[i6 + 4] = positions[i6 + 1] + (Math.random() - 0.5) * offset;
      positions[i6 + 5] = positions[i6 + 2] + (Math.random() - 0.5) * offset;
    }
    
    return positions;
  }, []);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.03;
    }
  });

  return (
    <lineSegments ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={lineCount * 2}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial color="#2563eb" transparent opacity={0.15} />
    </lineSegments>
  );
}

export default function ParticleNetwork() {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 30], fov: 60 }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.5} />
        <ParticleField />
        <ConnectionLines />
      </Canvas>
    </div>
  );
}
