const orb = document.querySelector(".orb");
const cursor = { x: innerWidth * 0.78, y: innerHeight * 0.22 };
const pos = { ...cursor };

window.addEventListener(
  "pointermove",
  (event) => {
    cursor.x = event.clientX;
    cursor.y = event.clientY;
    document.body.style.setProperty("--mx", `${event.clientX}px`);
    document.body.style.setProperty("--my", `${event.clientY}px`);
  },
  { passive: true }
);

function frame() {
  pos.x += (cursor.x - pos.x) * 0.08;
  pos.y += (cursor.y - pos.y) * 0.08;
  orb.style.transform = `translate(${pos.x}px, ${pos.y}px) translate(-50%, -50%)`;
  requestAnimationFrame(frame);
}

frame(); 
