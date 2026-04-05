export interface BadgeDef {
  id: string
  name: string
  landmark: string
  price: number
  from: string   // gradient start
  to: string     // gradient end
  glow: string   // box-shadow color
}

export const BADGES: BadgeDef[] = [
  { id: 'toronto',   name: 'Toronto',   landmark: 'CN Tower',           price: 30,  from: '#c0392b', to: '#e74c3c', glow: '#e74c3c' },
  { id: 'newyork',   name: 'New York',  landmark: 'Statue of Liberty',  price: 60,  from: '#1a3a6b', to: '#2980b9', glow: '#3498db' },
  { id: 'paris',     name: 'Paris',     landmark: 'Eiffel Tower',       price: 100, from: '#8B6914', to: '#f1c40f', glow: '#f39c12' },
  { id: 'london',    name: 'London',    landmark: 'Big Ben',            price: 150, from: '#4a1a6b', to: '#8e44ad', glow: '#9b59b6' },
  { id: 'sydney',    name: 'Sydney',    landmark: 'Opera House',        price: 200, from: '#0e6655', to: '#1abc9c', glow: '#1abc9c' },
  { id: 'tokyo',     name: 'Tokyo',     landmark: 'Tokyo Tower',        price: 250, from: '#922b21', to: '#e74c3c', glow: '#ff6b6b' },
  { id: 'dubai',     name: 'Dubai',     landmark: 'Burj Khalifa',       price: 350, from: '#784212', to: '#d4ac0d', glow: '#f0c030' },
  { id: 'shanghai',  name: 'Shanghai',  landmark: 'Oriental Pearl',     price: 500, from: '#7d0e6e', to: '#e91e8c', glow: '#e91e8c' },
]
