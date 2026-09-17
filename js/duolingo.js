async function initDuolingoStreak() {
    const streakEl = document.getElementById("duolingo-streak");
    if (!streakEl) return;
  
    try {
      const res = await fetch("./duolingo.json");
      if (!res.ok) throw new Error("Failed to load duolingo.json");
  
      const data = await res.json();
      const streakValue = typeof data.streak === "object" ? data.streak?.length : data.streak;
  
      streakEl.textContent = streakValue ?? "—";
    } catch (err) {
      console.error("Error loading Duolingo streak:", err);
      streakEl.textContent = "—";
    }
  }
  
  document.addEventListener("DOMContentLoaded", initDuolingoStreak);
  