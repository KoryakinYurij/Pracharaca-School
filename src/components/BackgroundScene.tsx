import { Canvas } from '@react-three/fiber'
import { BackgroundShapes } from './BackgroundShapes'

export default function BackgroundScene() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
      <Canvas
        dpr={[1, 1.5]}
        frameloop="demand"
        camera={{ position: [0, 0, 9], fov: 48, near: 0.1, far: 30 }}
        gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
      >
        <fog attach="fog" args={['#f6f1e8', 7, 22]} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[3.5, 4, 5]} intensity={0.45} color="#efe5cf" />
        <directionalLight position={[-4, -2.5, -3]} intensity={0.2} color="#bca576" />
        <BackgroundShapes />
      </Canvas>
    </div>
  )
}
