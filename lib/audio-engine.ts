// TinniAudioEngine — the personalised sound therapy engine.
// Signal chain: LayerGainNodes → premixGain → [notchFilter] → masterGain → analyser → destination
// Binaural beats bypass notch (they have their own stereo merger path).

export type SoundType =
  | "white"
  | "pink"
  | "brown"
  | "rain"
  | "ocean"
  | "fractal"
  | "binaural-alpha"
  | "binaural-theta"

export const SOUND_LABELS: Record<SoundType, string> = {
  white: "White Noise",
  pink: "Pink Noise",
  brown: "Brown Noise",
  rain: "Rain",
  ocean: "Ocean Waves",
  fractal: "Fractal Tones",
  "binaural-alpha": "Binaural Alpha",
  "binaural-theta": "Binaural Theta",
}

export const SOUND_DESCRIPTIONS: Record<SoundType, string> = {
  white: "Full-spectrum, bright and uniform",
  pink: "Balanced — closest to natural soundscapes",
  brown: "Deep, warm rumble — great for masking",
  rain: "Synthesised rainfall with natural variation",
  ocean: "Rolling waves with low-frequency depth",
  fractal: "Drifting tones — prevents neural adaptation",
  "binaural-alpha": "10 Hz beat — promotes relaxation (headphones)",
  "binaural-theta": "6 Hz beat — promotes sleep (headphones)",
}

interface LayerNodes {
  bufferSources: AudioBufferSourceNode[]
  oscillators: OscillatorNode[]
  intermediates: AudioNode[]
  intervals: ReturnType<typeof setInterval>[]
}

interface Layer {
  type: SoundType | null
  gainNode: GainNode
  nodes: LayerNodes
}

function emptyLayerNodes(): LayerNodes {
  return { bufferSources: [], oscillators: [], intermediates: [], intervals: [] }
}

export class TinniAudioEngine {
  readonly ctx: AudioContext
  readonly analyser: AnalyserNode
  private masterGain: GainNode
  private premixGain: GainNode
  private notchFilter: BiquadFilterNode | null = null
  private layers: [Layer, Layer, Layer]

  constructor(notchHz?: number) {
    this.ctx = new AudioContext()

    // Destination chain (built back-to-front)
    this.analyser = this.ctx.createAnalyser()
    this.analyser.fftSize = 1024
    this.analyser.smoothingTimeConstant = 0.85
    this.analyser.connect(this.ctx.destination)

    this.masterGain = this.ctx.createGain()
    this.masterGain.gain.value = 0.85
    this.masterGain.connect(this.analyser)

    this.premixGain = this.ctx.createGain()
    this.premixGain.gain.value = 1

    if (notchHz && notchHz > 0) {
      this.notchFilter = this.ctx.createBiquadFilter()
      this.notchFilter.type = "notch"
      this.notchFilter.frequency.value = notchHz
      this.notchFilter.Q.value = 10
      this.premixGain.connect(this.notchFilter)
      this.notchFilter.connect(this.masterGain)
    } else {
      this.premixGain.connect(this.masterGain)
    }

    // Three layer gain nodes, all feeding premix
    this.layers = [0, 1, 2].map(() => {
      const g = this.ctx.createGain()
      g.gain.value = 0
      g.connect(this.premixGain)
      return { type: null, gainNode: g, nodes: emptyLayerNodes() }
    }) as [Layer, Layer, Layer]
  }

  // ─── Noise buffer synthesis ───────────────────────────────────────────────

  private makeNoiseBuffer(type: "white" | "pink" | "brown"): AudioBuffer {
    const rate = this.ctx.sampleRate
    const len = rate * 4
    const buf = this.ctx.createBuffer(1, len, rate)
    const d = buf.getChannelData(0)

    if (type === "white") {
      for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1
    } else if (type === "pink") {
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0
      for (let i = 0; i < len; i++) {
        const w = Math.random() * 2 - 1
        b0 = 0.99886 * b0 + w * 0.0555179
        b1 = 0.99332 * b1 + w * 0.0750759
        b2 = 0.96900 * b2 + w * 0.1538520
        b3 = 0.86650 * b3 + w * 0.3104856
        b4 = 0.55000 * b4 + w * 0.5329522
        b5 = -0.7616 * b5 - w * 0.0168980
        d[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + w * 0.5362) * 0.11
        b6 = w * 0.115926
      }
    } else {
      // brown
      let last = 0
      for (let i = 0; i < len; i++) {
        const w = Math.random() * 2 - 1
        last = (last + 0.02 * w) / 1.02
        d[i] = last * 3.5
      }
    }
    return buf
  }

  private makeBufferSource(type: "white" | "pink" | "brown"): AudioBufferSourceNode {
    const src = this.ctx.createBufferSource()
    src.buffer = this.makeNoiseBuffer(type)
    src.loop = true
    return src
  }

  // ─── Layer sound builders ─────────────────────────────────────────────────

  private buildNoise(
    type: "white" | "pink" | "brown",
    dest: AudioNode,
    nodes: LayerNodes
  ) {
    const src = this.makeBufferSource(type)
    src.connect(dest)
    src.start()
    nodes.bufferSources.push(src)
  }

  private buildRain(dest: AudioNode, nodes: LayerNodes) {
    const src = this.makeBufferSource("white")

    const hp = this.ctx.createBiquadFilter()
    hp.type = "highpass"
    hp.frequency.value = 1200

    const peak = this.ctx.createBiquadFilter()
    peak.type = "peaking"
    peak.frequency.value = 2800
    peak.Q.value = 1.2
    peak.gain.value = 7

    // Slow amplitude LFO for natural rain variation
    const modGain = this.ctx.createGain()
    modGain.gain.value = 0.75
    const lfo = this.ctx.createOscillator()
    lfo.type = "sine"
    lfo.frequency.value = 0.07
    const lfoAmt = this.ctx.createGain()
    lfoAmt.gain.value = 0.25
    lfo.connect(lfoAmt)
    lfoAmt.connect(modGain.gain)

    src.connect(hp)
    hp.connect(peak)
    peak.connect(modGain)
    modGain.connect(dest)

    src.start()
    lfo.start()
    nodes.bufferSources.push(src)
    nodes.oscillators.push(lfo)
    nodes.intermediates.push(hp, peak, modGain, lfoAmt)
  }

  private buildOcean(dest: AudioNode, nodes: LayerNodes) {
    // Layer 1: deep brown rumble
    const rumbleSrc = this.makeBufferSource("brown")
    const lp = this.ctx.createBiquadFilter()
    lp.type = "lowpass"
    lp.frequency.value = 350
    rumbleSrc.connect(lp)
    lp.connect(dest)
    rumbleSrc.start()

    // Layer 2: mid-range pink with slow wave LFO
    const waveSrc = this.makeBufferSource("pink")
    const bp = this.ctx.createBiquadFilter()
    bp.type = "bandpass"
    bp.frequency.value = 700
    bp.Q.value = 0.7

    const waveGain = this.ctx.createGain()
    waveGain.gain.value = 0.5

    const lfo = this.ctx.createOscillator()
    lfo.type = "sine"
    lfo.frequency.value = 0.1 // ~10 second wave
    const lfoAmt = this.ctx.createGain()
    lfoAmt.gain.value = 0.45
    lfo.connect(lfoAmt)
    lfoAmt.connect(waveGain.gain)

    waveSrc.connect(bp)
    bp.connect(waveGain)
    waveGain.connect(dest)

    waveSrc.start()
    lfo.start()

    nodes.bufferSources.push(rumbleSrc, waveSrc)
    nodes.oscillators.push(lfo)
    nodes.intermediates.push(lp, bp, waveGain, lfoAmt)
  }

  private buildFractal(dest: AudioNode, nodes: LayerNodes) {
    // 4 detuned sine oscillators with slow pitch drift
    const BASE_FREQS = [130, 196, 261, 392]

    BASE_FREQS.forEach((base) => {
      const osc = this.ctx.createOscillator()
      osc.type = "sine"
      osc.frequency.value = base + (Math.random() - 0.5) * 4

      const oscGain = this.ctx.createGain()
      oscGain.gain.value = 0.08

      // Amplitude LFO (each oscillator breathes independently)
      const lfo = this.ctx.createOscillator()
      lfo.type = "sine"
      lfo.frequency.value = 0.04 + Math.random() * 0.04
      const lfoAmt = this.ctx.createGain()
      lfoAmt.gain.value = 0.04
      lfo.connect(lfoAmt)
      lfoAmt.connect(oscGain.gain)

      osc.connect(oscGain)
      oscGain.connect(dest)
      osc.start()
      lfo.start()

      // Drift pitch every 4–8 seconds
      const id = setInterval(() => {
        const drift = base + (Math.random() - 0.5) * 18
        osc.frequency.setTargetAtTime(drift, this.ctx.currentTime, 2.5)
      }, 4000 + Math.random() * 4000)

      nodes.oscillators.push(osc, lfo)
      nodes.intermediates.push(oscGain, lfoAmt)
      nodes.intervals.push(id)
    })
  }

  private buildBinaural(beatHz: number, dest: AudioNode, nodes: LayerNodes) {
    // True binaural: left channel = carrier, right = carrier + beatHz
    const carrier = 200
    const merger = this.ctx.createChannelMerger(2)
    merger.connect(dest)

    const makeOsc = (freq: number, channel: 0 | 1) => {
      const osc = this.ctx.createOscillator()
      osc.type = "sine"
      osc.frequency.value = freq
      const g = this.ctx.createGain()
      g.gain.value = 0.35
      osc.connect(g)
      g.connect(merger, 0, channel)
      osc.start()
      nodes.oscillators.push(osc)
      nodes.intermediates.push(g)
    }

    makeOsc(carrier, 0)
    makeOsc(carrier + beatHz, 1)
    nodes.intermediates.push(merger)
  }

  // ─── Public layer API ─────────────────────────────────────────────────────

  setLayer(index: 0 | 1 | 2, type: SoundType | null, targetVolume: number) {
    const layer = this.layers[index]
    const now = this.ctx.currentTime

    // Fade out existing gain
    layer.gainNode.gain.setTargetAtTime(0, now, 0.15)

    // Stop all existing nodes after fade
    const old = layer.nodes
    setTimeout(() => {
      old.intervals.forEach(clearInterval)
      old.oscillators.forEach((o) => { try { o.stop(); o.disconnect() } catch {} })
      old.bufferSources.forEach((s) => { try { s.stop(); s.disconnect() } catch {} })
      old.intermediates.forEach((n) => { try { n.disconnect() } catch {} })
    }, 300)

    layer.type = type
    layer.nodes = emptyLayerNodes()

    if (!type) return

    if (this.ctx.state === "suspended") this.ctx.resume()

    // Build new sound
    const target = layer.gainNode
    switch (type) {
      case "white":
      case "pink":
      case "brown":
        this.buildNoise(type, target, layer.nodes)
        break
      case "rain":
        this.buildRain(target, layer.nodes)
        break
      case "ocean":
        this.buildOcean(target, layer.nodes)
        break
      case "fractal":
        this.buildFractal(target, layer.nodes)
        break
      case "binaural-alpha":
        this.buildBinaural(10, target, layer.nodes)
        break
      case "binaural-theta":
        this.buildBinaural(6, target, layer.nodes)
        break
    }

    // Fade in new gain
    layer.gainNode.gain.setValueAtTime(0, this.ctx.currentTime)
    layer.gainNode.gain.setTargetAtTime(targetVolume, this.ctx.currentTime + 0.1, 0.3)
  }

  setLayerVolume(index: 0 | 1 | 2, volume: number) {
    const layer = this.layers[index]
    if (layer.type) {
      layer.gainNode.gain.setTargetAtTime(volume, this.ctx.currentTime, 0.05)
    }
  }

  getLayerType(index: 0 | 1 | 2): SoundType | null {
    return this.layers[index].type
  }

  // ─── Master controls ──────────────────────────────────────────────────────

  setMasterVolume(vol: number) {
    this.masterGain.gain.setTargetAtTime(vol, this.ctx.currentTime, 0.05)
  }

  fadeIn(durationSec: number) {
    if (this.ctx.state === "suspended") this.ctx.resume()
    this.masterGain.gain.setValueAtTime(0, this.ctx.currentTime)
    this.masterGain.gain.linearRampToValueAtTime(0.85, this.ctx.currentTime + durationSec)
  }

  fadeOut(durationSec: number, onDone?: () => void) {
    this.masterGain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + durationSec)
    if (onDone) setTimeout(onDone, durationSec * 1000)
  }

  suspend() {
    this.ctx.suspend()
  }

  resume() {
    this.ctx.resume()
  }

  destroy() {
    this.layers.forEach((_, i) => this.setLayer(i as 0 | 1 | 2, null, 0))
    setTimeout(() => this.ctx.close(), 500)
  }

  // ─── Analyser data ────────────────────────────────────────────────────────

  getFrequencyData(): Uint8Array {
    const data = new Uint8Array(this.analyser.frequencyBinCount)
    this.analyser.getByteFrequencyData(data)
    return data
  }

  getTimeData(): Uint8Array {
    const data = new Uint8Array(this.analyser.fftSize)
    this.analyser.getByteTimeDomainData(data)
    return data
  }
}
