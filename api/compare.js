export const access = 'public';

const places = {
  'Sardar Patel College of Engineering': [22.571848, 72.89603],
  'Bhakrol Square': [22.5615428, 72.9230178],
  'Saheed Chowk': [22.5562342, 72.9252142],
  'Shastri Maidan Walkway': [22.5526564, 72.9264611],
  'Bhaikaka Circle': [22.5498867, 72.9289356],
  'APC Circle': [22.5514138, 72.9366],
  'Reliance Smart Bazaar': [22.5525118, 72.9444796],
  'Town Hall Circle': [22.5543775, 72.9511083],
  'Anand New Bus Station': [22.5576929, 72.9555746],
  'Anand Junction': [22.5607595, 72.9667427]
};

const providers = [
  ['Uber', 'Go', 7],
  ['Rapido', 'Bike', 4],
  ['Auto', 'Auto', 5.5],
  ['CabGo', 'Mini', 6]
];

function distanceKm(a, b) {
  return Math.max(0.2, Math.hypot((b[0] - a[0]) * 111, (b[1] - a[1]) * 102) * 1.12);
}

export default async function handler(req) {
  if (req.method !== 'POST') return { status: 405, body: { error: 'Use POST' } };
  const { from, to } = req.body || {};
  if (!from || !to) return { status: 400, body: { error: 'from and to are required' } };
  if (!places[from] || !places[to]) return { status: 400, body: { error: 'Unknown route' } };

  const km = distanceKm(places[from], places[to]);
  const rides = providers.map((p, i) => ({
    provider: p[0],
    type: p[1],
    fare: Math.max(10, Math.min(90, Math.round((10 + km * p[2]) / 5) * 5)),
    eta: Math.max(2, Math.round(km * [0.55, 0.45, 0.4, 0.6][i])),
    duration: Math.max(3, Math.round(km * [2.2, 1.9, 2.1, 2][i])),
    distance: Number(km.toFixed(1))
  }));

  return { status: 200, body: { mode: 'demo', from, to, rides } };
}
