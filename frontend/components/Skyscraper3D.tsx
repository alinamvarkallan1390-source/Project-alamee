'use client';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { Environment, Lightformer, ContactShadows } from '@react-three/drei';
import { Suspense, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

/* A conceptual tower made from three offset glass volumes with terraces. */
function Volume({ y, height, width, depth, x = 0, z = 0 }: { y: number; height: number; width: number; depth: number; x?: number; z?: number }) {
  const floors = Math.floor(height / 0.75);
  return <group position={[x, y, z]}>
    <mesh position={[0, height / 2, 0]}><boxGeometry args={[width, height, depth]} /><meshPhysicalMaterial color="#617676" metalness={0.82} roughness={0.18} clearcoat={1} clearcoatRoughness={0.14} /></mesh>
    {Array.from({ length: floors + 1 }, (_, i) => <mesh key={i} position={[0, i * height / floors, 0]}><boxGeometry args={[width + 0.12, 0.055, depth + 0.12]} /><meshStandardMaterial color="#c7b493" metalness={0.7} roughness={0.32} /></mesh>)}
    {Array.from({ length: 7 }, (_, i) => <group key={i} position={[(i / 6 - 0.5) * width, height / 2, 0]}>
      <mesh position={[0, 0, depth / 2 + 0.04]}><boxGeometry args={[0.055, height, 0.12]} /><meshStandardMaterial color="#aa9b81" metalness={0.7} roughness={0.35} /></mesh>
      <mesh position={[0, 0, -depth / 2 - 0.04]}><boxGeometry args={[0.055, height, 0.12]} /><meshStandardMaterial color="#aa9b81" metalness={0.7} roughness={0.35} /></mesh>
    </group>)}
    {Array.from({ length: 5 }, (_, i) => <group key={i} position={[0, height / 2, (i / 4 - 0.5) * depth]}>
      <mesh position={[width / 2 + 0.04, 0, 0]}><boxGeometry args={[0.12, height, 0.055]} /><meshStandardMaterial color="#aa9b81" metalness={0.7} roughness={0.35} /></mesh>
      <mesh position={[-width / 2 - 0.04, 0, 0]}><boxGeometry args={[0.12, height, 0.055]} /><meshStandardMaterial color="#aa9b81" metalness={0.7} roughness={0.35} /></mesh>
    </group>)}
    <mesh position={[0, height + 0.08, 0]}><boxGeometry args={[width + 0.48, 0.16, depth + 0.48]} /><meshStandardMaterial color="#c3b496" metalness={0.45} roughness={0.42} /></mesh>
  </group>;
}
function Tower() {
  const ref = useRef<THREE.Group>(null!);
  const scroll = useRef(0);
  const reduced = useRef(false);
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => { reduced.current = media.matches; };
    const onScroll = () => { scroll.current = Math.min(1, Math.max(0, window.scrollY / Math.max(window.innerHeight * 0.9, 1))); };
    update(); onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    media.addEventListener('change', update);
    return () => { window.removeEventListener('scroll', onScroll); media.removeEventListener('change', update); };
  }, []);
  useFrame((_, delta) => { if (ref.current) ref.current.rotation.y = THREE.MathUtils.damp(ref.current.rotation.y, reduced.current ? -0.2 : -0.2 + scroll.current * 1.8, 3, delta); });
  return <group ref={ref} position={[0, -12, 0]} rotation={[0, -0.2, 0]}>
    <mesh position={[0, 0.15, 0]}><boxGeometry args={[11, 0.3, 9]} /><meshStandardMaterial color="#857b6d" roughness={0.85} /></mesh>
    <mesh position={[0, 1, 0]}><boxGeometry args={[8, 1.6, 6.5]} /><meshPhysicalMaterial color="#404f50" metalness={0.75} roughness={0.22} clearcoat={1} /></mesh>
    <mesh position={[0, 1.85, 0]}><boxGeometry args={[8.5, 0.18, 7]} /><meshStandardMaterial color="#cbb899" metalness={0.5} roughness={0.4} /></mesh>
    <Volume y={2} height={8} width={6.5} depth={5.4} />
    <Volume y={10.25} height={7.5} width={5.5} depth={4.7} x={-0.45} z={-0.25} />
    <Volume y={18} height={6} width={4.4} depth={3.8} x={-0.9} z={-0.48} />
    {/* warm recessed entrance, planting, and terrace edges give scale */}
    <mesh position={[0, 0.95, 3.27]}><boxGeometry args={[2.4, 1.45, 0.08]} /><meshStandardMaterial color="#b59a70" emissive="#7d5a33" emissiveIntensity={0.5} /></mesh>
    {[[3.4, 0.5, 2.8], [-3.4, 0.5, 2.8], [2.35, 10.45, 1.8], [1.5, 18.2, 1.35]].map(([x, y, z], i) => <group key={i} position={[x, y, z]}><mesh><boxGeometry args={[1.1, 0.45, 0.65]} /><meshStandardMaterial color="#887e6e" roughness={0.9} /></mesh><mesh position={[0, 0.45, 0]}><sphereGeometry args={[0.48, 10, 8]} /><meshStandardMaterial color="#425746" roughness={1} /></mesh></group>)}
  </group>;
}
function Camera() {
  const { camera, size } = useThree();
  useEffect(() => {
    const aspect = size.width / Math.max(size.height, 1);
    const distance = Math.max(43, 17 / Math.max(aspect, 0.35));
    camera.position.set(distance * 0.55, distance * 0.23, distance * 0.84);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  }, [camera, size.width, size.height]);
  return null;
}
export default function Skyscraper3D({ lighting = 1.2 }: { rotationSpeed?: number; lighting?: number; modelUrl?: string }) {
  const [webgl, setWebgl] = useState(true);
  useEffect(() => { try { const c = document.createElement('canvas'); setWebgl(Boolean(c.getContext('webgl2') || c.getContext('webgl'))); } catch { setWebgl(false); } }, []);
  const intensity = Number.isFinite(lighting) ? Math.max(0.3, Math.min(lighting, 2)) : 1.2;
  return <div className="pointer-events-none absolute inset-0" aria-hidden="true" style={{ background: "linear-gradient(to bottom, rgba(8,10,10,.2), rgba(8,10,10,.45)), url(/images/architectural-atmosphere.jpg) center / cover" }}>
    {webgl ? <Canvas dpr={[1, 1.5]} camera={{ position: [24, 10, 38], fov: 38, near: 0.1, far: 200 }} gl={{ antialias: true, alpha: true, powerPreference: 'default' }}>
      <ambientLight intensity={0.6 * intensity} /><hemisphereLight args={['#c6d6d4', '#4d4035', 0.8 * intensity]} />
      <directionalLight position={[12, 24, 18]} intensity={2 * intensity} color="#ffe1b1" /><directionalLight position={[-15, 10, -12]} intensity={1.3 * intensity} color="#a9c8d0" />
      <Suspense fallback={null}><Tower /><Environment resolution={128}><Lightformer intensity={3} position={[10, 10, 10]} scale={[8, 25, 1]} /><Lightformer intensity={2} position={[-10, 5, -5]} scale={[6, 20, 1]} color="#d2e5e5" /><Lightformer intensity={3} position={[0, 18, -10]} scale={[15, 8, 1]} color="#ffdfb4" /></Environment><ContactShadows position={[0, -12, 0]} scale={25} opacity={0.5} blur={2.5} far={10} /></Suspense>
      <Camera />
    </Canvas> : <div className="h-full w-full bg-cover bg-center" style={{ backgroundImage: 'url(/images/editorial-architecture.jpg)' }} />}
  </div>;
}
