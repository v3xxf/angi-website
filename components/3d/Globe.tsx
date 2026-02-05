"use client";

import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere, Html } from "@react-three/drei";
import * as THREE from "three";

// Simulated user locations around the world
const userLocations = [
  { lat: 28.6139, lng: 77.2090, city: "New Delhi", users: 847 },
  { lat: 19.0760, lng: 72.8777, city: "Mumbai", users: 623 },
  { lat: 12.9716, lng: 77.5946, city: "Bangalore", users: 512 },
  { lat: 40.7128, lng: -74.0060, city: "New York", users: 234 },
  { lat: 51.5074, lng: -0.1278, city: "London", users: 189 },
  { lat: 35.6762, lng: 139.6503, city: "Tokyo", users: 156 },
  { lat: 1.3521, lng: 103.8198, city: "Singapore", users: 143 },
  { lat: -33.8688, lng: 151.2093, city: "Sydney", users: 98 },
  { lat: 55.7558, lng: 37.6173, city: "Moscow", users: 87 },
  { lat: 22.3193, lng: 114.1694, city: "Hong Kong", users: 134 },
  { lat: 13.0827, lng: 80.2707, city: "Chennai", users: 287 },
  { lat: 17.3850, lng: 78.4867, city: "Hyderabad", users: 198 },
  { lat: 23.0225, lng: 72.5714, city: "Ahmedabad", users: 145 },
  { lat: 26.9124, lng: 75.7873, city: "Jaipur", users: 112 },
  { lat: 48.8566, lng: 2.3522, city: "Paris", users: 76 },
  { lat: 52.5200, lng: 13.4050, city: "Berlin", users: 65 },
  { lat: 37.7749, lng: -122.4194, city: "San Francisco", users: 187 },
  { lat: 34.0522, lng: -118.2437, city: "Los Angeles", users: 156 },
  { lat: 25.2048, lng: 55.2708, city: "Dubai", users: 203 },
  { lat: -23.5505, lng: -46.6333, city: "São Paulo", users: 89 },
];

// Convert lat/lng to 3D coordinates
function latLngToVector3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  
  return new THREE.Vector3(x, y, z);
}

function GlobePoints({ radius }: { radius: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

  // Create points geometry for user locations
  const { positions, colors, scales } = useMemo(() => {
    const positions: number[] = [];
    const colors: number[] = [];
    const scales: number[] = [];

    userLocations.forEach((loc) => {
      const pos = latLngToVector3(loc.lat, loc.lng, radius + 0.02);
      positions.push(pos.x, pos.y, pos.z);
      
      // Cyan color for points
      colors.push(0, 1, 0.95);
      
      // Scale based on user count
      scales.push(Math.min(loc.users / 100, 3));
    });

    return { positions, colors, scales };
  }, [radius]);

  useFrame((state) => {
    if (pointsRef.current) {
      // Pulse animation
      const time = state.clock.elapsedTime;
      pointsRef.current.material.opacity = 0.6 + Math.sin(time * 2) * 0.3;
    }
  });

  return (
    <>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={positions.length / 3}
            array={new Float32Array(positions)}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={colors.length / 3}
            array={new Float32Array(colors)}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.05}
          vertexColors
          transparent
          opacity={0.8}
          sizeAttenuation
        />
      </points>
      
      {/* Glowing markers for major cities */}
      {userLocations.slice(0, 8).map((loc, i) => {
        const pos = latLngToVector3(loc.lat, loc.lng, radius + 0.03);
        return (
          <mesh key={i} position={[pos.x, pos.y, pos.z]}>
            <sphereGeometry args={[0.015 + (loc.users / 5000), 8, 8]} />
            <meshBasicMaterial color="#00fff2" transparent opacity={0.8} />
          </mesh>
        );
      })}
    </>
  );
}

function GlobeMesh() {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const radius = 1;

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.002;
    }
    if (glowRef.current) {
      glowRef.current.rotation.y += 0.002;
    }
  });

  // Create grid lines for globe
  const gridLines = useMemo(() => {
    const lines: THREE.Vector3[][] = [];
    
    // Latitude lines
    for (let lat = -60; lat <= 60; lat += 30) {
      const points: THREE.Vector3[] = [];
      for (let lng = -180; lng <= 180; lng += 5) {
        points.push(latLngToVector3(lat, lng, radius + 0.005));
      }
      lines.push(points);
    }
    
    // Longitude lines
    for (let lng = -180; lng < 180; lng += 30) {
      const points: THREE.Vector3[] = [];
      for (let lat = -90; lat <= 90; lat += 5) {
        points.push(latLngToVector3(lat, lng, radius + 0.005));
      }
      lines.push(points);
    }
    
    return lines;
  }, []);

  return (
    <group ref={meshRef}>
      {/* Main globe sphere */}
      <Sphere args={[radius, 64, 64]}>
        <meshBasicMaterial
          color="#050510"
          transparent
          opacity={0.9}
        />
      </Sphere>
      
      {/* Grid lines */}
      {gridLines.map((points, i) => (
        <line key={i}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={points.length}
              array={new Float32Array(points.flatMap(p => [p.x, p.y, p.z]))}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#00d4ff" transparent opacity={0.15} />
        </line>
      ))}
      
      {/* Glow effect */}
      <Sphere args={[radius * 1.02, 32, 32]} ref={glowRef}>
        <meshBasicMaterial
          color="#00d4ff"
          transparent
          opacity={0.05}
          side={THREE.BackSide}
        />
      </Sphere>
      
      {/* User location points */}
      <GlobePoints radius={radius} />
    </group>
  );
}

function GlobeScene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <GlobeMesh />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.5}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 1.5}
      />
    </>
  );
}

export default function Globe() {
  const [totalUsers, setTotalUsers] = useState(0);
  
  useEffect(() => {
    // Animate total users count
    const total = userLocations.reduce((sum, loc) => sum + loc.users, 0);
    let current = 0;
    const increment = total / 50;
    const interval = setInterval(() => {
      current += increment;
      if (current >= total) {
        setTotalUsers(total);
        clearInterval(interval);
      } else {
        setTotalUsers(Math.floor(current));
      }
    }, 30);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-[500px]">
      {/* Stats overlay */}
      <div className="absolute top-4 left-4 z-10 hud-panel px-4 py-3">
        <div className="font-hud text-xs text-hud-cyan tracking-wider mb-1">
          GLOBAL USERS
        </div>
        <div className="text-3xl font-bold gradient-text">
          {totalUsers.toLocaleString()}+
        </div>
      </div>
      
      <div className="absolute top-4 right-4 z-10 hud-panel px-4 py-3">
        <div className="font-hud text-xs text-hud-cyan tracking-wider mb-1">
          ACTIVE REGIONS
        </div>
        <div className="text-3xl font-bold gradient-text">
          {userLocations.length}
        </div>
      </div>
      
      {/* Live indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 hud-panel px-4 py-2">
        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
        <span className="font-hud text-xs text-foreground-secondary tracking-wider">
          LIVE ACTIVITY FEED
        </span>
      </div>
      
      <Canvas camera={{ position: [0, 0, 2.5], fov: 45 }}>
        <GlobeScene />
      </Canvas>
    </div>
  );
}
