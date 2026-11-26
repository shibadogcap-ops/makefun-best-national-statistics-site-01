/* Nippon Data Atlas — page renderers.
   Each view returns an HTML string for <main id="app">. */

import {
  SITE, HEADLINE, SERIES, AGE_GROUPS, ENERGY_MIX, PREFECTURES, TOPICS,
} from './data.js';
import { PALETTE, lineChart, barChart, hbarChart, donutChart } from './charts.js';

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// ---------- small helpers ----------

// "Source: X, Year" — the .src line carries an explicit "Source: " prefix.
function srcLine(fig) {
  const bits = [fig.source];
  if (fig.year) bits.push(String(fig.year));
  return `<p class="src">Source: ${esc(bits.join(', '))}</p>`;
}

function figCard(fig) {
  return `<div class="fig">
    <span class="fig-label">${esc(fig.label)}</span>
    <span class="fig-value">${esc(fig.value)}</span>
    <p class="fig-detail">${esc(fig.detail)}</p>
    ${srcLine(fig)}
  </div>`;
}

function figsGrid(figures) {
  return `<div class="figs">${figures.map(figCard).join('')}</div>`;
}

function panel(title, note, inner, extra = '') {
  return `<section class="panel">
    <h2 class="panel-title">${esc(title)}</h2>
    ${note ? `<p class="panel-note">${esc(note)}</p>` : ''}
    ${inner}
    ${extra}
  </section>`;
}

function chartPanel(title, note, chartHtml, src, extra = '') {
  return panel(
    title,
    note,
    `<div class="chart-wrap">${chartHtml}</div>
     ${src ? `<p class="src">Source: ${esc(src.source + (src.year ? ', ' + src.year : ''))}</p>` : ''}
     ${extra}`,
  );
}

function sourcesList(figs, extra = []) {
  const seen = new Map();
  for (const f of [...figs, ...extra]) {
    if (!f || !f.source) continue;
    const key = f.source + '|' + (f.year ?? '');
    if (!seen.has(key)) seen.set(key, `${f.source}${f.year ? `, ${f.year}` : ''}`);
  }
  const items = [...seen.values()];
  return `<section class="panel">
    <h2 class="panel-title">Sources</h2>
    <p class="panel-note">Every figure on this page, with the agency that published it and the reference year.</p>
    <ul class="sources">${items.map(s => `<li>${esc(s)}</li>`).join('')}</ul>
  </section>`;
}

// Attribution objects for chart series (mirror the figure objects in data.js).
const SRC_POP = { source: 'Statistics Bureau, Population Estimates', year: 2024 };
const SRC_POP_PEAK = { source: 'Statistics Bureau', year: 2008 };
const SRC_BIRTHS = { source: 'Ministry of Health, Labour and Welfare, Vital Statistics', year: 2024 };
const SRC_FERTILITY = { source: 'Ministry of Health, Labour and Welfare', year: 2024 };
const SRC_GDP = { source: 'Cabinet Office', year: 2024 };
const SRC_UNEMPLOYMENT = { source: 'Statistics Bureau, Labour Force Survey', year: 2024 };
const SRC_CPI = { source: 'Statistics Bureau, Consumer Price Index', year: 2024 };
const SRC_ENERGY = { source: 'Agency for Natural Resources and Energy', year: 2023 };
const SRC_PREFS = { source: 'Statistics Bureau, Population Estimates', year: 2024 };

const pct = (v) => `${v}%`;
const fmtMillions = (v) => `${v} million`;

// ---------- views ----------

function overview() {
  const households = TOPICS.population.find(f => f.label === 'Households');
  const cards = HEADLINE.map(h => `<div class="card">
    <span class="card-label">${esc(h.label)}</span>
    <span class="card-value">${esc(h.value)}</span>
    <p class="card-detail">${esc(h.detail)}</p>
    ${srcLine(h)}
  </div>`).join('');

  const popChart = lineChart(SERIES.populationMillions, {
    label: 'Japan’s total population, 2000–2024',
    formatY: fmtMillions,
    color: PALETTE[0],
  });
  const agingChart = lineChart(SERIES.agingRate, {
    label: 'Share of Japan’s population aged 65 and over',
    formatY: pct,
    color: PALETTE[1],
  });

  const inside = `<div class="chart-legend" style="margin-bottom:1rem">
    <span><a href="#/population">Population</a> — age structure, births, fertility and the 2025 census.</span>
    <span><a href="#/economy">Economy</a> — GDP, prices, employment, trade and visitors.</span>
    <span><a href="#/society">Society &amp; Energy</a> — households, education and the power mix.</span>
    <span><a href="#/regions">Regions</a> — all 47 prefectures ranked and mapped by the numbers.</span>
  </div>`;

  return `
  <div class="hero">
    <h1>${esc(SITE.name)}</h1>
    <p class="lede">${esc(SITE.tagline)} Japan is the world’s fourth-largest economy and one of
      its oldest societies — and its official statistics tell a sharply defined story: a
      population that has shrunk for fourteen straight years,
      births at a record low, and more than one in four residents aged 65 or over.
      Every figure below names its source and year. The headline is the
      <strong>2025 Population Census</strong>, which counted <strong>${esc(households.value)} households</strong> —
      a record — while the population kept falling.</p>
  </div>
  <div class="cards">${cards}</div>
  ${chartPanel(
    'The rise and fall of Japan’s population',
    'Total population in millions from 2000 to 2024: census counts through 2020, official estimates after.',
    popChart, SRC_POP,
  )}
  ${chartPanel(
    'A society growing older',
    'The share of the population aged 65 and over has climbed from 17.4% in 2000 to 29.3% in 2024.',
    agingChart, SRC_POP,
  )}
  ${panel('What’s inside the atlas', 'Four sections, each built only from published official statistics.', inside)}
  ${sourcesList(HEADLINE, [
    TOPICS.population.find(f => f.label === 'Households'),
    { source: 'Statistics Bureau, Population Estimates', year: 2024 },
    SRC_POP_PEAK,
  ])}
  `;
}

function population() {
  const figs = [
    ...TOPICS.population,
  ];
  const ageItems = AGE_GROUPS.map(g => ({
    label: g.label,
    value: g.population,
    display: `${(g.population / 1e6).toFixed(1)}M · ${g.share}%`,
  }));

  const birthsChart = lineChart(SERIES.births, {
    label: 'Live births in Japan per year, 2014–2024',
    formatY: v => Math.round(v).toLocaleString('en-US'),
    color: PALETTE[1],
  });
  const fertilityChart = lineChart(SERIES.fertilityRate, {
    label: 'Japan’s total fertility rate, 2014–2024',
    formatY: v => String(v),
    color: PALETTE[3],
  });
  const agingChart = lineChart(SERIES.agingRate, {
    label: 'Share of Japan’s population aged 65 and over, 2000–2024',
    formatY: pct,
    color: PALETTE[1],
  });

  return `
  ${chartPanel(
    'Age structure',
    'Japan’s population by broad age group, October 2024 — nearly three in ten residents are 65 or older.',
    hbarChart(ageItems, { label: 'Population by age group', max: 80000000 }),
    SRC_POP,
    `<p class="chart-caption">Shares are of the total population; the 75-and-over group sits inside the 65-and-over group.</p>`,
  )}
  ${panel(
    'Births and fertility',
    'Live births have fallen below 700,000 for the first time since records began in 1899, and the fertility rate is at a record low.',
    `<div class="chart-wrap">${birthsChart}</div>
     <p class="chart-caption">Live births per year, 2014–2024.</p>`,
  )}
  ${panel(
    'Fertility rate',
    'The total fertility rate — the average number of children a woman is expected to have — keeps setting record lows.',
    `<div class="chart-wrap">${fertilityChart}</div>
     <p class="chart-caption">Total fertility rate, 2014–2024.</p>`,
  )}
  ${chartPanel(
    'The aging share',
    'The share of residents aged 65 and over, from 2000 to 2024.',
    agingChart, SRC_POP,
  )}
  ${figsGrid(figs)}
  ${sourcesList(figs, [SRC_POP, SRC_BIRTHS, SRC_FERTILITY, SRC_POP_PEAK])}
  `;
}

function economy() {
  const figs = TOPICS.economy;

  const gdpChart = lineChart(SERIES.nominalGdp, {
    label: 'Japan’s nominal GDP in trillion yen',
    formatY: v => `¥${v}T`,
    color: PALETTE[0],
  });
  const unempChart = lineChart(SERIES.unemploymentRate, {
    label: 'Japan’s unemployment rate, 2019–2024',
    formatY: pct,
    color: PALETTE[3],
  });
  const cpiItems = SERIES.cpiChange.map(([y, v]) => ({
    label: String(y),
    value: v,
    display: `${v > 0 ? '+' : ''}${v}%`,
  }));
  const cpiChart = barChart(cpiItems, {
    label: 'Japan’s CPI all-items change by year, percent',
    format: v => `${v > 0 ? '+' : ''}${v}%`,
  });

  return `
  ${chartPanel(
    'Nominal GDP',
    'Japan’s nominal GDP in trillion yen — above ¥600 trillion for the first time in 2024.',
    gdpChart, SRC_GDP,
  )}
  ${chartPanel(
    'Unemployment',
    'The unemployment rate has stayed near historic lows, averaging 2.5% in 2024.',
    unempChart, SRC_UNEMPLOYMENT,
  )}
  ${chartPanel(
    'Consumer prices',
    'Year-on-year change in the all-items CPI — prices have risen every year since 2021.',
    cpiChart, SRC_CPI,
  )}
  ${figsGrid(figs)}
  ${sourcesList(figs, [SRC_GDP, SRC_UNEMPLOYMENT, SRC_CPI])}
  `;
}

function society() {
  const figs = TOPICS.society;

  const energyParts = ENERGY_MIX.map(e => ({
    label: e.label,
    value: e.share,
    color: e.label === 'Thermal' ? PALETTE[1] : e.label === 'Renewables' ? PALETTE[3] : PALETTE[5],
  }));
  const donut = donutChart(energyParts, {
    label: 'Japan’s electricity generation mix, fiscal 2023',
    centerSub: '% of generation',
    centerText: '100',
  });
  const legend = ENERGY_MIX.map((e, i) => {
    const color = energyParts[i].color;
    return `<span style="color:${color}"><strong>${esc(e.label)}</strong> — ${e.share}% of generation</span>`;
  }).join('');

  const thermalItems = ENERGY_MIX[0].children.map(c => ({
    label: c.label,
    value: c.share,
    display: `${c.share}%`,
  }));
  const renewablesItems = ENERGY_MIX[1].children.map(c => ({
    label: c.label,
    value: c.share,
    display: `${c.share}%`,
  }));

  return `
  ${figsGrid(figs)}
  ${panel(
    'Where Japan’s electricity comes from',
    'Electricity generation mix for fiscal 2023 — thermal power still dominates, with renewables growing.',
    `<div class="chart-legend">${legend}</div>
     <div class="chart-wrap">${donut}</div>`,
  )}
  ${chartPanel(
    'Inside the thermal share',
    'Of the 68.6% of generation that is thermal, LNG is the largest single fuel and coal the second.',
    hbarChart(thermalItems, { label: 'Thermal generation by fuel', max: 40 }),
    SRC_ENERGY,
    `<p class="chart-caption">Percent of total generation; LNG, coal and oil-and-others sum to the 68.6% thermal share.</p>`,
  )}
  ${chartPanel(
    'Inside the renewable share',
    'Of the 22.9% of generation that is renewable, solar and hydro lead.',
    hbarChart(renewablesItems, { label: 'Renewable generation by source', max: 12 }),
    SRC_ENERGY,
    `<p class="chart-caption">Percent of total generation; the five sources sum to the 22.9% renewable share.</p>`,
  )}
  ${sourcesList(figs, [SRC_ENERGY])}
  `;
}

function regions(sortKey = 'population') {
  const sortBy = sortKey === 'aging' ? 'aging' : 'population';
  const rows = [...PREFECTURES].sort((a, b) => {
    if (sortBy === 'aging') {
      if (a.agingRate === null && b.agingRate === null) return a.name.localeCompare(b.name);
      if (a.agingRate === null) return 1;
      if (b.agingRate === null) return -1;
      return b.agingRate - a.agingRate;
    }
    if (a.population === null && b.population === null) return a.name.localeCompare(b.name);
    if (a.population === null) return 1;
    if (b.population === null) return -1;
    return b.population - a.population;
  });

  const tokyoPop = PREFECTURES.find(p => p.name === 'Tokyo').population;
  const bodyRows = rows.map(p => {
    const popCell = p.population === null
      ? '<td class="num">—</td>'
      : `<td class="num">${p.population.toLocaleString('en-US')}<br><span class="meter"><span class="meter-fill" style="width:${(p.population / tokyoPop) * 100}%"></span></span></td>`;
    const agingCell = p.agingRate === null ? '<td class="num">—</td>' : `<td class="num">${p.agingRate}%</td>`;
    return `<tr><td>${esc(p.name)}</td>${popCell}${agingCell}</tr>`;
  }).join('');

  const btn = (key, label) =>
    `<button class="toggle${sortBy === key ? ' active' : ''}" data-action="sort-${key}">${label}</button>`;

  const concentration = TOPICS.regions.slice(0, 2);
  const extremes = TOPICS.regions.slice(2, 4);

  return `
  ${panel(
    'A country concentrated in a few prefectures',
    'Japan’s population is heavily concentrated: the five largest prefectures hold over a third of the country, and in 2024 only Tokyo and Saitama grew.',
    figsGrid(concentration),
  )}
  <div class="btn-row">
    ${btn('population', 'Sort by population')}
    ${btn('aging', 'Sort by aging rate')}
  </div>
  <div class="panel">
    <h2 class="panel-title">Prefectures</h2>
    <p class="panel-note">Population in thousands (October 2024) with a bar scaled to Tokyo; share aged 65 and over where a figure is cited.</p>
    <div class="table-scroll">
      <table class="tbl">
        <thead><tr><th>Prefecture</th><th class="num">Population (thousands)</th><th class="num">Aged 65+</th></tr></thead>
        <tbody>${bodyRows}</tbody>
      </table>
    </div>
    <p class="src">Source: ${esc(SRC_PREFS.source + ', ' + SRC_PREFS.year)}</p>
  </div>
  ${panel(
    'The aging extremes',
    'Akita has the highest share of residents aged 65 and over; Tokyo has the lowest.',
    figsGrid(extremes),
  )}
  ${sourcesList([...concentration, ...extremes, SRC_PREFS])}
  `;
}

export const VIEWS = { overview, population, economy, society, regions };
