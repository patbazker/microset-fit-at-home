import sharp from 'sharp';
import { writeFileSync } from 'fs';

const svg = (size, padded = false) => {
  const p = padded ? size * 0.15 : 0;
  const inner = size - 2 * p;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#ff5e3a"/>
      <stop offset="1" stop-color="#ffaa3a"/>
    </linearGradient>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#131922"/>
      <stop offset="1" stop-color="#0a0e14"/>
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${size * 0.22}" fill="url(#bg)"/>
  <g transform="translate(${p}, ${p})">
    <!-- Three rings -->
    <g transform="translate(${inner/2}, ${inner/2})">
      <circle r="${inner*0.36}" fill="none" stroke="#ff5e3a44" stroke-width="${inner*0.06}"/>
      <circle r="${inner*0.27}" fill="none" stroke="#3ad1ff44" stroke-width="${inner*0.06}"/>
      <circle r="${inner*0.18}" fill="none" stroke="#a06bff44" stroke-width="${inner*0.06}"/>
      <g transform="rotate(-90)">
        <circle r="${inner*0.36}" fill="none" stroke="#ff5e3a" stroke-width="${inner*0.06}" stroke-linecap="round"
                stroke-dasharray="${2*Math.PI*inner*0.36*0.75} ${2*Math.PI*inner*0.36}"/>
        <circle r="${inner*0.27}" fill="none" stroke="#3ad1ff" stroke-width="${inner*0.06}" stroke-linecap="round"
                stroke-dasharray="${2*Math.PI*inner*0.27*0.6} ${2*Math.PI*inner*0.27}"/>
        <circle r="${inner*0.18}" fill="none" stroke="#a06bff" stroke-width="${inner*0.06}" stroke-linecap="round"
                stroke-dasharray="${2*Math.PI*inner*0.18*0.85} ${2*Math.PI*inner*0.18}"/>
      </g>
    </g>
  </g>
</svg>`;
};

async function gen(size, name, padded = false) {
  const buf = Buffer.from(svg(size, padded));
  await sharp(buf).png().toFile(`public/${name}`);
  console.log(`✓ ${name}`);
}

writeFileSync('public/favicon.svg', svg(64, false));

await gen(192, 'icon-192.png');
await gen(512, 'icon-512.png');
await gen(512, 'icon-512-maskable.png', true);
console.log('Done.');
