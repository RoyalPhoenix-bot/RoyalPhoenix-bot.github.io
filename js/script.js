// js/script.js — Shared across every page.
// Moves the ambient .orb glow slightly as the pointer moves, purely
// decorative. Does nothing (and adds no listener) if the visitor has
// "prefers-reduced-motion" enabled.

const orb = document.querySelector(".orb");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (orb && !prefersReducedMotion) {
  window.addEventListener("pointermove", (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 40;
    const y = (e.clientY / window.innerHeight - 0.5) * 40;
    orb.style.transform = `translate(${x}px, ${y}px)`;
  });
}
