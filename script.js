const flames = document.querySelectorAll('.flame');
let blown = 0;

async function start() {
  try {
    await navigator.mediaDevices.getUserMedia({ audio: true });
    const audioCtx = new AudioContext();
    const analyser = audioCtx.createAnalyser();
    const source = audioCtx.createMediaStreamSource(
      await navigator.mediaDevices.getUserMedia({ audio: true })
    );
    source.connect(analyser);
    analyser.fftSize = 256;
    const data = new Uint8Array(analyser.frequencyBinCount);

    const blow = () => {
      analyser.getByteFrequencyData(data);
      const volume = data.reduce((a,b)=>a+b)/data.length;
      if (volume > 90 && blown < 3) {
        flames[blown].classList.add('extinguished');
        const smoke = document.createElement('div');
        smoke.classList.add('smoke');
        flames[blown].parentElement.appendChild(smoke);
        blown++;
        if (blown === 3) {
          setTimeout(()=>document.getElementById('wishMessage').classList.add('show'), 2000);
        }
      }
      requestAnimationFrame(blow);
    };
    blow();
  } catch(e) {
    console.log("Mic blocked – tap works instead");
  }
}

window.onload = () => setTimeout(start, 1000);

// Tap works perfectly on phone
flames.forEach((f,i) => {
  f.addEventListener('click', () => {
    if (blown === i) {
      f.classList.add('extinguished');
      blown++;
      if (blown===3) setTimeout(()=>document.getElementById('wishMessage').classList.add('show'),1500);
    }
  });
});
