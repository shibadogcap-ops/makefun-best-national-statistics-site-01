// Nippon Data Atlas — the site's only data file.
// All figures come from Japanese official statistics; every figure object
// carries its source and year so pages can print attribution.

export const SITE = {
  name: 'Nippon Data Atlas',
  tagline: 'Japan’s numbers, at a glance.',
  about:
    'This site draws on statistics published by Japanese government agencies — ' +
    'the Statistics Bureau, the Ministry of Health, Labour and Welfare, the ' +
    'Ministry of Internal Affairs and Communications, the Cabinet Office and ' +
    'others. Figures are used as officially published; sources and reference ' +
    'years are listed with each one.',
};

// Overview-page headline figures.
export const HEADLINE = [
  {
    label: 'Total population',
    value: '123.80 million',
    detail: 'Down 550,000 (0.44%) in a year — the 14th straight annual decline.',
    source: 'Statistics Bureau, Population Estimates',
    year: 2024,
  },
  {
    label: 'Share aged 65 and over',
    value: '29.3%',
    detail: 'Roughly one in three Japanese is now 65 or older.',
    source: 'Statistics Bureau, Population Estimates',
    year: 2024,
  },
  {
    label: 'Births per year',
    value: '686,061',
    detail: 'The first year below 700,000 since records began in 1899.',
    source: 'Ministry of Health, Labour and Welfare, Vital Statistics',
    year: 2024,
  },
  {
    label: 'Nominal GDP',
    value: '¥609.3 trillion',
    detail: 'Up 2.9%, above ¥600 trillion for the first time.',
    source: 'Cabinet Office',
    year: 2024,
  },
  {
    label: 'Unemployment rate',
    value: '2.5%',
    detail: 'The 2024 average, with employment at a record high.',
    source: 'Statistics Bureau, Labour Force Survey',
    year: 2024,
  },
  {
    label: 'Foreign residents',
    value: '3.77 million',
    detail: 'Up 10.5%, a record high for the third straight year.',
    source: 'Immigration Services Agency',
    year: 2024,
  },
];

// Named time series as [year, value] pairs.
export const SERIES = {
  // Total population in millions (census counts to 2020, estimates after).
  populationMillions: [
    [2000, 126.93],
    [2005, 127.77],
    [2010, 128.06],
    [2015, 127.09],
    [2020, 126.15],
    [2021, 125.5],
    [2022, 124.95],
    [2023, 124.35],
    [2024, 123.8],
  ],
  // Share aged 65 and over, percent.
  agingRate: [
    [2000, 17.4],
    [2005, 20.2],
    [2010, 23.0],
    [2015, 26.6],
    [2020, 28.6],
    [2024, 29.3],
  ],
  // Live births per year.
  births: [
    [2014, 1003539],
    [2015, 1005721],
    [2016, 976978],
    [2017, 946065],
    [2018, 918400],
    [2019, 865239],
    [2020, 840835],
    [2021, 811622],
    [2022, 770759],
    [2023, 727277],
    [2024, 686061],
  ],
  // Total fertility rate.
  fertilityRate: [
    [2014, 1.42],
    [2015, 1.45],
    [2016, 1.44],
    [2017, 1.43],
    [2018, 1.42],
    [2019, 1.36],
    [2020, 1.33],
    [2021, 1.3],
    [2022, 1.26],
    [2023, 1.2],
    [2024, 1.15],
  ],
  // Nominal GDP in trillion yen.
  nominalGdp: [
    [2000, 520.1],
    [2005, 503.9],
    [2010, 512.9],
    [2015, 532.6],
    [2020, 539.7],
    [2024, 609.3],
  ],
  // CPI all-items change, percent.
  cpiChange: [
    [2019, 0.5],
    [2020, 0.0],
    [2021, -0.2],
    [2022, 2.5],
    [2023, 3.2],
    [2024, 2.7],
  ],
  // Unemployment rate, percent.
  unemploymentRate: [
    [2019, 2.4],
    [2020, 2.8],
    [2021, 2.8],
    [2022, 2.6],
    [2023, 2.6],
    [2024, 2.5],
  ],
};

// Age structure of the population, October 2024.
export const AGE_GROUPS = [
  { label: 'Under 15', population: 13830000, share: 11.2 },
  { label: '15 to 64', population: 73728000, share: 59.6 },
  { label: '65 and over', population: 36243000, share: 29.3 },
  { label: '75 and over', population: 20777000, share: 16.8 },
];

// Electricity generation mix, fiscal 2023 (percent of total generation).
// Sub-sources sum into their parent categories.
export const ENERGY_MIX = [
  { label: 'Thermal', share: 68.6, children: [
    { label: 'LNG', share: 32.9 },
    { label: 'Coal', share: 28.5 },
    { label: 'Oil and others', share: 7.2 },
  ] },
  { label: 'Renewables', share: 22.9, children: [
    { label: 'Solar', share: 9.8 },
    { label: 'Hydro', share: 7.6 },
    { label: 'Biomass', share: 4.1 },
    { label: 'Wind', share: 1.1 },
    { label: 'Geothermal', share: 0.3 },
  ] },
  { label: 'Nuclear', share: 8.5 },
];

// Prefectures: population in thousands and share aged 65+, October 2024.
// agingRate is null where no figure is cited for that prefecture.
export const PREFECTURES = [
  { name: 'Tokyo', population: 14178, agingRate: 22.7 },
  { name: 'Kanagawa', population: 9225, agingRate: null },
  { name: 'Osaka', population: 8757, agingRate: null },
  { name: 'Aichi', population: 7460, agingRate: null },
  { name: 'Saitama', population: 7330, agingRate: null },
  { name: 'Chiba', population: 6250, agingRate: null },
  { name: 'Akita', population: 897, agingRate: 39.5 },
  { name: 'Fukui', population: 739, agingRate: null },
  { name: 'Tokushima', population: 685, agingRate: null },
  { name: 'Kochi', population: 656, agingRate: 36.6 },
  { name: 'Shimane', population: 642, agingRate: 35.2 },
  { name: 'Tottori', population: 531, agingRate: null },
  // Only aging rates were listed for these three prefectures.
  { name: 'Aomori', population: null, agingRate: 35.7 },
  { name: 'Yamagata', population: null, agingRate: 35.6 },
  { name: 'Iwate', population: null, agingRate: 35.4 },
];

// Figure objects for the topic section pages.
export const TOPICS = {
  population: [
    {
      label: 'Total population',
      value: '123,802,000',
      detail: 'Down 550,000 (0.44%) on the previous year — the 14th straight annual decline.',
      source: 'Statistics Bureau, Population Estimates',
      year: 2024,
    },
    {
      label: 'Japanese nationals',
      value: '120,296,000',
      detail: 'Down 898,000 — the largest drop since records began in 1950.',
      source: 'Statistics Bureau, Population Estimates',
      year: 2024,
    },
    {
      label: 'Population peak',
      value: '128.08 million',
      detail: 'The population peaked in 2008 and has fallen every year since.',
      source: 'Statistics Bureau',
      year: 2008,
    },
    {
      label: 'Aged 65 and over',
      value: '36,243,000 (29.3%)',
      detail: 'Includes 20,777,000 aged 75 and over (16.8%).',
      source: 'Statistics Bureau, Population Estimates',
      year: 2024,
    },
    {
      label: 'Life expectancy',
      value: '87.1 years (women), 81.1 years (men)',
      detail: 'Life expectancy at birth in 2023.',
      source: 'Ministry of Health, Labour and Welfare',
      year: 2023,
    },
    {
      label: 'Households',
      value: '57,324,619',
      detail: 'A record number in the 2025 census; one-person households are 41.4% of the total.',
      source: 'Statistics Bureau, Population Census',
      year: 2025,
    },
    {
      label: 'Foreign residents',
      value: '3,768,977',
      detail: 'Up 10.5%, a record high for the third straight year; permanent residents (918,116) are the largest status group.',
      source: 'Immigration Services Agency',
      year: 2024,
    },
    {
      label: 'Land area',
      value: '377,975 km²',
      detail: '14,125 islands counted in 2023; about 67% of the land is forest.',
      source: 'Geospatial Information Authority of Japan / Forestry Agency',
      year: 2023,
    },
  ],

  economy: [
    {
      label: 'Nominal GDP',
      value: '¥609.3 trillion',
      detail: 'Up 2.9%, above ¥600 trillion for the first time; real GDP grew 0.1%.',
      source: 'Cabinet Office',
      year: 2024,
    },
    {
      label: 'GDP in dollars',
      value: 'US$4.19 trillion',
      detail: 'The world’s fourth largest economy; GDP per capita was US$33,785.',
      source: 'Cabinet Office / World Bank',
      year: 2024,
    },
    {
      label: 'Exchange rate',
      value: '¥151.5 per US$',
      detail: 'The yen’s 2024 average against the dollar.',
      source: 'Ministry of Finance',
      year: 2024,
    },
    {
      label: 'Employed people',
      value: '67.81 million',
      detail: 'The most since comparable records began in 1953.',
      source: 'Statistics Bureau, Labour Force Survey',
      year: 2024,
    },
    {
      label: 'Consumer prices',
      value: '+2.7%',
      detail: 'All items rose 2.7% during 2024, the third straight year of increases.',
      source: 'Statistics Bureau, Consumer Price Index',
      year: 2024,
    },
    {
      label: 'Exports',
      value: '¥107.09 trillion',
      detail: 'Up 6.2% and a record high; exports to the US were ¥21.29 trillion (19.9%).',
      source: 'Ministry of Finance, Trade Statistics',
      year: 2024,
    },
    {
      label: 'Trade balance',
      value: '−¥5.47 trillion',
      detail: 'Imports were ¥112.56 trillion — the fourth straight annual deficit.',
      source: 'Ministry of Finance, Trade Statistics',
      year: 2024,
    },
    {
      label: 'Current-account surplus',
      value: '¥29.26 trillion',
      detail: 'A record surplus in 2024.',
      source: 'Bank of Japan',
      year: 2024,
    },
    {
      label: 'Minimum wage',
      value: '¥1,055 per hour',
      detail: 'National weighted average, up ¥51; Tokyo’s ¥1,163 was the highest.',
      source: 'Ministry of Health, Labour and Welfare',
      year: 2024,
    },
    {
      label: 'International visitors',
      value: '36.87 million',
      detail: 'A record high, up from 25.07 million in 2023 and 31.88 million in 2019.',
      source: 'Japan National Tourism Organization',
      year: 2024,
    },
  ],

  society: [
    {
      label: 'Births',
      value: '686,061',
      detail: 'The first year below 700,000 since records began in 1899.',
      source: 'Ministry of Health, Labour and Welfare, Vital Statistics',
      year: 2024,
    },
    {
      label: 'Total fertility rate',
      value: '1.15',
      detail: 'A record low, down from 1.26 in 2022 and 1.36 in 2019.',
      source: 'Ministry of Health, Labour and Welfare',
      year: 2024,
    },
    {
      label: 'University advancement rate',
      value: '59.1%',
      detail: 'A record high; about 2.95 million students were enrolled at universities.',
      source: 'Ministry of Education, School Basic Survey',
      year: 2024,
    },
    {
      label: 'One-person households',
      value: '21,151,042 (38.1%)',
      detail: 'Average household size fell to 2.21 people, from 2.10 in 2025.',
      source: 'Statistics Bureau, Population Census',
      year: 2020,
    },
    {
      label: 'Household size',
      value: '2.10 people',
      detail: 'The 2025 census recorded 57,324,619 households, a record number.',
      source: 'Statistics Bureau, Population Census',
      year: 2025,
    },
    {
      label: 'Life expectancy',
      value: '87.1 / 81.1 years',
      detail: 'Women / men at birth in 2023.',
      source: 'Ministry of Health, Labour and Welfare',
      year: 2023,
    },
    {
      label: 'Foreign residents',
      value: '3,768,977',
      detail: 'Permanent residents, 918,116 people, are the largest status group.',
      source: 'Immigration Services Agency',
      year: 2024,
    },
  ],

  regions: [
    {
      label: 'Tokyo population',
      value: '14,178 thousand',
      detail: '11.5% of Japan’s population; the only prefectures to grow in 2024 were Tokyo and Saitama.',
      source: 'Statistics Bureau, Population Estimates',
      year: 2024,
    },
    {
      label: 'Top five prefectures',
      value: '37.9% of population',
      detail: 'Tokyo, Kanagawa, Osaka, Aichi and Saitama together hold over a third of Japan.',
      source: 'Statistics Bureau, Population Estimates',
      year: 2024,
    },
    {
      label: 'Aging extremes',
      value: 'Akita 39.5% / Tokyo 22.7%',
      detail: 'Share aged 65+ by prefecture; Akita also shrank fastest in 2024, with 45 prefectures shrinking overall.',
      source: 'Statistics Bureau, Population Estimates',
      year: 2024,
    },
    {
      label: 'Regional aging leaders',
      value: 'Kochi 36.6%, Aomori 35.7%, Yamagata 35.6%',
      detail: 'After Akita, Kochi, Aomori and Yamagata have the highest shares aged 65+.',
      source: 'Statistics Bureau, Population Estimates',
      year: 2024,
    },
    {
      label: 'Smallest prefecture',
      value: 'Tottori 531 thousand',
      detail: 'By population among the prefectures listed; household size was smallest in Tokyo (1.92 in 2020).',
      source: 'Statistics Bureau',
      year: 2024,
    },
  ],
};
