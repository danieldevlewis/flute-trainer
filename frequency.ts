import { YIN } from "pitchfinder";

export const notes = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
];

function frequencyToNote(freq: number): string {
  const note = Math.round(12 * Math.log2(freq / 440) + 69);

  return `${notes[note % 12]}${Math.floor(note / 12) - 1}`;
}

export class Listener {
  #analyser!: AnalyserNode;
  #detect!: (array: Float32Array) => number | null;
  #buffer!: Float32Array<ArrayBuffer>;
  #timeout?: number;

  async start() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    const audioContext = new AudioContext();
    await audioContext.resume();

    const source = audioContext.createMediaStreamSource(stream);

    const biquadFilter = audioContext.createBiquadFilter();
    biquadFilter.type = "lowpass";
    biquadFilter.frequency.value = 1000;
    biquadFilter.Q.value = 5;

    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 2048; // buffer size you’ll read

    source.connect(biquadFilter);
    biquadFilter.connect(analyser);

    this.#detect = YIN({ sampleRate: audioContext.sampleRate });
    this.#buffer = new Float32Array(analyser.fftSize);
    this.#analyser = analyser;
  }

  async waitForNote(): Promise<string> {
    const { promise, resolve } = Promise.withResolvers<string>();
    this.#listen((note: string) => {
      resolve(note);
      return true;
    });
    return promise;
  }

  listen(callback: (note: string) => boolean) {
    this.#listen(callback);
  }

  #listen(callback: (note: string) => boolean) {
    this.#analyser.getFloatTimeDomainData(this.#buffer);

    const rms = Math.sqrt(
      this.#buffer.reduce((acc, val) => acc + val * val, 0) /
        this.#buffer.length,
    );

    if (rms > 0.001) {
      const freq = this.#detect(this.#buffer); // Hz or null
      if (freq && freq < 1200) {
        if (callback(frequencyToNote(freq))) {
          return;
        }
      }
    }

    window.requestAnimationFrame(() => this.#listen(callback));
  }
}
