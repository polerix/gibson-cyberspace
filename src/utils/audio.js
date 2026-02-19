// Simple procedural cyberpunk drone synth
export class CyberSynth {
    constructor() {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        this.oscillators = [];
        this.gainNode = this.ctx.createGain();
        this.gainNode.connect(this.ctx.destination);
        this.gainNode.gain.value = 0;
        this.isPlaying = false;
    }

    start() {
        if (this.isPlaying) return;
        this.ctx.resume();

        // Low drone
        this.createOscillator(55, 'sawtooth', 0.1);
        this.createOscillator(55.5, 'sawtooth', 0.1); // Detuned

        // High futuristic bleeps (LFO modulated)
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = 200;

        // LFO
        const lfo = this.ctx.createOscillator();
        lfo.type = 'square';
        lfo.frequency.value = 4;
        const lfoGain = this.ctx.createGain();
        lfoGain.gain.value = 500;

        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);
        lfo.start();

        osc.connect(gain);
        gain.connect(this.gainNode);
        gain.gain.value = 0.05;
        osc.start();
        this.oscillators.push(osc, lfo);

        this.gainNode.gain.setValueAtTime(0, this.ctx.currentTime);
        this.gainNode.gain.linearRampToValueAtTime(0.3, this.ctx.currentTime + 2);
        this.isPlaying = true;
    }

    createOscillator(freq, type, vol) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.value = freq;
        osc.connect(gain);
        gain.connect(this.gainNode);
        gain.gain.value = vol;
        osc.start();
        this.oscillators.push(osc);
    }

    stop() {
        if (!this.isPlaying) return;
        this.gainNode.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.5);
        setTimeout(() => {
            this.oscillators.forEach(osc => osc.stop());
            this.oscillators = [];
            this.isPlaying = false;
        }, 500);
    }

    toggle() {
        if (this.isPlaying) this.stop();
        else this.start();
        return !this.isPlaying;
    }
}

export const synth = new CyberSynth();
