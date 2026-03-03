"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows, BakeShadows } from "@react-three/drei";
import { Avatar } from "./Avatar";
import { Suspense, useRef } from "react";
import * as THREE from "three";

export function CustomCamera() {
    useFrame((state) => {
        // A subtle cinematic camera drift from a slight angle
        state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, -0.5 + state.mouse.x * 0.1, 0.05);
        state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, 1.5 + state.mouse.y * 0.1, 0.05);
        state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, 2.8, 0.05);
        state.camera.lookAt(0, 1.4, 0); // Look at upper chest/face
    });
    return null;
}

interface SceneProps {
    isSpeaking: boolean;
}

export function Scene({ isSpeaking }: SceneProps) {
    return (
        <div className="absolute inset-0 w-full h-full gradient-bg z-0">
            {/* Base camera setup, overwritten smoothly by CustomCamera */}
            <Canvas shadows camera={{ position: [-0.5, 1.5, 2.8], fov: 40 }}>
                <fog attach="fog" args={["#0a0a0a", 3, 10]} />
                <ambientLight intensity={0.2} /> {/* Low ambient fill */}

                {/* Soft key light (front-left) */}
                <spotLight
                    position={[-2, 2, 3]}
                    intensity={1.0}
                    penumbra={1}
                    color="#ffffff"
                    castShadow
                    shadow-bias={-0.0001}
                />

                {/* Purple rim light (brand) from behind right */}
                <spotLight
                    position={[3, 3, -2]}
                    intensity={3.5}
                    color="#8b5cf6"
                    penumbra={0.5}
                />

                {/* Secondary subtle rim light for separation */}
                <directionalLight
                    position={[-3, 0, -3]}
                    intensity={1}
                    color="#ffffff"
                />

                <Suspense fallback={null}>
                    <Environment preset="city" blur={0.8} />
                    {/* We no longer need to pass visemes explicitly as Zustand handles state, but keep prop compatibility */}
                    <Avatar isSpeaking={isSpeaking} />
                    <ContactShadows
                        position={[0, -1.2, 0]}
                        opacity={0.6}
                        scale={5}
                        blur={2}
                        far={2}
                    />
                </Suspense>

                {/* Cinematic smooth camera overrides OrbitControls when enabled */}
                <CustomCamera />
                <OrbitControls
                    enableZoom={false}
                    enablePan={false}
                    minPolarAngle={Math.PI / 3}
                    maxPolarAngle={Math.PI / 1.8}
                    minAzimuthAngle={-Math.PI / 4}
                    maxAzimuthAngle={Math.PI / 4}
                />
                <BakeShadows />
            </Canvas>
        </div>
    );
}
