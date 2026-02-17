import { useFrame, useThree } from '@react-three/fiber'
import { useReducedMotion } from 'framer-motion'
import { useEffect, useRef } from 'react'
import type { Group } from 'three'

type GeometryKind = 'icosahedron' | 'octahedron' | 'dodecahedron'

interface ShapeConfig {
  geometry: GeometryKind
  color: string
  position: [number, number, number]
  scale: number
  drift: number
  spin: number
  phase: number
  opacity: number
}

const TARGET_FPS = 30

const SHAPES: ShapeConfig[] = [
  {
    geometry: 'icosahedron',
    color: '#f0e8d7',
    position: [-4.8, 2.1, -2.2],
    scale: 2.05,
    drift: 0.1,
    spin: 0.08,
    phase: 0.8,
    opacity: 0.24,
  },
  {
    geometry: 'dodecahedron',
    color: '#d4c1a0',
    position: [4.9, -1.8, -2.1],
    scale: 1.95,
    drift: 0.09,
    spin: 0.075,
    phase: 1.9,
    opacity: 0.22,
  },
  {
    geometry: 'octahedron',
    color: '#c8beab',
    position: [-4.2, -2.6, -3.9],
    scale: 1.45,
    drift: 0.05,
    spin: 0.06,
    phase: 2.5,
    opacity: 0.18,
  },
  {
    geometry: 'icosahedron',
    color: '#9a948a',
    position: [4.3, 2.5, -4.1],
    scale: 1.25,
    drift: 0.045,
    spin: 0.06,
    phase: 3.2,
    opacity: 0.16,
  },
  {
    geometry: 'dodecahedron',
    color: '#ece5d6',
    position: [-3.6, 0.2, -5.9],
    scale: 1.05,
    drift: 0.04,
    spin: 0.045,
    phase: 4,
    opacity: 0.15,
  },
  {
    geometry: 'octahedron',
    color: '#d9cfbc',
    position: [3.5, -0.4, -6.2],
    scale: 0.95,
    drift: 0.035,
    spin: 0.04,
    phase: 4.7,
    opacity: 0.14,
  },
]

function ShapeGeometry({ geometry }: { geometry: GeometryKind }) {
  if (geometry === 'icosahedron') {
    return <icosahedronGeometry args={[1, 0]} />
  }

  if (geometry === 'octahedron') {
    return <octahedronGeometry args={[1, 0]} />
  }

  return <dodecahedronGeometry args={[1, 0]} />
}

export function BackgroundShapes() {
  const prefersReducedMotion = useReducedMotion()
  const { invalidate } = useThree()
  const groupRefs = useRef<Array<Group | null>>([])

  useEffect(() => {
    if (prefersReducedMotion) {
      invalidate()
      return
    }

    const intervalId = window.setInterval(() => {
      invalidate()
    }, 1000 / TARGET_FPS)

    return () => {
      window.clearInterval(intervalId)
    }
  }, [invalidate, prefersReducedMotion])

  useFrame((state, delta) => {
    if (prefersReducedMotion) {
      return
    }

    const elapsed = state.clock.elapsedTime

    SHAPES.forEach((shape, index) => {
      const group = groupRefs.current[index]

      if (!group) {
        return
      }

      const wave = Math.sin(elapsed * 0.22 + shape.phase)
      group.position.y = shape.position[1] + wave * shape.drift
      group.rotation.x += delta * shape.spin * 0.6
      group.rotation.y += delta * shape.spin
    })
  })

  return (
    <group>
      {SHAPES.map((shape, index) => (
        <group
          key={`${shape.geometry}-${index}`}
          ref={(node: Group | null) => {
            groupRefs.current[index] = node
          }}
          position={shape.position}
          scale={shape.scale}
        >
          <mesh>
            <ShapeGeometry geometry={shape.geometry} />
            <meshStandardMaterial
              color={shape.color}
              roughness={0.95}
              metalness={0.04}
              transparent
              opacity={shape.opacity}
            />
          </mesh>
        </group>
      ))}
    </group>
  )
}
