import { Suspense, useRef } from 'react'
import * as THREE from 'three'
import { Canvas } from '@react-three/fiber'
import { Environment, Lightformer } from '@react-three/drei'
import { Physics } from '@react-three/rapier'
import { useMediaQuery } from '../../../hooks/useMediaQuery'
import { useInViewport } from '../../../hooks/useInViewport'
import Band from './Band'

const LIGHT_STRIPS = [
  { intensity: 2, position: [0, -1, 5], rotation: [0, 0, Math.PI / 3], scale: [100, 0.1, 1] },
  { intensity: 3, position: [-1, -1, 1], rotation: [0, 0, Math.PI / 3], scale: [100, 0.1, 1] },
  { intensity: 3, position: [1, 1, 1], rotation: [0, 0, Math.PI / 3], scale: [100, 0.1, 1] },
  { intensity: 10, position: [-10, 0, 14], rotation: [0, Math.PI / 2, Math.PI / 3], scale: [100, 10, 1] },
]

export default function Lanyard({ position = [0, 0, 20], gravity = [0, -40, 0], fov = 20 }) {
  const isMobile = useMediaQuery('(max-width: 767px)')
  const wrapperRef = useRef(null)
  // Stop rendering and stepping physics once the hero has scrolled away.
  const inView = useInViewport(wrapperRef, '0px')

  return (
    <div ref={wrapperRef} className="relative z-0 h-screen w-full">
      <Canvas
        frameloop={inView ? 'always' : 'demand'}
        camera={{ position, fov }}
        dpr={[1, isMobile ? 1.5 : 2]}
        gl={{ alpha: true }}
        onCreated={({ gl }) => gl.setClearColor(new THREE.Color(0x000000), 0)}
      >
        <ambientLight intensity={Math.PI} />
        <Suspense fallback={null}>
          <Physics gravity={gravity} timeStep={isMobile ? 1 / 30 : 1 / 60} paused={!inView}>
            <Band isMobile={isMobile} />
          </Physics>
        </Suspense>
        <Environment blur={0.75}>
          {LIGHT_STRIPS.map((strip, i) => (
            <Lightformer key={i} color="white" {...strip} />
          ))}
        </Environment>
      </Canvas>
    </div>
  )
}
