const orb = document.querySelector(".orb");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (orb && !prefersReducedMotion) {
  window.addEventListener("pointermove", (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 40;
    const y = (e.clientY / window.innerHeight - 0.5) * 40;
    orb.style.transform = `translate(${x}px, ${y}px)`;
  });
}
