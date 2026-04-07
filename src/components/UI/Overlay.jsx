import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../../utils/store';
import { synth } from '../../utils/audio';
import './Overlay.css'; // We'll create this next

export default function Overlay() {
    const {
        introComplete,
        setIntroComplete,
        soundEnabled,
        setSoundEnabled,
        leaderboardOpen,
        toggleLeaderboard
    } = useStore();

    const [loadingProgress, setLoadingProgress] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        if (loadingProgress < 100) {
            const interval = setInterval(() => {
                setLoadingProgress(prev => Math.min(prev + (Math.random() * 10), 100));
            }, 200);
            return () => clearInterval(interval);
        }
    }, [loadingProgress]);

    // Handle Play/Pause from UI
    const toggleAudio = () => {
        const playing = synth.toggle();
        setIsPlaying(playing);
    };

    const handleStart = () => {
        setIntroComplete(true);
        setSoundEnabled(true);
        synth.start();
        setIsPlaying(true);
    };

    const handleStartMuted = () => {
        setIntroComplete(true);
        setSoundEnabled(false);
        setIsPlaying(false);
    };

    if (introComplete) {
        return (
            <>
                {/* HUD */}
                <div id="ui-overlay" className="hud-mode">
                    <div id="author-footer">
                        <a href="https://github.com/polerix/gibson-cyberspace" target="_blank" rel="noopener noreferrer">FULL SOURCE CODE</a>
                    </div>

                    <div id="music-player-container" className="visible">
                        <button className="player-btn">⏮</button>
                        <button className="player-btn" onClick={toggleAudio}>
                            {isPlaying ? '⏸' : '▶'}
                        </button>
                        <button className="player-btn">⏭</button>
                        <div id="song-info" onClick={toggleAudio}>
                            <span className={`track-content ${isPlaying ? 'scroll' : ''}`}>
                                CYBERPUNK // SYSTEM ONLINE // PROCEDURAL DRONE
                            </span>
                        </div>
                    </div>

                    <div style={{ position: 'absolute', top: 10, right: 10 }}>
                        <button className="cyber-btn" onClick={toggleLeaderboard}>
                            LEADERBOARD
                        </button>
                    </div>
                </div>

                {/* Leaderboard Modal */}
                {leaderboardOpen && (
                    <div className="modal-overlay">
                        <div className="box-message">
                            <h2 style={{ color: '#0ff', textShadow: '0 0 10px #0ff' }}>RECOGNIZED HACKERS</h2>
                            <table style={{ width: '100%', color: '#fff' }}>
                                <thead>
                                    <tr>
                                        <th className="lb-col-rank">#</th>
                                        <th className="lb-col-alias">ALIAS</th>
                                        <th className="lb-col-time">TIME</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr><td className="lb-col-rank">1</td><td className="lb-col-alias">ZERO_COOL</td><td className="lb-col-time">00:12:45</td></tr>
                                    <tr><td className="lb-col-rank">2</td><td className="lb-col-alias">ACID_BURN</td><td className="lb-col-time">00:14:30</td></tr>
                                    <tr><td className="lb-col-rank">3</td><td className="lb-col-alias">CRASH_OVERRIDE</td><td className="lb-col-time">00:15:22</td></tr>
                                </tbody>
                            </table>
                            <button className="cyber-btn" onClick={toggleLeaderboard}>CLOSE CONNECTION</button>
                        </div>
                    </div>
                )}
            </>
        );
    }

    return (
        <div id="ui-overlay">
            <div className="box-message">
                <h1 style={{ textShadow: '0 0 10px #0ff', margin: 0 }}>GIBSON CYBERSPACE</h1>
                <p className="secondary">v2.0.24 // TERMINAL ACCESS</p>

                <div className="loader-bar">
                    <div className="loader-progress" style={{ width: `${loadingProgress}%` }}></div>
                </div>

                {loadingProgress >= 100 ? (
                    <div>
                        <p>SYSTEM READY</p>
                        <button className="cyber-btn" onClick={handleStart}>ENABLE SOUND</button>
                        <button className="cyber-btn secondary" onClick={handleStartMuted}>MUTE</button>
                        <div style={{ marginTop: 20, fontSize: '12px', color: '#666' }}>
                            CONTROLS: W,A,S,D TO MOVE // MOUSE TO LOOK // SPACE TO ASCEND // SHIFT TO DESCEND
                        </div>
                    </div>
                ) : (
                    <p>INITIALIZING PROTOCOLS... {Math.floor(loadingProgress)}%</p>
                )}
            </div>
        </div>
    );
}
