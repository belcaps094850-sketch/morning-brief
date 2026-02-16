import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function DeepDives() {
  const [dives, setDives] = useState([])
  const [books, setBooks] = useState([])

  useEffect(() => {
    fetch('/data/deep-dives.json').then(r => r.json()).then(setDives)
    fetch('/data/books.json').then(r => r.json()).then(setBooks)
  }, [])

  if (!dives.length) return <p>Loading...</p>

  const active = dives.find(d => d.status === 'active') || dives[0]

  return (
    <div className="deep-dive">
      <h2>🔬 {active.title}</h2>
      <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>
        Started {active.startDate} · Updated {active.lastUpdated}
      </div>
      <div className="progress-bar">
        <div className="fill" style={{ width: `${active.progress}%` }} />
      </div>
      <div style={{ fontSize: 13, color: '#666', marginBottom: 16 }}>{active.progress}% complete</div>
      {active.inspiredBy && (() => {
        const book = books.find(b => b.id === active.inspiredBy)
        return book ? <div style={{ fontSize: 13, marginBottom: 16 }}>📚 Inspired by: <Link to={`/books?id=${book.id}`} style={{ color: '#3498db' }}>{book.title}</Link></div> : null
      })()}

      <section>
        <h3>Overview</h3>
        <p>{active.overview}</p>
      </section>

      <section>
        <h3>Research Notes</h3>
        <ul>
          {active.researchNotes.map((n, i) => <li key={i}>{n}</li>)}
        </ul>
      </section>

      <section>
        <h3>Business Angle</h3>
        <p>{active.businessAngle}</p>
      </section>

      <section>
        <h3>POC Status</h3>
        <p>{active.pocStatus}</p>
      </section>

      <section>
        <h3>Resources</h3>
        <ul>
          {active.resources.map((r, i) => (
            <li key={i}><a href={r.url} target="_blank" rel="noreferrer">{r.title}</a></li>
          ))}
        </ul>
      </section>
    </div>
  )
}
