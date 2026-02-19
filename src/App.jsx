import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import Overlay from './components/UI/Overlay';
import Mainframe from './components/Scene/Mainframe';
import { useStore } from './utils/store';

function App() {
    const { introComplete } = useStore();

    return (
        <>
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
        </>
    );
}

export default App;
