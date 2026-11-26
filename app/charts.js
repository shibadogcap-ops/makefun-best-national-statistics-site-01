/* Nippon Data Atlas — inline SVG chart helpers. Pure functions, no DOM, no deps. */

const PALETTE = [
  '#26355e', // indigo
  '#bf3b26', // vermillion
  '#e0a458', // amber
  '#6f8f5f', // moss
  '#7d6ba8', // plum
  '#4e8d8b', // teal
  '#c96a92', // rose
  '#a89a7e', // sand
];

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const r1 = (n) => Math.round(n * 10) / 10;

function svgOpen(w, h, label) {
  return `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(label)}">`;
}

// ---------- shared scale helpers ----------

function niceTicks(min, max, count = 4) {
  // Round step chosen from 1/2/5 × 10^n so ticks land on round values.
  if (!(max > min)) { const v = min || 0; return [v]; }
  const span = max - min;
  const rough = span / count;
  const mag = Math.pow(10, Math.floor(Math.log10(rough)));
  const norm = rough / mag;
  const step = (norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 5 ? 5 : 10) * mag;
  const lo = Math.floor(min / step) * step;
  const hi = Math.ceil(max / step) * step;
  const out = [];
  for (let v = lo; v <= hi + step / 1e9; v += step) out.push(v);
  return out;
}

function niceMax(max, count = 4) {
  if (!(max > 0)) return 1;
  const mag = Math.pow(10, Math.floor(Math.log10(max)));
  const norm = max / mag;
  const nice = norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 2.5 ? 2.5 : norm <= 5 ? 5 : 10;
  return nice * mag;
}

function fmtNum(v) {
  return Math.abs(v) >= 1000 ? String(Math.round(v).toLocaleString('en-US')) : r1(v);
}

// Pick indices for evenly spaced x-axis labels: first, last, and ~3 interior.
function xLabelIndices(n, max = 5) {
  if (n <= 1) return [0];
  const set = new Set([0, n - 1]);
  const inner = Math.min(max - 2, n - 2);
  for (let i = 1; i <= inner; i++) set.add(Math.round((i * (n - 1)) / (inner + 1)));
  return [...set].sort((a, b) => a - b);
}

// ---------- lineChart ----------

function lineChart(points, opts = {}) {
  const w = opts.w || 720, h = opts.h || 260;
  const padL = 52, padR = 14, padT = 16, padB = 30;
  const iw = w - padL - padR, ih = h - padT - padB;
  const pts = (points || []).filter(p => Array.isArray(p) && p.length >= 2 && isFinite(p[0]) && isFinite(p[1]));
  const formatX = opts.formatX || String;
  const formatY = opts.formatY || String;
  const color = opts.color || PALETTE[0];

  let body = `<rect x="0" y="0" width="${w}" height="${h}" fill="transparent"/>`;

  if (pts.length === 0) {
    return svgOpen(w, h, opts.label || 'Empty line chart') + '</svg>';
  }

  let ys = pts.map(p => p[1]);
  let yMin = Math.min(...ys), yMax = Math.max(...ys);
  if (yMin === yMax) { yMin -= 1; yMax += 1; } // flat series: still show a readable axis
  const ticks = niceTicks(yMin, yMax);
  yMin = Math.min(yMin, ticks[0]); yMax = Math.max(yMax, ticks[ticks.length - 1]);
  const yOf = v => padT + ih - ((v - yMin) / (yMax - yMin)) * ih;

  // Horizontal gridlines + y labels.
  for (const t of ticks) {
    const y = r1(yOf(t));
    body += `<line x1="${padL}" y1="${y}" x2="${w - padR}" y2="${y}" stroke="#e4dccb" stroke-width="1"/>`;
    body += `<text x="${padL - 8}" y="${r1(y + 3.5)}" text-anchor="end" font-size="10" fill="#8a7f6a">${esc(formatY(t))}</text>`;
  }

  // x labels for first, last and a few spaced points.
  const idxs = xLabelIndices(pts.length);
  for (const i of idxs) {
    const x = pts.length === 1 ? padL + iw / 2 : padL + (i / (pts.length - 1)) * iw;
    body += `<text x="${r1(x)}" y="${h - padB + 16}" text-anchor="middle" font-size="10" fill="#8a7f6a">${esc(formatX(pts[i][0]))}</text>`;
  }
  body += `<line x1="${padL}" y1="${h - padB}" x2="${w - padR}" y2="${h - padB}" stroke="#c9bfa8" stroke-width="1"/>`;

  // Position by index so non-uniform x spacing stays evenly distributed.
  const xOf = i => padL + (pts.length === 1 ? iw / 2 : (i / (pts.length - 1)) * iw);
  const yPx = pts.map(p => yOf(p[1]));

  if (pts.length === 1) {
    body += `<circle cx="${r1(xOf(0))}" cy="${r1(yPx[0])}" r="3.5" fill="${color}"/>`;
    body += `<text x="${r1(xOf(0) + 7)}" y="${r1(yPx[0] - 7)}" font-size="11" font-weight="600" fill="${color}">${esc(formatY(pts[0][1]))}</text>`;
    return svgOpen(w, h, opts.label || 'Line chart') + body + '</svg>';
  }

  const linePts = pts.map((_, i) => `${r1(xOf(i))},${r1(yPx[i])}`).join(' ');
  // Soft area fill under the line down to the bottom of the plot.
  const area = `${r1(xOf(0))},${h - padB} ${linePts} ${r1(xOf(pts.length - 1))},${h - padB}`;
  body += `<polygon points="${area}" fill="${color}" opacity="0.12"/>`;
  body += `<polyline points="${linePts}" fill="none" stroke="${color}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>`;

  // Endpoints.
  body += `<circle cx="${r1(xOf(0))}" cy="${r1(yPx[0])}" r="3" fill="${color}"/>`;
  body += `<circle cx="${r1(xOf(pts.length - 1))}" cy="${r1(yPx[pts.length - 1])}" r="3.5" fill="${color}"/>`;
  const lx = xOf(pts.length - 1), ly = yPx[pts.length - 1];
  body += `<text x="${r1(Math.min(lx, w - padR - 30))}" y="${r1(ly - 8)}" font-size="11" font-weight="600" fill="${color}">${esc(formatY(pts[pts.length - 1][1]))}</text>`;

  return svgOpen(w, h, opts.label || 'Line chart') + body + '</svg>';
}

// ---------- barChart (vertical, supports negatives) ----------

function barChart(items, opts = {}) {
  const w = opts.w || 720, h = opts.h || 260;
  const padL = 52, padR = 14, padT = 18, padB = 34;
  const iw = w - padL - padR, ih = h - padT - padB;
  const list = items || [];
  const format = opts.format || String;
  const color = opts.color || PALETTE[0];

  let body = '';
  if (list.length === 0) return svgOpen(w, h, opts.label || 'Empty bar chart') + '</svg>';

  const vals = list.map(d => d.value || 0);
  let vMin = Math.min(0, ...vals), vMax = Math.max(0, ...vals);
  if (vMin === vMax) vMax = vMin + 1;
  const ticks = niceTicks(vMin, vMax);
  vMin = Math.min(vMin, ticks[0]); vMax = Math.max(vMax, ticks[ticks.length - 1]);
  const yOf = v => padT + ih - ((v - vMin) / (vMax - vMin)) * ih;
  const yZero = yOf(0);

  for (const t of ticks) {
    const y = r1(yOf(t));
    body += `<line x1="${padL}" y1="${y}" x2="${w - padR}" y2="${y}" stroke="#e4dccb" stroke-width="1"/>`;
    body += `<text x="${padL - 8}" y="${r1(y + 3.5)}" text-anchor="end" font-size="10" fill="#8a7f6a">${esc(format(t))}</text>`;
  }

  const slot = iw / list.length;
  const bw = Math.min(slot * 0.62, 48);
  list.forEach((d, i) => {
    const cx = padL + slot * i + slot / 2;
    const y0 = yOf(Math.max(0, d.value || 0)), y1 = yOf(Math.min(0, d.value || 0));
    const top = Math.min(y0, y1), bh = Math.max(1, Math.abs(y0 - y1));
    body += `<rect x="${r1(cx - bw / 2)}" y="${r1(top)}" width="${r1(bw)}" height="${r1(bh)}" rx="2" fill="${color}"/>`;
    const vy = (d.value || 0) >= 0 ? top - 5 : top + bh + 12;
    body += `<text x="${r1(cx)}" y="${r1(vy)}" text-anchor="middle" font-size="10" fill="#5c5344">${esc(format(d.value))}</text>`;
    const label = String(d.label ?? '');
    const show = label.length > 14 ? label.slice(0, 13) + '…' : label;
    body += `<text x="${r1(cx)}" y="${h - padB + 16}" text-anchor="end" font-size="9.5" fill="#8a7f6a" transform="rotate(-28 ${r1(cx)} ${h - padB + 16})">${esc(show)}</text>`;
  });
  body += `<line x1="${padL}" y1="${r1(yZero)}" x2="${w - padR}" y2="${r1(yZero)}" stroke="#8a7f6a" stroke-width="1.2"/>`;
  body += `<line x1="${padL}" y1="${h - padB}" x2="${w - padR}" y2="${h - padB}" stroke="#c9bfa8" stroke-width="1"/>`;

  return svgOpen(w, h, opts.label || 'Bar chart') + body + '</svg>';
}

// ---------- hbarChart (horizontal, parts of a whole) ----------

function hbarChart(items, opts = {}) {
  const w = opts.w || 720, h = opts.h || 260;
  const padL = 110, padR = 56, padT = 14, padB = 10;
  const ih = h - padT - padB;
  const list = items || [];
  const labelOf = d => d.display ?? (opts.format ? opts.format(d.value) : String(d.value));

  let body = '';
  if (list.length === 0) return svgOpen(w, h, opts.label || 'Empty horizontal bar chart') + '</svg>';

  const maxV = Math.max(0, ...list.map(d => d.value || 0));
  const scale = opts.max && opts.max > 0 ? opts.max : (maxV || 1);
  const iw = w - padL - padR;
  const slot = ih / list.length;
  const bh = Math.min(slot * 0.58, 26);

  list.forEach((d, i) => {
    const cy = padT + slot * i + slot / 2;
    const bw = Math.max(1, ((d.value || 0) / scale) * iw);
    body += `<text x="${padL - 10}" y="${r1(cy + 3.5)}" text-anchor="end" font-size="10.5" fill="#3d372c">${esc(d.label)}</text>`;
    body += `<rect x="${padL}" y="${r1(cy - bh / 2)}" width="${r1(bw)}" height="${r1(bh)}" rx="2" fill="${d.color || PALETTE[i % PALETTE.length]}"/>`;
    body += `<text x="${r1(padL + bw + 7)}" y="${r1(cy + 3.5)}" font-size="10" fill="#5c5344">${esc(labelOf(d))}</text>`;
  });

  return svgOpen(w, h, opts.label || 'Horizontal bar chart') + body + '</svg>';
}

// ---------- donutChart ----------

function donutChart(parts, opts = {}) {
  const size = opts.size || 200;
  const cx = size / 2, cy = size / 2;
  const r = size / 2 - 8;
  const thick = opts.thickness || Math.max(16, r * 0.26);
  const list = (parts || []).filter(p => p && p.value > 0);
  const total = list.reduce((s, p) => s + p.value, 0);
  const center = opts.centerText ?? (total ? String(Math.round(total)) : '0');

  let body = `<circle cx="${cx}" cy="${cy}" r="${r - thick / 2}" fill="none" stroke="#efe8da" stroke-width="${thick}"/>`;
  if (total > 0) {
    const C = 2 * Math.PI * (r - thick / 2);
    let acc = 0;
    list.forEach(p => {
      const frac = p.value / total;
      const len = frac * C;
      // Dash offset starts at 12 o'clock and runs clockwise.
      body += `<circle cx="${cx}" cy="${cy}" r="${r - thick / 2}" fill="none" stroke="${p.color || PALETTE[0]}" stroke-width="${thick}" stroke-dasharray="${r1(len)} ${r1(C - len)}" stroke-dashoffset="${r1(-acc * C)}" transform="rotate(-90 ${cx} ${cy})"/>`;
      acc += frac;
    });
  }
  body += `<text x="${cx}" y="${cy - 2}" text-anchor="middle" font-size="22" font-weight="700" fill="#26355e">${esc(center)}</text>`;
  if (opts.centerSub) body += `<text x="${cx}" y="${cy + 16}" text-anchor="middle" font-size="10" fill="#8a7f6a">${esc(opts.centerSub)}</text>`;

  return `<svg viewBox="0 0 ${size} ${size}" role="img" aria-label="${esc(opts.label || 'Donut chart')}">${body}</svg>`;
}

export { PALETTE, lineChart, barChart, hbarChart, donutChart };
