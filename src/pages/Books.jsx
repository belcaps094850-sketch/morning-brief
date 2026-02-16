import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'

const STATUS_LABELS = {
  'reading': '📖 Reading',
  'notes-complete': '✅ Notes Complete',
  'applying': '🔄 Applying',
  'applied': '🎯 Applied'
}

export default function Books() {
  const [books, setBooks] = useState([])
  const [ideas, setIdeas] = useState([])
  const [dives, setDives] = useState([])
  const [searchParams, setSearchParams] = useSearchParams()
  const selectedId = searchParams.get('id')

  useEffect(() => {
    fetch('/data/books.json').then(r => r.json()).then(setBooks)
    fetch('/data/ideas.json').then(r => r.json()).then(setIdeas)
    fetch('/data/deep-dives.json').then(r => r.json()).then(setDives)
  }, [])

  const selected = selectedId ? books.find(b => b.id === selectedId) : null

  if (selected) return <BookDetail book={selected} ideas={ideas} dives={dives} onBack={() => setSearchParams({})} />

  return (
    <div>
      <h2>📚 Book Notes</h2>
      <p style={{ color: '#888', fontSize: 14, marginBottom: 20 }}>Key concepts, frameworks, and actionable takeaways</p>
      {books.map(book => (
        <div key={book.id} className="book-card" onClick={() => setSearchParams({ id: book.id })} style={{ cursor: 'pointer' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h3 style={{ margin: '0 0 4px' }}>{book.title}</h3>
              {book.subtitle && <div style={{ fontSize: 13, color: '#666', marginBottom: 6 }}>{book.subtitle}</div>}
              <div style={{ fontSize: 13, color: '#888' }}>
                {book.author} · Researched by {book.researchedBy} · {book.dateAdded}
              </div>
              <div style={{ marginTop: 8, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {book.tags.map(t => <span key={t} className="tag">{t}</span>)}
              </div>
            </div>
            <span className="status-badge">{STATUS_LABELS[book.status] || book.status}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

function BookDetail({ book, ideas, dives, onBack }) {
  const relatedIdeas = ideas.filter(i => i.bookRef === book.id)
  const relatedDives = dives.filter(d => d.inspiredBy === book.id)

  return (
    <div className="book-detail-page">
      <a onClick={onBack} style={{ cursor: 'pointer', color: '#3498db', fontSize: 14, textDecoration: 'none' }}>← All Books</a>
      <h2 style={{ marginTop: 12, marginBottom: 4 }}>{book.title}</h2>
      {book.subtitle && <div style={{ fontSize: 14, color: '#666', marginBottom: 8 }}>{book.subtitle}</div>}
      <div style={{ fontSize: 13, color: '#888', marginBottom: 20 }}>
        {book.author} · Researched by {book.researchedBy} · {book.dateAdded} · {STATUS_LABELS[book.status]}
      </div>

      {/* Key Takeaways */}
      {book.keyTakeaways && (
        <div className="key-takeaways">
          <h3>⭐ Key Takeaways</h3>
          <ul>
            {book.keyTakeaways.map((t, i) => <li key={i}>{t}</li>)}
          </ul>
        </div>
      )}

      {/* Overview */}
      <section className="book-section">
        <h3>Overview</h3>
        <p>{book.overview}</p>
        {book.overviewQuote && <blockquote>{book.overviewQuote}</blockquote>}
      </section>

      {/* Key Principles */}
      {book.principles && (
        <section className="book-section">
          <h3>Key Principles</h3>
          {book.principles.map((p, i) => (
            <div key={i} className="principle-card">
              <strong>{i + 1}. {p.title}</strong>
              <p>{p.description}</p>
            </div>
          ))}
        </section>
      )}

      {/* Frameworks */}
      {book.frameworks && (
        <section className="book-section">
          <h3>Frameworks</h3>
          {book.frameworks.map((f, i) => (
            <div key={i} style={{ marginBottom: 20 }}>
              <h4>{f.name}</h4>
              {f.description && <p>{f.description}</p>}
              {f.steps && (
                <ol>
                  {f.steps.map((s, j) => <li key={j}>{s}</li>)}
                </ol>
              )}
              {f.table && (
                <table className="simple-table">
                  <tbody>
                    {f.table.map((row, j) => (
                      <tr key={j}>
                        <td><strong>{row.element}</strong></td>
                        <td>{row.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              {f.note && <div className="principle-card"><p>{f.note}</p></div>}
            </div>
          ))}
        </section>
      )}

      {/* Stats */}
      {book.stats && (
        <section className="book-section">
          <h3>Why It Matters</h3>
          <table className="simple-table">
            <thead><tr><th>Insight</th><th>Source</th></tr></thead>
            <tbody>
              {book.stats.map((s, i) => (
                <tr key={i}><td><strong>{s.stat}</strong> {s.description}</td><td>{s.source}</td></tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {/* Case Studies */}
      {book.caseStudies && (
        <section className="book-section">
          <h3>Case Studies</h3>
          {book.caseStudies.map((c, i) => (
            <div key={i} style={{ marginBottom: 12 }}>
              <h4>{c.name}</h4>
              <p>{c.description}</p>
            </div>
          ))}
        </section>
      )}

      {/* B2B Applications */}
      {book.b2bApplications && (
        <section className="book-section">
          <h3>B2B CX Applications</h3>
          <table className="simple-table">
            <thead><tr><th>Principle</th><th>Application</th></tr></thead>
            <tbody>
              {book.b2bApplications.map((a, i) => (
                <tr key={i}><td><strong>{a.principle}</strong></td><td>{a.application}</td></tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {/* Metrics */}
      {book.metrics && (
        <section className="book-section">
          <h3>Metrics That Matter</h3>
          <table className="simple-table">
            <thead><tr><th>Metric</th><th>Why It Matters</th></tr></thead>
            <tbody>
              {book.metrics.map((m, i) => (
                <tr key={i}><td><strong>{m.metric}</strong></td><td>{m.why}</td></tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {/* Quotes */}
      {book.quotes && (
        <section className="book-section">
          <h3>Key Quotes</h3>
          {book.quotes.map((q, i) => <blockquote key={i}>"{q}"</blockquote>)}
        </section>
      )}

      {/* Action Items */}
      {book.actionItems && (
        <section className="book-section">
          <h3>Action Items</h3>
          <ul>
            {book.actionItems.map((a, i) => <li key={i}>{a}</li>)}
          </ul>
        </section>
      )}

      {/* Recommended Reading */}
      {book.recommendedReading && (
        <section className="book-section">
          <h3>Recommended Reading</h3>
          <table className="simple-table">
            <thead><tr><th>Book</th><th>Key Insight</th></tr></thead>
            <tbody>
              {book.recommendedReading.map((r, i) => (
                <tr key={i}><td><strong>{r.title}</strong></td><td>{r.insight}</td></tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {/* Related Ideas */}
      {relatedIdeas.length > 0 && (
        <section className="book-section">
          <h3>Related Ideas</h3>
          {relatedIdeas.map(idea => (
            <div key={idea.id} className="related-item">
              <Link to={`/ideas`}>💡 {idea.title}</Link>
              <span style={{ fontSize: 12, color: '#888', marginLeft: 8 }}>{idea.category}</span>
            </div>
          ))}
        </section>
      )}

      {/* Related Deep Dives */}
      {relatedDives.length > 0 && (
        <section className="book-section">
          <h3>Related Deep Dives</h3>
          {relatedDives.map(dive => (
            <div key={dive.id} className="related-item">
              <Link to={`/deep-dives`}>🔬 {dive.title}</Link>
            </div>
          ))}
        </section>
      )}
    </div>
  )
}
