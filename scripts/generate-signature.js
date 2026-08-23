const fs = require('fs');
const path = require('path');

const quotes = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'quotes.json'), 'utf8'));

function escapeXml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function wrapText(text, maxCharsPerLine) {
  const words = text.split(' ');
  const lines = [];
  let current = '';
  for (const word of words) {
    const next = current ? current + ' ' + word : word;
    if (next.length > maxCharsPerLine && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }
  if (current) lines.push(current);
  return lines;
}

const quote = quotes[Math.floor(Math.random() * quotes.length)];
const lines = wrapText(quote.tr, 46);

const width = 720;
const lineHeight = 30;
const topPadding = 78;
const textBlockHeight = lines.length * lineHeight;
const height = topPadding + textBlockHeight + 46;

const textLines = lines
  .map((line, i) => `<text x="40" y="${topPadding + i * lineHeight}" font-family="Georgia, 'Times New Roman', serif" font-size="22" font-weight="600" fill="#e8ecf5">${escapeXml(line)}</text>`)
  .join('\n  ');

const svg = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="border" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f6dd8c"/>
      <stop offset="45%" stop-color="#c9962f"/>
      <stop offset="100%" stop-color="#8a6a1e"/>
    </linearGradient>
    <radialGradient id="glow" cx="15%" cy="20%" r="70%">
      <stop offset="0%" stop-color="#4f8cff" stop-opacity="0.16"/>
      <stop offset="100%" stop-color="#4f8cff" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect x="1" y="1" width="${width - 2}" height="${height - 2}" rx="14" fill="#05070d"/>
  <rect x="1" y="1" width="${width - 2}" height="${height - 2}" rx="14" fill="url(#glow)"/>
  <rect x="1" y="1" width="${width - 2}" height="${height - 2}" rx="14" fill="none" stroke="url(#border)" stroke-width="1.4"/>
  <rect x="0" y="24" width="4" height="${height - 48}" rx="2" fill="url(#border)"/>
  <text x="40" y="42" font-family="Verdana, sans-serif" font-size="11" letter-spacing="2" fill="#d4af37">SIGNATURE</text>
  ${textLines}
  <text x="40" y="${height - 20}" font-family="Verdana, sans-serif" font-size="13" fill="#5a6278">&#8212; ${escapeXml(quote.src)}</text>
</svg>
`;

fs.writeFileSync(path.join(__dirname, '..', 'signature.svg'), svg, 'utf8');
console.log('signature.svg generated:', quote.tr);
