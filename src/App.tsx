import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './store'
import Navigation from './components/Navigation'
import Home from './pages/Home'
import Stats from './pages/Stats'

export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <div className="relative min-h-screen flex flex-col overflow-x-hidden" style={{ background: '#eef0f8' }}>
          {/* Animated background blobs */}
          <div className="blob blob-1" style={{ width: 600, height: 600, top: -120, right: -100, background: 'radial-gradient(circle, #a5b4fc 0%, #818cf8 40%, transparent 70%)' }} />
          <div className="blob blob-2" style={{ width: 500, height: 500, bottom: 80, left: -100, background: 'radial-gradient(circle, #f9a8d4 0%, #e879f9 40%, transparent 70%)' }} />
          <div className="blob blob-3" style={{ width: 400, height: 400, top: '40%', left: '40%', background: 'radial-gradient(circle, #7dd3fc 0%, #38bdf8 40%, transparent 70%)' }} />
          {/* Content */}
          <div className="relative z-10 flex flex-col min-h-screen">
            <Navigation />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/stats" element={<Stats />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </Provider>
  )
}
