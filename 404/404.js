/* frame/film — 404.js */

const shutter = document.querySelector('.nf-shutter');

shutter.addEventListener('click', () => {
  shutter.querySelectorAll('.shutter-blade').forEach((blade, i) => {
    blade.style.transform = `rotate(${i * 60}deg) scale(0.1)`;
    blade.style.opacity   = '0';
  });

  setTimeout(() => {
    shutter.querySelectorAll('.shutter-blade').forEach((blade, i) => {
      blade.style.transform = `rotate(${i * 60}deg) scale(1)`;
      blade.style.opacity   = '1';
    });
  }, 380);
});

// Subtle parallax
const bigNum = document.querySelector('.nf-big');

document.addEventListener('mousemove', e => {
  const x = (e.clientX / window.innerWidth  - 0.5) * 18;
  const y = (e.clientY / window.innerHeight - 0.5) * 18;
  if (bigNum)  bigNum.style.transform  = `translate(${x * 0.5}px, ${y * 0.5}px)`;
  if (shutter) shutter.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
});
