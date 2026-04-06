export interface BadgeDef {
  id: string
  name: string
  landmark: string
  price: number
  from: string   // gradient start
  to: string     // gradient end
  glow: string   // glow color
  country: string // 'canada' | 'usa' | 'france' | 'uk' | 'australia' | 'japan' | 'uae' | 'china'
  countryIso: string // ISO 3166-1 numeric for map matching
}

export const BADGES: BadgeDef[] = [
  { id: 'toronto',  name: 'Toronto',  landmark: 'CN Tower',          price: 30,  from: '#c0392b', to: '#e74c3c', glow: '#e74c3c', country: 'canada',    countryIso: '124' },
  { id: 'newyork',  name: 'New York', landmark: 'Statue of Liberty', price: 60,  from: '#1a3a6b', to: '#2980b9', glow: '#3498db', country: 'usa',       countryIso: '840' },
  { id: 'paris',    name: 'Paris',    landmark: 'Eiffel Tower',      price: 100, from: '#8B6914', to: '#f1c40f', glow: '#f39c12', country: 'france',    countryIso: '250' },
  { id: 'london',   name: 'London',   landmark: 'Big Ben',           price: 150, from: '#4a1a6b', to: '#8e44ad', glow: '#9b59b6', country: 'uk',        countryIso: '826' },
  { id: 'sydney',   name: 'Sydney',   landmark: 'Opera House',       price: 200, from: '#0e6655', to: '#1abc9c', glow: '#1abc9c', country: 'australia', countryIso: '36'  },
  { id: 'tokyo',    name: 'Tokyo',    landmark: 'Tokyo Tower',       price: 250, from: '#922b21', to: '#e74c3c', glow: '#ff6b6b', country: 'japan',     countryIso: '392' },
  { id: 'dubai',    name: 'Dubai',    landmark: 'Burj Khalifa',      price: 350, from: '#784212', to: '#d4ac0d', glow: '#f0c030', country: 'uae',       countryIso: '784' },
  { id: 'shanghai', name: 'Shanghai', landmark: 'Oriental Pearl',    price: 500, from: '#7d0e6e', to: '#e91e8c', glow: '#e91e8c', country: 'china',     countryIso: '156' },
]
