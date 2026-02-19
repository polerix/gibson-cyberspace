import { create } from 'zustand'

export const useStore = create((set) => ({
    soundEnabled: false,
    introComplete: false,
    playing: false,
    leaderboardOpen: false,
    currentSong: null,

    setSoundEnabled: (enabled) => set({ soundEnabled: enabled }),
    setIntroComplete: (complete) => set({ introComplete: complete }),
    setPlaying: (playing) => set({ playing: playing }),
    toggleLeaderboard: () => set((state) => ({ leaderboardOpen: !state.leaderboardOpen })),
    setCurrentSong: (song) => set({ currentSong: song }),
}))
