'use client'

import { useRef, useState, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Billboard, Text, Line } from '@react-three/drei'
import * as THREE from 'three'
import type { WordData } from './EmbeddingVisualizer'
import { cosineSimilarity3D, getEmbedding, CATEGORY_HEX, getCategory } from './EmbeddingVisualizer'

const SCALE = 3 // scale positions so scene isn't tiny

function WordSphere({
  data,
  isSelected,
  onSelect,
  selectedWord,
}: {
  data: WordData
  isSelected: boolean
  onSelect: (word: string | null) => void
  selectedWord: string | null
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)
  const pos: [number, number, number] = [
    data.position[0] * SCALE,
    data.position[1] * SCALE,
    data.position[2] * SCALE,
  ]

  useFrame(() => {
    if (meshRef.current) {
      const target = isSelected || hovered ? 1.4 : 1
      meshRef.current.scale.lerp(new THREE.Vector3(target, target, target), 0.1)
    }
  })

  return (
    <group position={pos}>
      {/* Sphere */}
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation()
          onSelect(isSelected ? null : data.word)
        }}
        onPointerOver={(e) => {
          e.stopPropagation()
          setHovered(true)
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          setHovered(false)
          document.body.style.cursor = 'auto'
        }}
      >
        <sphereGeometry args={[0.08, 24, 24]} />
        <meshStandardMaterial
          color={data.color}
          emissive={data.color}
          emissiveIntensity={isSelected ? 0.8 : hovered ? 0.5 : 0.2}
          transparent
          opacity={selectedWord && !isSelected ? 0.6 : 1}
        />
      </mesh>

      {/* Glow ring when selected */}
      {isSelected && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.12, 0.15, 32]} />
          <meshBasicMaterial color="white" transparent opacity={0.4} side={THREE.DoubleSide} />
        </mesh>
      )}

      {/* Label */}
      <Billboard follow lockX={false} lockY={false} lockZ={false}>
        <Text
          position={[0, 0.16, 0]}
          fontSize={0.1}
          color={isSelected ? '#ffffff' : hovered ? '#e2e8f0' : '#94a3b8'}
          anchorX="center"
          anchorY="bottom"
          font="/fonts/inter-medium.woff"
          outlineWidth={0.005}
          outlineColor="#000000"
        >
          {data.word}
        </Text>
      </Billboard>
    </group>
  )
}

function SimilarityLines({
  wordData,
  selectedWord,
}: {
  wordData: WordData[]
  selectedWord: string
}) {
  const selectedEmb = getEmbedding(selectedWord)
  const selectedPos: [number, number, number] = [
    selectedEmb[0] * SCALE,
    selectedEmb[1] * SCALE,
    selectedEmb[2] * SCALE,
  ]

  return (
    <>
      {wordData
        .filter((d) => d.word !== selectedWord)
        .map((d) => {
          const sim = cosineSimilarity3D(selectedEmb, d.position)
          const lineColor = sim > 0.5 ? '#22c55e' : sim > 0 ? '#eab308' : '#ef4444'
          const opacity = Math.max(0.15, (sim + 1) / 2) * 0.7
          const targetPos: [number, number, number] = [
            d.position[0] * SCALE,
            d.position[1] * SCALE,
            d.position[2] * SCALE,
          ]
          return (
            <Line
              key={`sim-${d.word}`}
              points={[selectedPos, targetPos]}
              color={lineColor}
              lineWidth={Math.max(0.5, Math.abs(sim) * 2.5)}
              transparent
              opacity={opacity}
              dashed
              dashSize={0.08}
              gapSize={0.04}
            />
          )
        })}
    </>
  )
}

function OriginAxes() {
  const len = SCALE * 1.1
  return (
    <group>
      <Line points={[[-len, 0, 0], [len, 0, 0]]} color="#333" lineWidth={0.5} />
      <Line points={[[0, -len, 0], [0, len, 0]]} color="#333" lineWidth={0.5} />
      <Line points={[[0, 0, -len], [0, 0, len]]} color="#333" lineWidth={0.5} />
      {/* Origin dot */}
      <mesh>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshBasicMaterial color="#555" />
      </mesh>
    </group>
  )
}

function GridFloor() {
  return (
    <gridHelper
      args={[SCALE * 2.5, 20, '#1a1a2e', '#1a1a2e']}
      position={[0, -SCALE * 1.1, 0]}
    />
  )
}

function ParticleField() {
  const count = 200
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * SCALE * 3
      arr[i * 3 + 1] = (Math.random() - 0.5) * SCALE * 3
      arr[i * 3 + 2] = (Math.random() - 0.5) * SCALE * 3
    }
    return arr
  }, [])

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.015} color="#334155" transparent opacity={0.5} />
    </points>
  )
}

function SceneContent({
  wordData,
  selectedWord,
  onSelectWord,
}: {
  wordData: WordData[]
  selectedWord: string | null
  onSelectWord: (word: string | null) => void
}) {
  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]} intensity={0.6} />
      <pointLight position={[-5, -5, -5]} intensity={0.3} />

      <ParticleField />
      <OriginAxes />
      <GridFloor />

      {wordData.map((d) => (
        <WordSphere
          key={d.word}
          data={d}
          isSelected={selectedWord === d.word}
          onSelect={onSelectWord}
          selectedWord={selectedWord}
        />
      ))}

      {selectedWord && (
        <SimilarityLines wordData={wordData} selectedWord={selectedWord} />
      )}

      <OrbitControls
        enableDamping
        dampingFactor={0.08}
        rotateSpeed={0.6}
        zoomSpeed={0.8}
        minDistance={1.5}
        maxDistance={12}
        enablePan
      />
    </>
  )
}

export default function EmbeddingScene3D({
  wordData,
  selectedWord,
  onSelectWord,
}: {
  wordData: WordData[]
  selectedWord: string | null
  onSelectWord: (word: string | null) => void
}) {
  return (
    <Canvas
      camera={{ position: [4, 3, 4], fov: 50 }}
      style={{ background: 'transparent' }}
      gl={{ antialias: true, alpha: true }}
      onPointerMissed={() => onSelectWord(null)}
    >
      <SceneContent
        wordData={wordData}
        selectedWord={selectedWord}
        onSelectWord={onSelectWord}
      />
    </Canvas>
  )
}
