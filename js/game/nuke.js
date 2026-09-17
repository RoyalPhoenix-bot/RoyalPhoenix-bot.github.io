// Handles 8-second slow-motion Nuke Missile Animation & 42-Second Reboot Timer
export class NukeSequence {
  static audioCtx = null;

  static getAudioContext() {
    if (!this.audioCtx) {
      this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (this.audioCtx.state === "suspended") {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  // Pure Web Audio API Synthesizers (No external files required)
  static playDoomSound(durationSeconds = 8, maxVolume = 0.01) {
    const ctx = this.getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sawtooth";

    // Exponential pitch drop simulating an incoming missile whistle/siren
    osc.frequency.setValueAtTime(750, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + durationSeconds);

    // Fade-in at start, hold reduced volume, fade out right before impact
    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(maxVolume, ctx.currentTime + 0.5);
    gain.gain.setValueAtTime(maxVolume, ctx.currentTime + durationSeconds - 0.2);
    gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + durationSeconds);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + durationSeconds);
  }

  static playExplosionSound() {
    const ctx = this.getAudioContext();
    const duration = 2.5;
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    // Generate white noise burst
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    // Lowpass filter creates a deep, heavy bass boom
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(320, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(25, ctx.currentTime + duration);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(1.0, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    noise.start(ctx.currentTime);
  }

  static trigger(containerEl, onComplete) {
    const overlay = document.createElement("div");
    overlay.className = "nuke-overlay";
    overlay.innerHTML = `
      <div class="nuke-alarm-banner top">⚠️ WARNING: NUKING IN PROGRESS ⚠️</div>
      <div class="nuke-alarm-banner bottom">⚠️ WARNING: NUKING IN PROGRESS ⚠️</div>
      
      <div class="nuke-missile">🚀</div>
      <div class="nuke-flash"></div>
      <div class="nuke-smoke"></div>
      
      <div class="nuke-content">
        <p class="nuke-status-text"></p>
        <div class="reboot-timer">
          <span class="timer-number">42</span>s remaining...
        </div>
        <div class="nuke-dopamine-link" style="display: none; margin-top: 15px;">
          <p>Getting bored? Watch this <a href="https://youtu.be/dQw4w9WgXcQ" target="_blank" rel="noopener noreferrer" style="color: #ffd700; text-decoration: underline;">hilarious video</a> for extra dopamine ⚡</p>
        </div>
      </div>
    `;
    containerEl.appendChild(overlay);

    // 1. Launch missile & trigger 8-second descent sound
    setTimeout(() => {
      overlay.classList.add("launch");
      this.playDoomSound(8);
    }, 50);

    // 2. Explode after 8 seconds & trigger heavy blast sound
    setTimeout(() => {
      overlay.classList.add("explode");
      this.playExplosionSound();
    }, 8050);

    // 3. Clear smoke & show boot text after explosion settles
    setTimeout(() => {
      overlay.classList.add("smoke-cleared");
      this.startTypingAndTimer(overlay, onComplete);
    }, 9500);
  }

  static startTypingAndTimer(overlay, onComplete) {
    const textEl = overlay.querySelector(".nuke-status-text");
    const timerEl = overlay.querySelector(".reboot-timer");
    const numEl = overlay.querySelector(".timer-number");
    const dopamineLinkEl = overlay.querySelector(".nuke-dopamine-link");
    
    const message = "Marvin was destroyed. However, Marvin's clone, who's also called Marvin, is now booting up...";
    let charIdx = 0;

    const typeInterval = setInterval(() => {
      textEl.textContent += message[charIdx];
      charIdx++;
      if (charIdx >= message.length) {
        clearInterval(typeInterval);
        timerEl.classList.add("visible");
        if (dopamineLinkEl) dopamineLinkEl.style.display = "block";
        
        this.runCountdown(42, numEl, () => {
          overlay.remove();
          if (onComplete) onComplete();
        });
      }
    }, 35);
  }

  static runCountdown(seconds, displayEl, onEnd) {
    let timeLeft = seconds;
    const countdown = setInterval(() => {
      timeLeft--;
      displayEl.textContent = timeLeft;
      if (timeLeft <= 0) {
        clearInterval(countdown);
        onEnd();
      }
    }, 1000);
  }
}
