import { useState, useEffect } from 'react'

const CATEGORIES = ['All', 'SRE', 'React', 'AI', 'Security', 'MSL']

export default function Archive() {
  const [briefs, setBriefs] = useState([])
  const [expanded, setExpanded] = useState(null)
  const [filterCat, setFilterCat] = useState('All')
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetch('/data/briefs.json').then(r => r.json()).then(setBriefs)
  }, [])

  return (
    <div>
      <h2>📁 Archive</h2>
      <div className="filters">
        <input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
        <select value={filterCat} onChange={e => setFilterCat(e.target.value)}>
          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>
      {briefs.map(brief => {
        const cats = Object.entries(brief.categories).filter(([cat, data]) =>
          (filterCat === 'All' || cat === filterCat) &&
          (!search || data.topPick.toLowerCase().includes(search.toLowerCase()) ||
            data.digest.toLowerCase().includes(search.toLowerCase()))
        )
        if (!cats.length) return null
        return (
          <div key={brief.id}>
            <div className="archive-date" onClick={() => setExpanded(expanded === brief.id ? null : brief.id)}>
              <span><strong>{brief.date}</strong></span>
              <span>{cats.length} categories</span>
            </div>
            {expanded === brief.id && (
              <div className="cards" style={{ marginBottom: 16 }}>
                {cats.map(([cat, data]) => (
                  <div key={cat} className="card">
                    <div className="cat">{cat}</div>
                    <h4>{data.topPick}</h4>
                    <p>{data.summary}</p>
                    <div className="digest">{data.digest}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
