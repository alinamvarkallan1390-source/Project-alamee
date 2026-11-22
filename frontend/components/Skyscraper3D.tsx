'use client';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Lightformer, ContactShadows, Html } from '@react-three/drei';
import { Suspense, useMemo, useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

function useIsMobile() {
  const [m, setM] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    setM(mq.matches);
    const fn = (e: MediaQueryListEvent) => setM(e.matches);
    mq.addEventListener('change', fn);
    return () => mq.removeEventListener('change', fn);
  }, []);
  return m;
}

function ProceduralTower({ quality, rotationSpeed }: { quality: 'high' | 'low'; rotationSpeed: number }) {
  const group = useRef<THREE.Group>(null!);
  const winRef = useRef<THREE.InstancedMesh>(null!);
  const balcRef = useRef<THREE.InstancedMesh>(null!);
  const isMobile = quality === 'low';

  const { windows, balconies } = useMemo(() => {
    const floors = isMobile ? 26 : 42;
    const cols = isMobile ? 5 : 8;
    const wins: { pos: [number, number, number]; rotY: number; lit: number }[] = [];
    const balcs: { pos: [number, number, number]; rotY: number }[] = [];
    const W = 10, D = 10, H = 58;
    for (let f = 0; f < floors; f++) {
      const y = 4 + (f / floors) * H;
      for (let c = 0; c < cols; c++) {
        const x = -W / 2 + ((c + 0.5) / cols) * W;
        const lit = Math.random();
        wins.push({ pos: [x, y, D / 2 + 0.06], rotY: 0, lit });
        wins.push({ pos: [x, y, -D / 2 - 0.06], rotY: Math.PI, lit: Math.random() });
        const z = -D / 2 + ((c + 0.5) / cols) * D;
        wins.push({ pos: [W / 2 + 0.06, y, z], rotY: Math.PI / 2, lit: Math.random() });
        wins.push({ pos: [-W / 2 - 0.06, y, z], rotY: -Math.PI / 2, lit: Math.random() });
      }
      if (f % 3 === 0) {
        for (let c = 1; c < cols; c += 2) {
          const x = -W / 2 + (c / cols) * W;
          balcs.push({ pos: [x, y - 0.5, D / 2 + 0.7], rotY: 0 });
          balcs.push({ pos: [x, y - 0.5, -D / 2 - 0.7], rotY: Math.PI });
        }
      }
    }
    return { windows: wins, balconies: balcs };
  }, [isMobile]);

  useEffect(() => {
    const m = winRef.current;
    if (!m) return;
    const dummy = new THREE.Object3D();
    const color = new THREE.Color();
    windows.forEach((w, i) => {
      dummy.position.set(...w.pos);
      dummy.rotation.set(0, w.rotY, 0);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
      if (w.lit > 0.72) color.set('#E8C97A');
      else if (w.lit > 0.45) color.set('#3A4A5C');
      else color.set('#141A22');
      m.setColorAt(i, color);
    });
    m.instanceMatrix.needsUpdate = true;
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
  }, [windows]);

  useEffect(() => {
    const m = balcRef.current;
    if (!m) return;
    const dummy = new THREE.Object3D();
    balconies.forEach((b, i) => {
      dummy.position.set(...b.pos);
      dummy.rotation.set(0, b.rotY, 0);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    });
    m.instanceMatrix.needsUpdate = true;
  }, [balconies]);

  useFrame((state, delta) => {
    group.current.rotation.y += delta * rotationSpeed * 0.12;
  });

  return (
    <group ref={group}>
      {/* Podium */}
      <mesh position={[0, 1.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[22, 2.4, 22]} />
        <meshStandardMaterial color="#1A1A1E" metalness={0.6} roughness={0.35} />
      </mesh>
      {/* Main shaft — glass */}
      <mesh position={[0, 33, 0]} castShadow receiveShadow>
        <boxGeometry args={[10, 58, 10]} />
        <meshPhysicalMaterial color="#0E1620" metalness={0.9} roughness={0.12} clearcoat={1} clearcoatRoughness={0.1} envMapIntensity={1.4} />
      </mesh>
      {/* Taper crown */}
      <mesh position={[0, 64.5, 0]} castShadow>
        <boxGeometry args={[7.5, 5, 7.5]} />
        <meshStandardMaterial color="#14161A" metalness={0.85} roughness={0.25} />
      </mesh>
      {/* Gold crown band */}
      <mesh position={[0, 67.2, 0]}>
        <boxGeometry args={[7.8, 0.5, 7.8]} />
        <meshStandardMaterial color="#C9A96A" metalness={1} roughness={0.25} emissive="#C9A96A" emissiveIntensity={0.35} />
      </mesh>
      {/* Spire */}
      <mesh position={[0, 72, 0]}>
        <cylinderGeometry args={[0.12, 0.5, 9, 8]} />
        <meshStandardMaterial color="#C9A96A" metalness={1} roughness={0.2} emissive="#C9A96A" emissiveIntensity={0.5} />
      </mesh>
      {/* Sky gardens */}
      {[18, 36, 50].map((y) => (
        <mesh key={y} position={[0, y, 0]}>
          <boxGeometry args={[10.6, 1.1, 10.6]} />
          <meshStandardMaterial color="#1E3A2A" metalness={0.2} roughness={0.9} />
        </mesh>
      ))}
      {/* Windows */}
      <instancedMesh ref={winRef} args={[undefined, undefined, windows.length]} frustumCulled={false}>
        <planeGeometry args={[0.85, 1.1]} />
        <meshStandardMaterial metalness={0.7} roughness={0.25} emissive="#E8C97A" emissiveIntensity={0.55} />
      </instancedMesh>
      {/* Balconies */}
      <instancedMesh ref={balcRef} args={[undefined, undefined, balconies.length]} frustumCulled={false}>
        <boxGeometry args={[1.5, 0.18, 1.1]} />
        <meshStandardMaterial color="#2A2D33" metalness={0.8} roughness={0.4} />
      </instancedMesh>
    </group>
  );
}

function ContextBuildings({ quality }: { quality: 'high' | 'low' }) {
  const buildings = useMemo(() => {
    const arr: { pos: [number, number, number]; size: [number, number, number] }[] = [];
    const spots: [number, number][] = [[-26, -14], [28, -18], [-30, 16], [32, 14], [-16, 30], [18, 32], [0, -34], [-38, -2], [40, 2]];
    spots.forEach(([x, z], i) => {
      const h = 10 + ((i * 7) % 22);
      arr.push({ pos: [x, h / 2, z], size: [8 + (i % 3) * 2, h, 8] });
    });
    return arr;
  }, []);
  return (
    <group>
      {buildings.map((b, i) => (
        <mesh key={i} position={b.pos} receiveShadow>
          <boxGeometry args={b.size} />
          <meshStandardMaterial color="#101216" metalness={0.5} roughness={0.6} />
        </mesh>
      ))}
    </group>
  );
}

function Dust({ quality }: { quality: 'high' | 'low' }) {
  const ref = useRef<THREE.Points>(null!);
  const count = quality === 'low' ? 300 : 900;
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 90;
      arr[i * 3 + 1] = Math.random() * 70;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 90;
    }
    return arr;
  }, [count]);
  useFrame((_, delta) => { ref.current.rotation.y += delta * 0.015; });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.18} color="#C9A96A" transparent opacity={0.55} sizeAttenuation depthWrite={false} />
    </points>
  );
}

function CameraRig({ scrollRef, dragRef, quality }: { scrollRef: React.MutableRefObject<number>; dragRef: React.MutableRefObject<{ x: number; y: number }>; quality: 'high' | 'low' }) {
  const { camera } = useThree();
  const target = useRef({ angle: 0, radius: 52, height: 20 });
  useFrame((state, delta) => {
    const s = scrollRef.current; // 0..1
    const angle = s * Math.PI * 2 + dragRef.current.x * 0.005;
    const radius = quality === 'low' ? 58 : 52 - s * 12;
    const height = 18 + s * 14 + dragRef.current.y * 0.02;
    target.current.angle += (angle - target.current.angle) * Math.min(1, delta * 3.5);
    target.current.radius += (radius - target.current.radius) * Math.min(1, delta * 2);
    target.current.height += (height - target.current.height) * Math.min(1, delta * 2);
    const a = target.current.angle;
    camera.position.set(Math.sin(a) * target.current.radius, target.current.height, Math.cos(a) * target.current.radius);
    camera.lookAt(0, 26, 0);
  });
  return null;
}

export default function Skyscraper3D({ rotationSpeed = 0.35, lighting = 1.2, modelUrl = '' }: { rotationSpeed?: number; lighting?: number; modelUrl?: string }) {
  const isMobile = useIsMobile();
  const quality: 'high' | 'low' = isMobile ? 'low' : 'high';
  const scrollRef = useRef(0);
  const dragRef = useRef({ x: 0, y: 0 });
  const dragging = useRef(false);
  const last = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      scrollRef.current = max > 0 ? window.scrollY / max : 0;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const onPointerDown = (e: React.PointerEvent) => { dragging.current = true; last.current = { x: e.clientX, y: e.clientY }; };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    dragRef.current.x += e.clientX - last.current.x;
    dragRef.current.y = Math.max(-400, Math.min(400, dragRef.current.y + (e.clientY - last.current.y)));
    last.current = { x: e.clientX, y: e.clientY };
  };
  const onPointerUp = () => { dragging.current = false; };

  return (
    <div
      className="fixed inset-0 z-0"
      style={{ touchAction: 'pan-y', cursor: 'grab' }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
      aria-hidden="true"
    >
      <Canvas
        shadows={quality === 'high'}
        dpr={quality === 'low' ? [1, 1.25] : [1, 1.75]}
        camera={{ position: [0, 20, 52], fov: 42, near: 0.1, far: 400 }}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
      >
        <fog attach="fog" args={['#0A0A0B', 70, 160]} />
        <ambientLight intensity={0.35 * lighting} />
        <hemisphereLight args={['#2A3444', '#0A0A0B', 0.5 * lighting]} />
        <directionalLight
          position={[30, 55, 20]}
          intensity={1.6 * lighting}
          castShadow={quality === 'high'}
          shadow-mapSize={[2048, 2048]}
          shadow-camera-left={-50} shadow-camera-right={50}
          shadow-camera-top={60} shadow-camera-bottom={-20}
        />
        <pointLight position={[-35, 30, -25]} intensity={40 * lighting} color="#5B7DB1" />
        <pointLight position={[0, 68, 0]} intensity={25 * lighting} color="#C9A96A" />
        <Suspense fallback={null}>
          <ProceduralTower quality={quality} rotationSpeed={rotationSpeed} />
          <ContextBuildings quality={quality} />
          <Dust quality={quality} />
          <Environment resolution={256}>
            <Lightformer intensity={2} position={[0, 5, -9]} scale={[10, 10, 1]} color="#E8D5A8" />
            <Lightformer intensity={1} position={[-5, 1, -1]} scale={[20, 0.5, 1]} rotation-y={Math.PI / 2} color="#5B7DB1" />
            <Lightformer intensity={1} position={[5, 1, -1]} scale={[20, 1, 1]} rotation-y={Math.PI / 2} color="#C9A96A" />
          </Environment>
        </Suspense>
        {/* Ground */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
          <planeGeometry args={[220, 220]} />
          <meshStandardMaterial color="#0C0C0E" metalness={0.7} roughness={0.35} />
        </mesh>
        <gridHelper args={[160, 40, '#2A2D33', '#1A1A1E']} position={[0, 0.02, 0]} />
        <ContactShadows position={[0, 0.05, 0]} opacity={0.75} scale={90} blur={2.2} far={30} color="#000000" />
        <CameraRig scrollRef={scrollRef} dragRef={dragRef} quality={quality} />
      </Canvas>
    </div>
  );
}
