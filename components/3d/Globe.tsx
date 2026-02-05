"use client";

import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere } from "@react-three/drei";
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

  // Create points geometry for user locations
  const { positions, colors } = useMemo(() => {
    const positions: number[] = [];
    const colors: number[] = [];

    userLocations.forEach((loc) => {
      const pos = latLngToVector3(loc.lat, loc.lng, radius + 0.02);
      positions.push(pos.x, pos.y, pos.z);
      
      // Bright cyan color for points
      colors.push(0, 1, 0.95);
    });

    return { positions, colors };
  }, [radius]);

  useFrame((state) => {
    if (pointsRef.current) {
      const material = pointsRef.current.material as THREE.PointsMaterial;
      const time = state.clock.elapsedTime;
      material.opacity = 0.7 + Math.sin(time * 2) * 0.3;
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
          size={0.08}
          vertexColors
          transparent
          opacity={0.9}
          sizeAttenuation
        />
      </points>
      
      {/* Glowing markers for all cities */}
      {userLocations.map((loc, i) => {
        const pos = latLngToVector3(loc.lat, loc.lng, radius + 0.025);
        const size = 0.02 + (loc.users / 3000);
        return (
          <group key={i}>
            {/* Core glow */}
            <mesh position={[pos.x, pos.y, pos.z]}>
              <sphereGeometry args={[size, 16, 16]} />
              <meshBasicMaterial color="#00fff2" transparent opacity={0.9} />
            </mesh>
            {/* Outer glow */}
            <mesh position={[pos.x, pos.y, pos.z]}>
              <sphereGeometry args={[size * 2, 16, 16]} />
              <meshBasicMaterial color="#00d4ff" transparent opacity={0.3} />
            </mesh>
            {/* Pulse ring */}
            <mesh position={[pos.x, pos.y, pos.z]} rotation={[Math.random() * Math.PI, Math.random() * Math.PI, 0]}>
              <ringGeometry args={[size * 1.5, size * 2.5, 32]} />
              <meshBasicMaterial color="#00fff2" transparent opacity={0.2} side={THREE.DoubleSide} />
            </mesh>
          </group>
        );
      })}
    </>
  );
}

function ConnectionLines({ radius }: { radius: number }) {
  const linesRef = useRef<THREE.Group>(null);
  
  // Create connection lines between major cities
  const connections = useMemo(() => {
    const lines: { start: THREE.Vector3; end: THREE.Vector3 }[] = [];
    
    // Connect major hubs
    const hubs = [0, 1, 2, 3, 4, 5]; // Delhi, Mumbai, Bangalore, NY, London, Tokyo
    
    hubs.forEach((i) => {
      hubs.forEach((j) => {
        if (i < j) {
          const start = latLngToVector3(userLocations[i].lat, userLocations[i].lng, radius + 0.03);
          const end = latLngToVector3(userLocations[j].lat, userLocations[j].lng, radius + 0.03);
          lines.push({ start, end });
        }
      });
    });
    
    return lines;
  }, [radius]);

  useFrame((state) => {
    if (linesRef.current) {
      linesRef.current.children.forEach((child, i) => {
        const material = (child as THREE.Line).material as THREE.LineBasicMaterial;
        const time = state.clock.elapsedTime;
        material.opacity = 0.2 + Math.sin(time * 2 + i * 0.5) * 0.15;
      });
    }
  });

  return (
    <group ref={linesRef}>
      {connections.map((conn, i) => {
        // Create curved line (arc)
        const mid = conn.start.clone().add(conn.end).multiplyScalar(0.5);
        mid.normalize().multiplyScalar(radius + 0.3);
        
        const curve = new THREE.QuadraticBezierCurve3(conn.start, mid, conn.end);
        const points = curve.getPoints(50);
        
        return (
          <line key={i}>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={points.length}
                array={new Float32Array(points.flatMap(p => [p.x, p.y, p.z]))}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial color="#a855f7" transparent opacity={0.3} />
          </line>
        );
      })}
    </group>
  );
}

function GlobeMesh() {
  const meshRef = useRef<THREE.Group>(null);
  const radius = 1;

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.001;
    }
  });

  // Create grid lines for globe
  const gridLines = useMemo(() => {
    const lines: THREE.Vector3[][] = [];
    
    // Latitude lines
    for (let lat = -75; lat <= 75; lat += 15) {
      const points: THREE.Vector3[] = [];
      for (let lng = -180; lng <= 180; lng += 3) {
        points.push(latLngToVector3(lat, lng, radius + 0.003));
      }
      lines.push(points);
    }
    
    // Longitude lines
    for (let lng = -180; lng < 180; lng += 15) {
      const points: THREE.Vector3[] = [];
      for (let lat = -90; lat <= 90; lat += 3) {
        points.push(latLngToVector3(lat, lng, radius + 0.003));
      }
      lines.push(points);
    }
    
    return lines;
  }, []);

  return (
    <group ref={meshRef}>
      {/* Inner dark sphere */}
      <Sphere args={[radius * 0.98, 64, 64]}>
        <meshBasicMaterial color="#020815" />
      </Sphere>
      
      {/* Main globe sphere with slight transparency */}
      <Sphere args={[radius, 64, 64]}>
        <meshBasicMaterial
          color="#0a1628"
          transparent
          opacity={0.95}
        />
      </Sphere>
      
      {/* Grid lines - latitude */}
      {gridLines.map((points, i) => (
        <line key={`grid-${i}`}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={points.length}
              array={new Float32Array(points.flatMap(p => [p.x, p.y, p.z]))}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#00d4ff" transparent opacity={0.4} />
        </line>
      ))}
      
      {/* Atmosphere glow - inner */}
      <Sphere args={[radius * 1.02, 64, 64]}>
        <meshBasicMaterial
          color="#00d4ff"
          transparent
          opacity={0.08}
          side={THREE.BackSide}
        />
      </Sphere>
      
      {/* Atmosphere glow - outer */}
      <Sphere args={[radius * 1.08, 64, 64]}>
        <meshBasicMaterial
          color="#00fff2"
          transparent
          opacity={0.04}
          side={THREE.BackSide}
        />
      </Sphere>
      
      {/* Edge glow ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[radius * 1.01, radius * 1.15, 128]} />
        <meshBasicMaterial color="#00d4ff" transparent opacity={0.1} side={THREE.DoubleSide} />
      </mesh>
      
      {/* Connection lines between cities */}
      <ConnectionLines radius={radius} />
      
      {/* User location points */}
      <GlobePoints radius={radius} />
    </group>
  );
}

function GlobeScene() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={0.8} color="#00d4ff" />
      <pointLight position={[-10, -10, -10]} intensity={0.4} color="#a855f7" />
      <GlobeMesh />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.3}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 1.5}
      />
    </>
  );
}

// Activity feed messages
const activities = [
  "New user joined from Mumbai",
  "Task completed in Bangalore",
  "Agent deployed in New York",
  "Workflow automated in London",
  "Team onboarded from Delhi",
  "Payment received from Singapore",
  "Agent hired in Tokyo",
  "Project launched in Dubai",
];

export default function Globe() {
  const [totalUsers, setTotalUsers] = useState(0);
  const [currentActivity, setCurrentActivity] = useState(0);
  
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

  // Rotate activity feed
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentActivity((prev) => (prev + 1) % activities.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-[600px] bg-gradient-to-b from-transparent via-hud-blue/5 to-transparent rounded-xl overflow-hidden">
      {/* Scan line effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute w-full h-px bg-gradient-to-r from-transparent via-hud-cyan/50 to-transparent animate-scan" />
      </div>
      
      {/* Corner decorations */}
      <div className="absolute top-0 left-0 w-20 h-20 border-l-2 border-t-2 border-hud-cyan/30" />
      <div className="absolute top-0 right-0 w-20 h-20 border-r-2 border-t-2 border-hud-cyan/30" />
      <div className="absolute bottom-0 left-0 w-20 h-20 border-l-2 border-b-2 border-hud-cyan/30" />
      <div className="absolute bottom-0 right-0 w-20 h-20 border-r-2 border-b-2 border-hud-cyan/30" />
      
      {/* Stats overlay - left */}
      <div className="absolute top-6 left-6 z-10">
        <div className="hud-panel px-5 py-4 backdrop-blur-md">
          <div className="font-hud text-xs text-hud-cyan tracking-[0.2em] mb-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-hud-cyan animate-pulse" />
            GLOBAL USERS
          </div>
          <div className="text-4xl font-bold text-white">
            {totalUsers.toLocaleString()}
            <span className="text-hud-cyan">+</span>
          </div>
        </div>
      </div>
      
      {/* Stats overlay - right */}
      <div className="absolute top-6 right-6 z-10">
        <div className="hud-panel px-5 py-4 backdrop-blur-md">
          <div className="font-hud text-xs text-hud-purple tracking-[0.2em] mb-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-hud-purple animate-pulse" />
            ACTIVE REGIONS
          </div>
          <div className="text-4xl font-bold text-white">
            {userLocations.length}
          </div>
        </div>
      </div>
      
      {/* Live activity feed */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10">
        <div className="hud-panel px-6 py-3 backdrop-blur-md flex items-center gap-3 min-w-[300px]">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="font-hud text-xs text-foreground-secondary tracking-wider">
            {activities[currentActivity]}
          </span>
        </div>
      </div>
      
      {/* City legends */}
      <div className="absolute bottom-6 left-6 z-10">
        <div className="hud-panel px-4 py-3 backdrop-blur-md">
          <div className="font-hud text-[10px] text-foreground-secondary tracking-wider mb-2">TOP REGIONS</div>
          <div className="space-y-1">
            {userLocations.slice(0, 4).map((loc, i) => (
              <div key={i} className="flex items-center gap-2 text-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-hud-cyan" />
                <span className="text-foreground-secondary">{loc.city}</span>
                <span className="text-hud-cyan ml-auto">{loc.users}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Connection stats */}
      <div className="absolute bottom-6 right-6 z-10">
        <div className="hud-panel px-4 py-3 backdrop-blur-md">
          <div className="font-hud text-[10px] text-foreground-secondary tracking-wider mb-2">NETWORK STATUS</div>
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-foreground-secondary">Latency</span>
              <span className="text-green-400 ml-auto">&lt;50ms</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-foreground-secondary">Uptime</span>
              <span className="text-hud-cyan ml-auto">99.9%</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-foreground-secondary">Nodes</span>
              <span className="text-hud-purple ml-auto">47</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* 3D Canvas */}
      <Canvas camera={{ position: [0, 0, 2.8], fov: 45 }}>
        <GlobeScene />
      </Canvas>
    </div>
  );
}
