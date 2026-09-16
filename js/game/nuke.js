// Handles 8-second slow-motion Nuke Missile Animation & 42-Second Reboot Timer
export class NukeSequence {
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
        </div>
      `;
      containerEl.appendChild(overlay);
  
      // 1. Start alarm flashing & launch immediately
      setTimeout(() => overlay.classList.add("launch"), 50);
  
      // 2. Explode after 8 seconds (8000ms drop)
      setTimeout(() => overlay.classList.add("explode"), 8050);
  
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
      
      const message = "Marvin was destroyed. However, Marvin's clone Marvin is now booting up...";
      let charIdx = 0;
  
      const typeInterval = setInterval(() => {
        textEl.textContent += message[charIdx];
        charIdx++;
        if (charIdx >= message.length) {
          clearInterval(typeInterval);
          timerEl.classList.add("visible");
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
  