import type { Landmark } from '../types';

export const MILESTONES: Landmark[] = [
  {
    id: 'surface',
    depthMeters: 0,
    name: 'The Surface',
    subtitle: 'The Threshold of Stillness',
    description: 'Where the noise of the world ends and infinite descent begins. Take a full breath.',
    heightOrLength: '0 m',
    category: 'oceanic',
    iconType: 'diver'
  },
  {
    id: 'scuba-limit',
    depthMeters: 40,
    name: 'Recreational Scuba Boundary',
    subtitle: 'The Limit of Casual Exploration',
    description: 'Beyond this threshold, light begins to shift and the weight of water demands absolute presence.',
    heightOrLength: '40 m',
    category: 'oceanic',
    iconType: 'diver'
  },
  {
    id: 'statue-of-liberty',
    depthMeters: 93,
    name: 'Statue of Liberty',
    subtitle: 'Inverted Monolith',
    description: 'Suspended upside-down in the quiet void, from the tip of her torch down to the foundation stone.',
    heightOrLength: '93 m',
    invertedNote: 'Inverted from torch to pedestal',
    category: 'monument',
    iconType: 'statue'
  },
  {
    id: 'eiffel-tower',
    depthMeters: 330,
    name: 'Eiffel Tower',
    subtitle: 'Latticework in the Deep',
    description: 'The wrought-iron giant inverted, its spire pointing toward the earth below, bathed in silent current.',
    heightOrLength: '330 m',
    invertedNote: 'Inverted architectural scale',
    category: 'monument',
    iconType: 'tower'
  },
  {
    id: 'deepest-scuba',
    depthMeters: 332,
    name: 'Deepest Scuba Dive',
    subtitle: 'Ahmed Gabr (2014)',
    description: 'The absolute limit a human has ever swum on open-circuit scuba. It took 12 minutes to descend, and 15 hours to ascend safely.',
    heightOrLength: '332.35 m',
    category: 'oceanic',
    iconType: 'diver'
  },
  {
    id: 'blue-whale',
    depthMeters: 500,
    name: 'Blue Whale Diving Limit',
    subtitle: 'The Song of Leviathans',
    description: 'The largest living creatures dive here in total darkness, communicating across oceans in deep low-frequency hums.',
    heightOrLength: '500 m',
    category: 'oceanic',
    iconType: 'whale'
  },
  {
    id: 'burj-khalifa',
    depthMeters: 828,
    name: 'Burj Khalifa',
    subtitle: 'Humanity’s Highest Scriptorium',
    description: 'The tallest structure ever constructed by human hands, hung inverted in the expanse like an icicle of glass and steel.',
    heightOrLength: '828 m',
    invertedNote: 'Inverted spire to foundation',
    category: 'monument',
    iconType: 'skyscraper'
  },
  {
    id: 'midnight-zone',
    depthMeters: 1000,
    name: 'The Midnight Zone (Bathypelagic)',
    subtitle: 'Extinction of Sunlight',
    description: 'Not a single photon of sunlight ever reaches this depth. Life here generates its own inner bioluminescent glow.',
    heightOrLength: '1,000 m',
    category: 'oceanic',
    iconType: 'trench'
  },
  {
    id: 'grand-canyon',
    depthMeters: 1800,
    name: 'Grand Canyon Depth',
    subtitle: 'Two Billion Years of Silence',
    description: 'The vertical depth of the canyon carved by the Colorado River, holding silent strata of planetary time.',
    heightOrLength: '1,800 m',
    category: 'natural',
    iconType: 'mountain'
  },
  {
    id: 'titanic',
    depthMeters: 3810,
    name: 'RMS Titanic',
    subtitle: 'Resting on the Abyssal Plain',
    description: 'Resting in two pieces 3.8 kilometers beneath the North Atlantic, slowly being reclaimed by the silence of the sea.',
    heightOrLength: '3,810 m',
    category: 'monument',
    iconType: 'ship'
  },
  {
    id: 'hadal-zone',
    depthMeters: 6000,
    name: 'The Hadal Realm',
    subtitle: 'Named for Hades, the Underworld',
    description: 'The oceanic trenches where pressure exceeds 600 atmospheres. Nothing is hurried here; every motion is deliberate.',
    heightOrLength: '6,000 m',
    category: 'oceanic',
    iconType: 'trench'
  },
  {
    id: 'mount-everest',
    depthMeters: 8849,
    name: 'Mount Everest (Chomolungma)',
    subtitle: 'Roof of the World, Inverted',
    description: 'The entire crown of the Himalayas inverted downward into the infinite quiet. Its snow-capped summit reaching toward the bottomless.',
    heightOrLength: '8,849 m',
    invertedNote: 'Inverted from summit to sea level',
    category: 'natural',
    iconType: 'mountain'
  },
  {
    id: 'challenger-deep',
    depthMeters: 10928,
    name: 'Challenger Deep',
    subtitle: 'The Mariana Trench Abyss',
    description: 'The absolute lowest known point on Earth’s crust. Eleven kilometers of quiet water above. Stillness complete.',
    heightOrLength: '10,928 m',
    category: 'oceanic',
    iconType: 'trench'
  },
  {
    id: 'kola-borehole',
    depthMeters: 12262,
    name: 'Kola Superdeep Borehole',
    subtitle: 'The Deepest Artificial Penetration',
    description: 'Twenty years of drilling reached this fracture in the continental crust, where rocks behave like plastic under immense heat and calm pressure.',
    heightOrLength: '12,262 m',
    category: 'subterranean',
    iconType: 'crust'
  },
  {
    id: 'oceanic-crust',
    depthMeters: 20000,
    name: 'Oceanic Lithosphere',
    subtitle: 'The Crystalline Foundation',
    description: 'Beyond human reach. Basalt and gabbro holding the oceans aloft in quiet thermodynamic equilibrium.',
    heightOrLength: '20,000 m',
    category: 'subterranean',
    iconType: 'crust'
  },
  {
    id: 'moho-discontinuity',
    depthMeters: 35000,
    name: 'Mohorovičić Discontinuity',
    subtitle: 'The Boundary of Crust & Mantle',
    description: 'The seismic frontier where planetary density leaps forward. The earth softens into ductile silence.',
    heightOrLength: '35,000 m',
    category: 'subterranean',
    iconType: 'mantle'
  },
  {
    id: 'diamond-zone',
    depthMeters: 150000,
    name: 'Diamond Genesis Zone',
    subtitle: 'Purity Born Under Pure Pressure',
    description: 'Where carbon atoms crystallize into pure tetrahedral diamond structures over hundreds of millions of unhurried years.',
    heightOrLength: '150,000 m',
    category: 'subterranean',
    iconType: 'mantle'
  },
  {
    id: 'asthenosphere',
    depthMeters: 400000,
    name: 'The Quiet Asthenosphere',
    subtitle: 'The Flowing Earth',
    description: 'Semi-fluid solid rock moving millimeters per decade. A planetary lesson in ultimate patience.',
    heightOrLength: '400,000 m',
    category: 'subterranean',
    iconType: 'mantle'
  },
  {
    id: 'core-mantle',
    depthMeters: 2890000,
    name: 'Gutenberg Discontinuity',
    subtitle: 'The Liquid Iron Sea',
    description: 'The shore of Earth’s molten outer core, generating the planetary geomagnetic shield that protects all living things.',
    heightOrLength: '2,890,000 m',
    category: 'subterranean',
    iconType: 'core'
  },
  {
    id: 'earth-center',
    depthMeters: 6371000,
    name: 'Center of the Earth',
    subtitle: 'Point of Zero Gravity',
    description: 'At the geometric heart of our world, all gravitational forces cancel out to zero. Total weightlessness.',
    heightOrLength: '6,371,000 m',
    category: 'cosmic',
    iconType: 'core'
  },
  {
    id: 'infinite-expanse',
    depthMeters: 10000000,
    name: 'The Boundless Expanse',
    subtitle: 'Beyond All Boundaries',
    description: 'No floor, no ceiling, no timeline. Space expanding into stillness forever.',
    heightOrLength: '∞',
    category: 'cosmic',
    iconType: 'infinite'
  }
];
