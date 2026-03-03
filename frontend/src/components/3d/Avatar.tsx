"use client";

import React, { useRef, useEffect, useMemo, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { useStore } from "@/lib/store";

interface AvatarProps {
  isSpeaking: boolean;
  avatarUrl?: string;
}

// Fallback stylized AI Face if RPM avatar is missing
function StylizedAIFace({ isSpeaking, status }: { isSpeaking: boolean, status: string }) {
  const group = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (!group.current) return;
    const time = state.clock.elapsedTime;

    // Smooth LookAt mouse
    const targetX = state.mouse.x * 0.3;
    const targetY = state.mouse.y * 0.3;
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, targetX, 0.05);
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, -targetY, 0.05);

    // Hovering
    group.current.position.y = Math.sin(time * 2) * 0.1;

    // "Thinking" or "Speaking" rings
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * (isSpeaking ? 2 : (status === 'thinking' ? 1 : 0.2));
      const scaleTarget = isSpeaking ? 1.2 + Math.sin(time * 15) * 0.1 : 1.0;
      ringRef.current.scale.setScalar(THREE.MathUtils.lerp(ringRef.current.scale.x, scaleTarget, 0.1));
    }
  });

  return (
    <group ref={group} position={[0, Math.PI / 2, 0]}>
      {/* Sleek metallic oval head */}
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial
          color="#0a0a0a"
          metalness={0.9}
          roughness={0.1}
          envMapIntensity={2.0}
        />
      </mesh>

      {/* Glass visor */}
      <mesh position={[0, 0, 0.8]} castShadow>
        <boxGeometry args={[1.5, 0.5, 0.5]} />
        <meshPhysicalMaterial
          color="#000000"
          metalness={0.9}
          roughness={0.0}
          transmission={1.0}
          thickness={0.5}
        />
      </mesh>

      {/* AI Core Eye */}
      <mesh position={[0, 0, 0.9]}>
        <sphereGeometry args={[0.1, 32, 32]} />
        <meshStandardMaterial
          color={isSpeaking ? "#10b981" : (status === 'thinking' ? "#f59e0b" : "#8b5cf6")}
          emissive={isSpeaking ? "#10b981" : (status === 'thinking' ? "#f59e0b" : "#8b5cf6")}
          emissiveIntensity={2}
          toneMapped={false}
        />
      </mesh>

      {/* Animated Outer Ring */}
      <mesh ref={ringRef} position={[0, 0, 0]}>
        <torusGeometry args={[1.3, 0.02, 16, 100]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive={isSpeaking ? "#10b981" : "#ffffff"}
          emissiveIntensity={isSpeaking ? 1 : 0.2}
          transparent
          opacity={0.5}
        />
      </mesh>
    </group>
  );
}

function RPMModel({ avatarUrl, isSpeaking, status }: { avatarUrl: string, isSpeaking: boolean, status: string }) {
  const group = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.SkinnedMesh>(null);
  const teethRef = useRef<THREE.SkinnedMesh>(null);
  const blinkTimer = useRef(0);

  // Try to load RPM model. Suspense will catch throws higher up, 
  // but see the Avatar export wrapper to see our Fallback catch mechanism since we cannot catch useGLTF throw directly cleanly here without React 18 ErrorBoundary
  const { scene } = useGLTF(avatarUrl);

  const clone = useMemo(() => scene ? scene.clone() : null, [scene]);

  useEffect(() => {
    if (!clone) return;
    clone.traverse((child) => {
      if ((child as THREE.SkinnedMesh).isMesh) {
        const mesh = child as THREE.SkinnedMesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        if (mesh.material) {
          (mesh.material as THREE.MeshStandardMaterial).roughness = 0.5;
        }
        if (mesh.name === "Wolf3D_Head") headRef.current = mesh;
        if (mesh.name === "Wolf3D_Teeth") teethRef.current = mesh;
      }
    });
  }, [clone]);

  useFrame((state, delta) => {
    if (!group.current) return;
    const time = state.clock.elapsedTime;

    group.current.position.y = Math.sin(time * 2) * 0.015 - 1.5;
    const targetX = (state.mouse.x * 0.5) + Math.sin(time * 0.5) * 0.1;
    const targetY = (state.mouse.y * 0.5) + Math.cos(time * 0.7) * 0.1;
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, targetX, 0.05);
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, -targetY, 0.05);

    if (headRef.current && headRef.current.morphTargetDictionary && headRef.current.morphTargetInfluences) {
      blinkTimer.current += delta;
      let blinkValue = 0;
      if (blinkTimer.current > 3 && blinkTimer.current < 3.2) {
        blinkValue = Math.sin((blinkTimer.current - 3) * 5 * Math.PI);
      } else if (blinkTimer.current > 3.2) {
        if (Math.random() > 0.3) blinkTimer.current = 0;
        else blinkTimer.current = -1;
      }

      const blinkIdxLeft = headRef.current.morphTargetDictionary['eyeBlinkLeft'];
      const blinkIdxRight = headRef.current.morphTargetDictionary['eyeBlinkRight'];
      if (blinkIdxLeft !== undefined) headRef.current.morphTargetInfluences[blinkIdxLeft] = blinkValue;
      if (blinkIdxRight !== undefined) headRef.current.morphTargetInfluences[blinkIdxRight] = blinkValue;

      const jawOpenIdx = headRef.current.morphTargetDictionary['jawOpen'];
      const mouthOpenIdx = headRef.current.morphTargetDictionary['mouthOpen'];

      if (isSpeaking) {
        let talkVal = Math.abs(Math.sin(time * 15)) * 0.6 + Math.abs(Math.sin(time * 25)) * 0.3;
        if (jawOpenIdx !== undefined) headRef.current.morphTargetInfluences[jawOpenIdx] = THREE.MathUtils.lerp(headRef.current.morphTargetInfluences[jawOpenIdx] || 0, talkVal, 0.5);
        if (mouthOpenIdx !== undefined) headRef.current.morphTargetInfluences[mouthOpenIdx] = talkVal * 0.8;
      } else {
        if (jawOpenIdx !== undefined) headRef.current.morphTargetInfluences[jawOpenIdx] = THREE.MathUtils.lerp(headRef.current.morphTargetInfluences[jawOpenIdx] || 0, 0, 0.1);
        if (mouthOpenIdx !== undefined) headRef.current.morphTargetInfluences[mouthOpenIdx] = THREE.MathUtils.lerp(headRef.current.morphTargetInfluences[mouthOpenIdx] || 0, 0, 0.1);
      }
    }

    if (status === 'listening' || status === 'thinking') {
      group.current.position.z = THREE.MathUtils.lerp(group.current.position.z, 0.2, 0.03);
      group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, 0.1, 0.05);
    } else {
      group.current.position.z = THREE.MathUtils.lerp(group.current.position.z, 0, 0.03);
      group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, 0, 0.05);
    }
  });

  return (
    <group ref={group} dispose={null}>
      {clone && <primitive object={clone} scale={[1.8, 1.8, 1.8]} position={[0, -1.2, 0]} />}
    </group>
  );
}

// Custom Error Boundary strictly for Three.js suspended models
class ErrorBoundary extends React.Component<{ fallback: React.ReactNode, children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

export function Avatar({ isSpeaking, avatarUrl = "/models/avatar.glb" }: AvatarProps) {
  const status = useStore((state) => state.status);

  // To avoid Next.js dev overlay from throwing on missing GLB loads natively, 
  // we check if an avatar URL is meant to be a real file.
  const hasAvatar = avatarUrl && avatarUrl !== "/models/avatar.glb" && avatarUrl.trim() !== "";

  return (
    <ErrorBoundary fallback={<StylizedAIFace isSpeaking={isSpeaking} status={status} />}>
      <React.Suspense fallback={<StylizedAIFace isSpeaking={isSpeaking} status={status} />}>
        {hasAvatar ? (
          <RPMModel avatarUrl={avatarUrl} isSpeaking={isSpeaking} status={status} />
        ) : (
          <StylizedAIFace isSpeaking={isSpeaking} status={status} />
        )}
      </React.Suspense>
    </ErrorBoundary>
  );
}
