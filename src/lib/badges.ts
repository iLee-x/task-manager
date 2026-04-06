export interface BadgeDef {
  id: string
  name: string
  landmark: string
  price: number
  from: string   // gradient start
  to: string     // gradient end
  glow: string   // glow color
  country: string // display name
  countryIso: string // ISO 3166-1 numeric for map matching
}

export const BADGES: BadgeDef[] = [
  // ── Tier 1 ────────────────────────────────────────────────────────────────
  { id: 'toronto',    name: 'Toronto',      landmark: 'CN Tower',           price: 30,   from: '#c0392b', to: '#e74c3c', glow: '#e74c3c', country: 'canada',      countryIso: '124' },
  { id: 'amsterdam',  name: 'Amsterdam',    landmark: 'Canal Houses',       price: 40,   from: '#c0392b', to: '#f39c12', glow: '#f39c12', country: 'netherlands', countryIso: '528' },
  { id: 'berlin',     name: 'Berlin',       landmark: 'Brandenburg Gate',   price: 50,   from: '#2c3e50', to: '#f39c12', glow: '#f1c40f', country: 'germany',     countryIso: '276' },
  // ── Tier 2 ────────────────────────────────────────────────────────────────
  { id: 'newyork',    name: 'New York',     landmark: 'Statue of Liberty',  price: 60,   from: '#1a3a6b', to: '#2980b9', glow: '#3498db', country: 'usa',         countryIso: '840' },
  { id: 'losangeles', name: 'Los Angeles',  landmark: 'Hollywood Sign',     price: 70,   from: '#c0392b', to: '#f39c12', glow: '#e67e22', country: 'usa',         countryIso: '840' },
  { id: 'rome',       name: 'Rome',         landmark: 'Colosseum',          price: 80,   from: '#7d3c0a', to: '#dc7633', glow: '#e67e22', country: 'italy',       countryIso: '380' },
  { id: 'barcelona',  name: 'Barcelona',    landmark: 'Sagrada Família',    price: 90,   from: '#922b21', to: '#f39c12', glow: '#e74c3c', country: 'spain',       countryIso: '724' },
  // ── Tier 3 ────────────────────────────────────────────────────────────────
  { id: 'paris',      name: 'Paris',        landmark: 'Eiffel Tower',       price: 100,  from: '#8B6914', to: '#f1c40f', glow: '#f39c12', country: 'france',      countryIso: '250' },
  { id: 'istanbul',   name: 'Istanbul',     landmark: 'Hagia Sophia',       price: 120,  from: '#117a65', to: '#1abc9c', glow: '#1abc9c', country: 'turkey',      countryIso: '792' },
  { id: 'moscow',     name: 'Moscow',       landmark: "St. Basil's",        price: 130,  from: '#6c1f40', to: '#e74c3c', glow: '#e74c3c', country: 'russia',      countryIso: '643' },
  // ── Tier 4 ────────────────────────────────────────────────────────────────
  { id: 'london',     name: 'London',       landmark: 'Big Ben',            price: 150,  from: '#4a1a6b', to: '#8e44ad', glow: '#9b59b6', country: 'uk',          countryIso: '826' },
  { id: 'seoul',      name: 'Seoul',        landmark: 'N Seoul Tower',      price: 160,  from: '#1a237e', to: '#5c6bc0', glow: '#7986cb', country: 'south korea', countryIso: '410' },
  { id: 'singapore',  name: 'Singapore',    landmark: 'Marina Bay Sands',   price: 180,  from: '#006064', to: '#00bcd4', glow: '#00e5ff', country: 'singapore',   countryIso: '702' },
  // ── Tier 5 ────────────────────────────────────────────────────────────────
  { id: 'sydney',     name: 'Sydney',       landmark: 'Opera House',        price: 200,  from: '#0e6655', to: '#1abc9c', glow: '#1abc9c', country: 'australia',   countryIso: '36'  },
  { id: 'rio',        name: 'Rio',          landmark: 'Christ the Redeemer', price: 220, from: '#1b5e20', to: '#66bb6a', glow: '#43a047', country: 'brazil',      countryIso: '76'  },
  { id: 'mumbai',     name: 'Mumbai',       landmark: 'Gateway of India',   price: 240,  from: '#e65100', to: '#ffa726', glow: '#ff7043', country: 'india',       countryIso: '356' },
  // ── Tier 6 ────────────────────────────────────────────────────────────────
  { id: 'tokyo',      name: 'Tokyo',        landmark: 'Tokyo Tower',        price: 250,  from: '#922b21', to: '#e74c3c', glow: '#ff6b6b', country: 'japan',       countryIso: '392' },
  { id: 'beijing',    name: 'Beijing',      landmark: 'Forbidden City',     price: 300,  from: '#7b0000', to: '#c0392b', glow: '#e74c3c', country: 'china',       countryIso: '156' },
  // ── Tier 7 ────────────────────────────────────────────────────────────────
  { id: 'dubai',      name: 'Dubai',        landmark: 'Burj Khalifa',       price: 350,  from: '#784212', to: '#d4ac0d', glow: '#f0c030', country: 'uae',         countryIso: '784' },
  { id: 'shanghai',   name: 'Shanghai',     landmark: 'Oriental Pearl',     price: 500,  from: '#7d0e6e', to: '#e91e8c', glow: '#e91e8c', country: 'china',       countryIso: '156' },
]
