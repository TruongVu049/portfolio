import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { MeshDistortMaterial } from '@react-three/drei'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import { useInViewport } from '../../hooks/useInViewport'

// Resting spot inside the orb: slightly up and to the left of centre.
const HOME = { x: -0.12, y: 0.12 }
const BASE_DISTORT = 0.52
const EXTRA_DISTORT = 0.14
// The distort shader samples noise from vertex positions, so a larger geometry
// (scaled back down) yields more, smaller lumps — a cloud-like blob.
const GEOMETRY_RADIUS = 1.6
const BLOB_SIZE = 0.66

function Blob() {
  const meshRef = useRef()
  const materialRef = useRef()

  useFrame((state, delta) => {
    const mesh = meshRef.current
    const material = materialRef.current
    if (!mesh || !material) return
    const { x, y } = state.pointer
    // Ease toward the cursor and tumble slowly; get lumpier as the cursor nears the centre.
    mesh.rotation.y += delta * 0.25 + (x * 0.9 - mesh.rotation.y) * 0.03
    mesh.rotation.x += (-y * 0.7 - mesh.rotation.x) * 0.03
    mesh.position.x += (HOME.x + x * 0.25 - mesh.position.x) * 0.04
    mesh.position.y += (HOME.y + y * 0.25 - mesh.position.y) * 0.04
    const closeness = 1 - Math.min(1, Math.hypot(x, y))
    const target = BASE_DISTORT + closeness * EXTRA_DISTORT
    material.distort += (target - material.distort) * Math.min(1, delta * 3)
  })

  return (
    <mesh ref={meshRef} scale={BLOB_SIZE / GEOMETRY_RADIUS} position={[HOME.x, HOME.y, 0]}>
      {/* detail 64 ≈ 41k triangles: smooth enough at this size, ~4x cheaper than 128 */}
      <icosahedronGeometry args={[GEOMETRY_RADIUS, 64]} />
      <MeshDistortMaterial
        ref={materialRef}
        color="#0f24ff"
        emissive="#01062e"
        roughness={0.55}
        metalness={0.1}
        distort={BASE_DISTORT}
        radius={1}
        speed={2.6}
      />
    </mesh>
  )
}

/** Dark glass orb holding a lumpy, cursor-reactive blob. */
export default function LiquidBlob() {
  const isMobile = useMediaQuery('(max-width: 767px)')
  const wrapperRef = useRef(null)
  const inView = useInViewport(wrapperRef, '100px')

  return (
    <div ref={wrapperRef} className="relative mx-auto aspect-square w-full max-w-[340px]">
      {/* Outer halo */}
      <div aria-hidden="true" className="absolute -inset-[28%] rounded-full bg-[radial-gradient(circle,rgba(37,99,235,0.55)_0%,rgba(29,78,216,0.28)_38%,transparent_68%)] blur-2xl" />
      <div
        aria-hidden="true"
        className="absolute inset-0 rounded-full shadow-[0_0_60px_18px_rgba(37,99,235,0.45),0_0_140px_40px_rgba(29,78,216,0.25)]"
      />
      {/* Glass sphere: dark core with a pale haze settling at the bottom */}
      <div className="absolute inset-0 overflow-hidden rounded-full border border-(--orb-border) bg-(image:--orb-glass) shadow-[inset_0_2px_30px_rgba(147,197,253,0.12),inset_0_-30px_60px_rgba(148,163,184,0.12)]">
        <Canvas
          // 'demand' still draws one frame on mount, so shaders compile at load time
          // instead of causing a hitch when the section scrolls into view.
          frameloop={inView ? 'always' : 'demand'}
          camera={{ position: [0, 0, 4.2], fov: 45 }}
          dpr={[1, isMobile ? 1.5 : 1.75]}
          gl={{ alpha: true, powerPreference: 'high-performance' }}
        >
          <ambientLight intensity={0.35} />
          {/* Broad key light from the upper left; no point lights so there are no hard specular dots. */}
          <directionalLight position={[-3, 3, 4]} intensity={1.6} color="#c7d7ff" />
          <directionalLight position={[3, 2, -3]} intensity={1.4} color="#dbe4f0" />
          <hemisphereLight args={['#93c5fd', '#020617', 0.5]} />
          <Blob />
        </Canvas>
        {/* Thin glass rim highlight */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_18%,rgba(255,255,255,0.08),transparent_40%)]" />
      </div>
    </div>
  )
}
