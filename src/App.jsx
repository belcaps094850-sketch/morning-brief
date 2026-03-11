import { Routes, Route, NavLink } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Ideas from './pages/Ideas'
import DeepDives from './pages/DeepDives'
import Books from './pages/Books'
import Archive from './pages/Archive'

export default function App() {
  return (
    <div className="layout">
      <aside className="sidebar">
        <h1>📚 Alec Lab</h1>
        <div className="subtitle">Daily digest & ideas</div>
        <nav>
          <NavLink to="/" end>🏠 Morning Brief</NavLink>
          <NavLink to="/ideas">💡 Ideas Backlog</NavLink>
          <NavLink to="/deep-dives">🔬 Deep Dives</NavLink>
          <NavLink to="/books">📚 Book Notes</NavLink>
          <NavLink to="/archive">📁 Archive</NavLink>
        </nav>
      </aside>
      <main className="main">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/ideas" element={<Ideas />} />
          <Route path="/deep-dives" element={<DeepDives />} />
          <Route path="/books" element={<Books />} />
          <Route path="/archive" element={<Archive />} />
        </Routes>
      </main>
    </div>
  )
}
