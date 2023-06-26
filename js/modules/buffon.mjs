const TIMEOUT = 60000;

const randomFloat = (min, max) => Math.random() * (max - min) + min;

export function buffonNeedle(n) {
  let cuts, angle, x, isTimeout;
  cuts = 0;

  const startTime = Date.now();

  for (let i = 0; i < n; i++) {
    angle = randomFloat(-Math.PI / 2, Math.PI / 2);
    x = randomFloat(0, 1);
    if (1 - Math.cos(angle) < x) {
      cuts++;
    }
    if (Date.now() > startTime + TIMEOUT) {
      isTimeout = true;
      n = i;
      break;
    }
  }

  const prob = cuts / n;
  return [
    prob,
    2 / prob,
    isTimeout ? `Timeout. Se realizaron ${n} lanzamientos.` : null,
  ];
}
