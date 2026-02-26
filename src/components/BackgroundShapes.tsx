import { useFrame, useThree } from '@react-three/fiber'
import { useReducedMotion } from 'framer-motion'
import { useEffect, useMemo, useRef } from 'react'
import { DodecahedronGeometry, type Group, IcosahedronGeometry, OctahedronGeometry } from 'three'

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
const PARALLAX_MAX_OFFSET = 0.2
const PARALLAX_EASING = 2.6

const clamp = (value: number, min: number, max: number) => {
  return Math.min(max, Math.max(min, value))
}

const SHAPES: ShapeConfig[] = [
  {
    geometry: 'icosahedron',
    color: '#f0e8d7',
    position: [-4.8, 2.1, -2.2],
    scale: 2.05,
    drift: 0.108,
    spin: 0.088,
    phase: 0.8,
    opacity: 0.24,
  },
  {
    geometry: 'dodecahedron',
    color: '#d4c1a0',
    position: [4.9, -1.8, -2.1],
    scale: 1.95,
    drift: 0.098,
    spin: 0.082,
    phase: 1.9,
    opacity: 0.22,
  },
  {
    geometry: 'octahedron',
    color: '#c8beab',
    position: [-4.2, -2.6, -3.9],
    scale: 1.45,
    drift: 0.058,
    spin: 0.066,
    phase: 2.5,
    opacity: 0.18,
  },
  {
    geometry: 'icosahedron',
    color: '#9a948a',
    position: [4.3, 2.5, -4.1],
    scale: 1.25,
    drift: 0.051,
    spin: 0.064,
    phase: 3.2,
    opacity: 0.16,
  },
  {
    geometry: 'dodecahedron',
    color: '#ece5d6',
    position: [-3.6, 0.2, -5.9],
    scale: 1.05,
    drift: 0.045,
    spin: 0.049,
    phase: 4,
    opacity: 0.15,
  },
  {
    geometry: 'octahedron',
    color: '#d9cfbc',
    position: [3.5, -0.4, -6.2],
    scale: 0.95,
    drift: 0.04,
    spin: 0.044,
    phase: 4.7,
    opacity: 0.14,
  },
]

interface OptimizedShapeConfig extends ShapeConfig {
  waveSpeed: number
  hWaveSpeed: number
  hPhase: number
  posDriftX: number
  posDriftY: number
  spinX: number
  spinY: number
  spinZ: number
}

// Pre-calculate invariant math operations to optimize the animation loop
const OPTIMIZED_SHAPES: OptimizedShapeConfig[] = SHAPES.map((shape) => {
  const waveSpeed = 0.25 + shape.drift * 0.4
  return {
    ...shape,
    waveSpeed,
    hWaveSpeed: waveSpeed * 0.75,
    hPhase: shape.phase * 1.3,
    posDriftX: shape.drift * 0.26,
    posDriftY: shape.drift * 1.08,
    spinX: shape.spin * 0.62,
    spinY: shape.spin * 1.05,
    spinZ: shape.spin * 0.14,
  }
})

export function BackgroundShapes() {
  const prefersReducedMotion = useReducedMotion()
  const { invalidate } = useThree()
  const sceneGroupRef = useRef<Group | null>(null)
  const groupRefs = useRef<Array<Group | null>>([])
  const pointerTargetRef = useRef({ x: 0, y: 0 })
  const pointerOffsetRef = useRef({ x: 0, y: 0 })

  const geometries = useMemo(() => ({
    icosahedron: new IcosahedronGeometry(1, 0),
    octahedron: new OctahedronGeometry(1, 0),
    dodecahedron: new DodecahedronGeometry(1, 0),
  }), [])

  useEffect(() => {
    return () => {
      Object.values(geometries).forEach((geometry) => geometry.dispose())
    }
  }, [geometries])

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

  useEffect(() => {
    if (prefersReducedMotion) {
      pointerTargetRef.current.x = 0
      pointerTargetRef.current.y = 0
      pointerOffsetRef.current.x = 0
      pointerOffsetRef.current.y = 0

      const sceneGroup = sceneGroupRef.current
      if (sceneGroup) {
        sceneGroup.position.set(0, 0, 0)
        sceneGroup.rotation.set(0, 0, 0)
      }

      SHAPES.forEach((shape, index) => {
        const group = groupRefs.current[index]

        if (!group) {
          return
        }

        group.position.set(shape.position[0], shape.position[1], shape.position[2])
        group.rotation.set(0, 0, 0)
      })

      return
    }

    const setParallaxTarget = (event: PointerEvent) => {
      const normalizedX = (event.clientX / window.innerWidth - 0.5) * 2
      const normalizedY = (0.5 - event.clientY / window.innerHeight) * 2

      pointerTargetRef.current.x = clamp(
        normalizedX * PARALLAX_MAX_OFFSET,
        -PARALLAX_MAX_OFFSET,
        PARALLAX_MAX_OFFSET,
      )
      pointerTargetRef.current.y = clamp(
        normalizedY * PARALLAX_MAX_OFFSET,
        -PARALLAX_MAX_OFFSET,
        PARALLAX_MAX_OFFSET,
      )
    }

    const resetParallaxTarget = () => {
      pointerTargetRef.current.x = 0
      pointerTargetRef.current.y = 0
    }

    const handlePointerOut = (event: PointerEvent) => {
      if (event.relatedTarget === null) {
        resetParallaxTarget()
      }
    }

    window.addEventListener('pointermove', setParallaxTarget, { passive: true })
    window.addEventListener('pointerout', handlePointerOut)
    window.addEventListener('blur', resetParallaxTarget)

    return () => {
      window.removeEventListener('pointermove', setParallaxTarget)
      window.removeEventListener('pointerout', handlePointerOut)
      window.removeEventListener('blur', resetParallaxTarget)
    }
  }, [prefersReducedMotion])

  useFrame((state, delta) => {
    if (prefersReducedMotion) {
      return
    }

    const elapsed = state.clock.elapsedTime
    const parallaxBlend = Math.min(1, delta * PARALLAX_EASING)

    pointerOffsetRef.current.x +=
      (pointerTargetRef.current.x - pointerOffsetRef.current.x) * parallaxBlend
    pointerOffsetRef.current.y +=
      (pointerTargetRef.current.y - pointerOffsetRef.current.y) * parallaxBlend

    const sceneGroup = sceneGroupRef.current
    if (sceneGroup) {
      sceneGroup.position.x = pointerOffsetRef.current.x
      sceneGroup.position.y = pointerOffsetRef.current.y
      sceneGroup.rotation.x = -pointerOffsetRef.current.y * 0.32
      sceneGroup.rotation.y = pointerOffsetRef.current.x * 0.36
    }

    OPTIMIZED_SHAPES.forEach((shape, index) => {
      const group = groupRefs.current[index]

      if (!group) {
        return
      }

      // Use pre-calculated invariants to reduce per-frame math operations
      const verticalWave = Math.sin(elapsed * shape.waveSpeed + shape.phase)
      const horizontalWave = Math.cos(elapsed * shape.hWaveSpeed + shape.hPhase)
      const spinPulse = 0.88 + Math.sin(elapsed * 0.24 + shape.phase) * 0.14

      group.position.x = shape.position[0] + horizontalWave * shape.posDriftX
      group.position.y = shape.position[1] + verticalWave * shape.posDriftY
      group.rotation.x += delta * shape.spinX * spinPulse
      group.rotation.y += delta * shape.spinY
      group.rotation.z += delta * shape.spinZ
    })
  })

  return (
    <group ref={sceneGroupRef}>
      {SHAPES.map((shape, index) => (
        <group
          key={`${shape.geometry}-${index}`}
          ref={(node: Group | null) => {
            groupRefs.current[index] = node
          }}
          position={shape.position}
          scale={shape.scale}
        >
          <mesh geometry={geometries[shape.geometry]}>
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
