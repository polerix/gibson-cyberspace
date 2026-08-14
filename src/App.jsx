import React, { Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import Overlay from './components/UI/Overlay';
import Mainframe from './components/Scene/Mainframe';
import ErrorBoundary from './components/UI/ErrorBoundary';
import { useStore } from './utils/store';

function App() {
    console.log('Gibson Cyberspace v2.0 // App initialized');
    const { introComplete } = useStore();

    return (
        <ErrorBoundary>
            <Overlay />

            <div id="app" style={{
                width: '100%',
                height: '100vh',
                filter: introComplete ? 'none' : 'blur(5px) brightness(0.5)',
                transition: 'all 1s ease-in-out'
            }}>
                <Canvas gl={{ antialias: true }} dpr={[1, 2]}>
                    <Suspense fallback={null}>
                        <Mainframe />
                    </Suspense>
                </Canvas>
            </div>
        </ErrorBoundary>
    );
}

export default App;
