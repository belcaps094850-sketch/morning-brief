import { useState, useEffect } from 'react'

export default function Dashboard() {
  const [briefs, setBriefs] = useState([])
  const [expanded, setExpanded] = useState(null)

  useEffect(() => {
    fetch('/data/briefs.json').then(r => r.json()).then(setBriefs)
  }, [])

  const today = briefs[0]
  if (!today) return <p>Loading...</p>

  const cats = Object.entries(today.categories)

  return (
    <div>
      <h2>Morning Brief — {today.date}</h2>

      <div className="poc-highlight">
        <div className="label">⚡ POC-Worthy Highlight</div>
        <h3>{today.pocHighlight.title}</h3>
        <p>{today.pocHighlight.summary}</p>
        <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>
          {today.pocHighlight.category} · <a href={today.pocHighlight.source} target="_blank" rel="noreferrer">source</a>
        </div>
      </div>

      <div className="cards">
        {cats.map(([cat, data]) => (
          <div key={cat} className="card" onClick={() => setExpanded(expanded === cat ? null : cat)}>
            <div className="cat">{cat}</div>
            <h4>{data.topPick}</h4>
            <p>{data.summary}</p>
            {data.source && (
              <div style={{ fontSize: 11, color: '#aaa', marginTop: 4 }}>
                <a href={data.source.startsWith('http') ? data.source : '#'} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()}>
                  {data.source}
                </a>
              </div>
            )}
            {expanded === cat && <div className="digest">{data.digest}</div>}
          </div>
        ))}
      </div>
    </div>
  )
}
