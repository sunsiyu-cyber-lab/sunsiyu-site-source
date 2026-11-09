// 背景 B：蓝色光点 + 连线
particlesJS("particles-js", {
  particles: {
    number: { value: 55, density: { enable: true, value_area: 900 } },
    color: { value: "#7ee6ff" },
    shape: { type: "circle" },
    opacity: { value: 0.8 },
    size: { value: 3, random: true },
    line_linked: { enable: true, distance: 150, color: "#00c8ff", opacity: 0.35, width: 1 },
    move: { enable: true, speed: 1.2, out_mode: "out" }
  },
  interactivity: {
    events: { onhover: { enable: true, mode: "grab" }, resize: true },
    modes: { grab: { distance: 160, line_linked: { opacity: 0.6 } } }
  },
  retina_detect: true
});