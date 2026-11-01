import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { extend, useFrame, useThree } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import {
  BallCollider,
  CuboidCollider,
  RigidBody,
  useRopeJoint,
  useSphericalJoint,
} from '@react-three/rapier'
import { MeshLineGeometry, MeshLineMaterial } from 'meshline'
import {
  CANVAS_FONTS,
  CARD_CANVAS,
  createCanvasTexture,
  drawCardBack,
  drawCardFront,
  drawStrap,
  STRAP_CANVAS,
} from './textures'

extend({ MeshLineGeometry, MeshLineMaterial })

const SEGMENT_PROPS = {
  type: 'dynamic',
  canSleep: true,
  colliders: false,
  angularDamping: 4,
  linearDamping: 4,
}
const PREFERRED_ANCHOR_X = -6
const ANCHOR_Y = 4
const EDGE_MARGIN = 2.2 // world units kept between the card and the left edge
const CARD_SIZE = [1.6, 2.25, 0.03]
const CARD_OFFSET_Y = -0.05 // visual card group relative to its rigid body
const CLIP_Y = CARD_SIZE[1] / 2 + 0.12 // clip ring centre, in the card group
const CLIP_RADIUS = 0.1
// The strap ends at the top of the clip ring so it visibly threads through it.
const STRAP_ATTACH_Y = CARD_OFFSET_Y + CLIP_Y + CLIP_RADIUS

/** One strap segment, spaced half a unit further along from the anchor per index. */
function Joint({ ref, anchor, index }) {
  return (
    <RigidBody ref={ref} {...SEGMENT_PROPS} position={[anchor[0] + 0.5 * (index + 1), anchor[1], anchor[2]]}>
      <BallCollider args={[0.1]} />
    </RigidBody>
  )
}

/**
 * A strap made of three rope-jointed segments ending in a card.
 * The strap is a Catmull-Rom curve through the bodies rendered as a MeshLine.
 */
export default function Band({ maxSpeed = 50, minSpeed = 0, isMobile = false }) {
  const bandRef = useRef()
  const fixed = useRef()
  const j1 = useRef()
  const j2 = useRef()
  const j3 = useRef()
  const card = useRef()

  const scratch = useMemo(
    () => ({ vec: new THREE.Vector3(), ang: new THREE.Vector3(), rot: new THREE.Vector3(), dir: new THREE.Vector3() }),
    [],
  )
  const [curve] = useState(
    () =>
      new THREE.CatmullRomCurve3(
        [new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()],
        false,
        'chordal',
      ),
  )
  const front = useMemo(() => createCanvasTexture(drawCardFront, CARD_CANVAS.width, CARD_CANVAS.height), [])
  const back = useMemo(() => createCanvasTexture(drawCardBack, CARD_CANVAS.width, CARD_CANVAS.height), [])
  const strap = useMemo(
    () => createCanvasTexture(drawStrap, STRAP_CANVAS.width, STRAP_CANVAS.height, { repeat: true }),
    [],
  )
  const [dragOffset, setDragOffset] = useState(null)
  const [hovered, setHovered] = useState(false)
  // Hang the card near the left edge, but never so far that narrow screens clip it.
  const viewportWidth = useThree((state) => state.viewport.width)
  const [anchor] = useState(() => [Math.max(PREFERRED_ANCHOR_X, -viewportWidth / 2 + EDGE_MARGIN), ANCHOR_Y, 0])

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1])
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1])
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1])
  useSphericalJoint(j3, card, [[0, 0, 0], [0, STRAP_ATTACH_Y, 0]])

  useEffect(() => {
    if (!hovered) return undefined
    document.body.style.cursor = dragOffset ? 'grabbing' : 'grab'
    return () => {
      document.body.style.cursor = 'auto'
    }
  }, [hovered, dragOffset])

  // Canvas text is drawn with web fonts; repaint once they are available.
  useEffect(() => {
    let cancelled = false
    Promise.all(CANVAS_FONTS.map((font) => document.fonts.load(font)))
      .catch(() => [])
      .then(() => {
        if (cancelled) return
        ;[front, back, strap].forEach(({ redraw }) => redraw())
      })
    return () => {
      cancelled = true
      ;[front, back, strap].forEach(({ texture }) => texture.dispose())
    }
  }, [front, back, strap])

  useFrame((state, delta) => {
    const { vec, ang, rot, dir } = scratch
    if (dragOffset) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera)
      dir.copy(vec).sub(state.camera.position).normalize()
      vec.add(dir.multiplyScalar(state.camera.position.length()))
      ;[card, j1, j2, j3, fixed].forEach((ref) => ref.current?.wakeUp())
      card.current?.setNextKinematicTranslation({
        x: vec.x - dragOffset.x,
        y: vec.y - dragOffset.y,
        z: vec.z - dragOffset.z,
      })
    }
    if (!fixed.current) return

    // Smooth the middle joints so the strap doesn't jitter.
    ;[j1, j2].forEach((ref) => {
      const body = ref.current
      if (!body.lerped) body.lerped = new THREE.Vector3().copy(body.translation())
      const distance = Math.max(0.1, Math.min(1, body.lerped.distanceTo(body.translation())))
      body.lerped.lerp(body.translation(), delta * (minSpeed + distance * (maxSpeed - minSpeed)))
    })
    curve.points[0].copy(j3.current.translation())
    curve.points[1].copy(j2.current.lerped)
    curve.points[2].copy(j1.current.lerped)
    curve.points[3].copy(fixed.current.translation())
    bandRef.current.geometry.setPoints(curve.getPoints(isMobile ? 16 : 32))

    // Gently rotate the card back to face the camera.
    ang.copy(card.current.angvel())
    rot.copy(card.current.rotation())
    card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z })
  })

  const startDrag = (e) => {
    e.target.setPointerCapture(e.pointerId)
    setDragOffset(new THREE.Vector3().copy(e.point).sub(scratch.vec.copy(card.current.translation())))
  }
  const endDrag = (e) => {
    e.target.releasePointerCapture(e.pointerId)
    setDragOffset(null)
  }

  return (
    <>
      <group>
        <RigidBody ref={fixed} {...SEGMENT_PROPS} type="fixed" position={[anchor[0], anchor[1] + 0.5, anchor[2]]} />
        <Joint ref={j1} anchor={anchor} index={0} />
        <Joint ref={j2} anchor={anchor} index={1} />
        <Joint ref={j3} anchor={anchor} index={2} />
        <RigidBody
          ref={card}
          {...SEGMENT_PROPS}
          position={[anchor[0] + 2, anchor[1], anchor[2]]}
          type={dragOffset ? 'kinematicPosition' : 'dynamic'}
        >
          <CuboidCollider args={[CARD_SIZE[0] / 2, CARD_SIZE[1] / 2, 0.01]} />
          <group
            position={[0, CARD_OFFSET_Y, 0]}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
            onPointerDown={startDrag}
            onPointerUp={endDrag}
          >
            {/* Card body: plain dark edge. The faces are separate planes because
                RoundedBox UVs don't span 0–1, which shifted the artwork. */}
            <RoundedBox args={[CARD_SIZE[0] - 0.02, CARD_SIZE[1] - 0.02, CARD_SIZE[2]]} radius={0.07} smoothness={4}>
              <meshStandardMaterial color="#0a0d16" roughness={0.5} metalness={0.4} />
            </RoundedBox>
            {[
              { texture: front.texture, z: CARD_SIZE[2] / 2 + 0.002, rotationY: 0 },
              { texture: back.texture, z: -CARD_SIZE[2] / 2 - 0.002, rotationY: Math.PI },
            ].map(({ texture, z, rotationY }) => (
              <mesh key={rotationY} position={[0, 0, z]} rotation={[0, rotationY, 0]}>
                <planeGeometry args={[CARD_SIZE[0], CARD_SIZE[1]]} />
                <meshPhysicalMaterial
                  map={texture}
                  transparent
                  alphaTest={0.5}
                  clearcoat={isMobile ? 0 : 1}
                  clearcoatRoughness={0.12}
                  roughness={0.45}
                  metalness={0.25}
                />
              </mesh>
            ))}
            {/* Metal clip that holds the strap */}
            <mesh position={[0, CLIP_Y, 0]}>
              <torusGeometry args={[CLIP_RADIUS, 0.025, 12, 32]} />
              <meshStandardMaterial color="#c7d2fe" metalness={0.95} roughness={0.25} />
            </mesh>
          </group>
        </RigidBody>
      </group>
      <mesh ref={bandRef}>
        <meshLineGeometry />
        <meshLineMaterial
          color="white"
          depthTest={false}
          resolution={isMobile ? [1000, 2000] : [1000, 1000]}
          useMap
          map={strap.texture}
          repeat={[-4, 1]}
          lineWidth={1}
        />
      </mesh>
    </>
  )
}
