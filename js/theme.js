(function initTheme() {
    // Apply saved theme immediately to prevent flash of unstyled content
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light") {
      document.body.classList.add("light-mode");
    }
  
    document.addEventListener("DOMContentLoaded", () => {
      // --- 1. Theme Toggle Setup ---
      const toggleBtn = document.getElementById("theme-toggle");
      if (toggleBtn) {
        toggleBtn.textContent = document.body.classList.contains("light-mode") ? "☀️" : "🌙";
  
        toggleBtn.addEventListener("click", () => {
          document.body.classList.toggle("light-mode");
          const isLight = document.body.classList.contains("light-mode");
          localStorage.setItem("theme", isLight ? "light" : "dark");
          toggleBtn.textContent = isLight ? "☀️" : "🌙";
        });
      }
  
      // --- 2. Dynamic Active Navigation Link Fix ---
      const currentPath = window.location.pathname.replace(/\/$/, "") || "/index";
      document.querySelectorAll(".topnav-link").forEach((link) => {
        const href = link.getAttribute("href").replace(/\/$/, "");
        if (currentPath.endsWith(href) || (currentPath.endsWith("index") && href === "/index")) {
          link.classList.add("active");
        } else {
          link.classList.remove("active");
        }
      });
    });
  })();
  