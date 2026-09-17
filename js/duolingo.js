async function initDuolingoStreak() {
    const streakEl = document.getElementById("duolingo-streak");
    if (!streakEl) return;
  
    try {
      const res = await fetch("./duolingo.json");
      if (!res.ok) throw new Error("Failed to load duolingo.json");
  
      const data = await res.json();
      streakEl.textContent = `${data.streak ?? "—"}d`;
    } catch (err) {
      console.error("Error reading streak:", err);
      streakEl.textContent = "—";
    }
  }