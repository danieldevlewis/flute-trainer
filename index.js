import { YIN } from "pitchfinder";

document.getElementById("start").addEventListener("click", () => {
  start();
});

async function start() {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

  const audioContext = new AudioContext();
  await audioContext.resume();

  const source = audioContext.createMediaStreamSource(stream);

  const analyser = audioContext.createAnalyser();
  analyser.fftSize = 2048; // buffer size you’ll read
  source.connect(analyser);

  // Use the real sample rate from the context
  const detect = YIN({ sampleRate: audioContext.sampleRate });

  const buffer = new Float32Array(analyser.fftSize);

  function tick() {
    analyser.getFloatTimeDomainData(buffer); // buffer now contains PCM samples [-1..1]
    const freq = detect(buffer); // Hz or null
    console.log(freq);

    if (freq) {
      //
      // do something with freq
      // console.log(freq);
    }

    requestAnimationFrame(tick);
  }

  tick();
}
