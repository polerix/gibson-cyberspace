import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { PointerLockControls, PerspectiveCamera, Environment, Grid } from '@react-three/drei';
import { useStore } from '../../utils/store';
import { Vector3 } from 'three';

// Placeholder city block
function CityBlock({ position }) {
    return (
        <group position={position}>
            <mesh position={[0, 1, 0]}>
                <boxGeometry args={[1, 2, 1]} />
                <meshStandardMaterial color="#001a33" emissive="#004466" emissiveIntensity={0.5} wireframe />
            </mesh>
            <mesh position={[0, 1, 0]}>
                <boxGeometry args={[0.95, 1.95, 0.95]} />
                <meshStandardMaterial color="#000" />
            </mesh>
        </group>
    );
}

export default function Mainframe() {
    const { introComplete } = useStore();
    const cameraRef = useRef();
    const controlsRef = useRef();

    // Movement state
    const [moveForward, setMoveForward] = useState(false);
    const [moveBackward, setMoveBackward] = useState(false);
    const [moveLeft, setMoveLeft] = useState(false);
    const [moveRight, setMoveRight] = useState(false);
    const [moveUp, setMoveUp] = useState(false);
    const [moveDown, setMoveDown] = useState(false);

    useEffect(() => {
        const onKeyDown = (event) => {
            switch (event.code) {
                case 'ArrowUp':
                case 'KeyW': setMoveForward(true); break;
                case 'ArrowLeft':
                case 'KeyA': setMoveLeft(true); break;
                case 'ArrowDown':
                case 'KeyS': setMoveBackward(true); break;
                case 'ArrowRight':
                case 'KeyD': setMoveRight(true); break;
                case 'Space': setMoveUp(true); break;
                case 'ShiftLeft':
                case 'ShiftRight': setMoveDown(true); break;
            }
        };

        const onKeyUp = (event) => {
            switch (event.code) {
                case 'ArrowUp':
                case 'KeyW': setMoveForward(false); break;
                case 'ArrowLeft':
                case 'KeyA': setMoveLeft(false); break;
                case 'ArrowDown':
                case 'KeyS': setMoveBackward(false); break;
                case 'ArrowRight':
                case 'KeyD': setMoveRight(false); break;
                case 'Space': setMoveUp(false); break;
                case 'ShiftLeft':
                case 'ShiftRight': setMoveDown(false); break;
            }
        };

        document.addEventListener('keydown', onKeyDown);
        document.addEventListener('keyup', onKeyUp);
        return () => {
            document.removeEventListener('keydown', onKeyDown);
            document.removeEventListener('keyup', onKeyUp);
        };
    }, []);

    const velocity = useRef(new Vector3());
    const direction = useRef(new Vector3());

    useFrame((state, delta) => {
        if (!introComplete) {
            // Idle animation for intro
            state.camera.position.z = 10 + Math.sin(state.clock.elapsedTime * 0.5) * 2;
            state.camera.position.x = Math.cos(state.clock.elapsedTime * 0.2) * 5;
            state.camera.lookAt(0, 0, 0);
            return;
        }

        // Movement Logic
        if (controlsRef.current?.isLocked) {
            velocity.current.x -= velocity.current.x * 10.0 * delta;
            velocity.current.z -= velocity.current.z * 10.0 * delta;
            velocity.current.y -= velocity.current.y * 10.0 * delta;

            direction.current.z = Number(moveForward) - Number(moveBackward);
            direction.current.x = Number(moveRight) - Number(moveLeft);
            direction.current.y = Number(moveUp) - Number(moveDown);
            direction.current.normalize();

            if (moveForward || moveBackward) velocity.current.z -= direction.current.z * 400.0 * delta;
            if (moveLeft || moveRight) velocity.current.x -= direction.current.x * 400.0 * delta;
            if (moveUp || moveDown) velocity.current.y -= direction.current.y * 400.0 * delta;

            controlsRef.current.moveRight(-velocity.current.x * delta);
            controlsRef.current.moveForward(-velocity.current.z * delta);
            state.camera.position.y += velocity.current.y * delta; // Vertical movement
        }
    });

    return (
        <>
            <PerspectiveCamera makeDefault position={[0, 5, 10]} ref={cameraRef} />
            {introComplete && (
                <PointerLockControls
                    ref={controlsRef}
                    selector="#ui-overlay" // Allow clicking on UI to lock? No, UI is overlaid.
                // When intro completes, we might want to auto-lock or wait for user click.
                // The PointerLockControls usually locks on click of the canvas.
                />
            )}

            {/* Lights & Environment */}
            <ambientLight intensity={0.2} />
            <pointLight position={[10, 10, 10]} intensity={1} color="#0ff" />
            <pointLight position={[-10, 5, -10]} intensity={0.5} color="#f0f" />

            <Environment preset="night" />

            {/* Floor Grid */}
            <Grid
                infiniteGrid
                fadeDistance={50}
                sectionSize={5}
                sectionColor="#00ffff"
                cellColor="#003344"
                position={[0, 0, 0]}
            />

            {/* Cyberpunk City Placeholder */}
            <group>
                <CityBlock position={[-2, 0, -2]} />
                <CityBlock position={[2, 0, -2]} />
                <CityBlock position={[-2, 0, 2]} />
                <CityBlock position={[2, 0, 2]} />
                <CityBlock position={[0, 0, -5]} />
                <CityBlock position={[5, 0, 0]} />
                <CityBlock position={[-5, 0, 0]} />

                {/* Central Spire */}
                <mesh position={[0, 3, 0]}>
                    <octahedronGeometry args={[1]} />
                    <meshStandardMaterial color="#0ff" wireframe emissive="#0ff" emissiveIntensity={2} />
                </mesh>
            </group>

            {/* Background stars/particles could go here */}
        </>
    );
}
