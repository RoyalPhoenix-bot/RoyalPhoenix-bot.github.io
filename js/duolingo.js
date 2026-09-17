async function initDuolingoStreak() {
    const streakEl = document.getElementById("duolingo-streak");
    if (!streakEl) return;
  
    try {
      const res = await fetch("./duolingo.json");
      if (!res.ok) throw new Error("Failed to load duolingo.json");
  
      const data = await res.json();
      
      // Handles both raw object output and primitive numbers
      const streakValue = typeof data.streak === "object" ? data.streak?.length : data.streak;
      
      streakEl.textContent = `${streakValue ?? "—"}d`;
    } catch (err) {
      console.error("Error reading streak:", err);
      streakEl.textContent = "—";
    }
  }
  