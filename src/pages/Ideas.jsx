import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const STATUSES = ['spark', 'researching', 'poc', 'completed']
const CATEGORIES = ['All', 'SRE', 'React', 'AI', 'Security', 'MSL']

function nextStatus(s) {
  const i = STATUSES.indexOf(s)
  return STATUSES[(i + 1) % STATUSES.length]
}

export default function Ideas() {
  const [ideas, setIdeas] = useState([])
  const [filterCat, setFilterCat] = useState('All')
  const [filterStatus, setFilterStatus] = useState('All')

  const [books, setBooks] = useState([])

  useEffect(() => {
    fetch('/data/ideas.json').then(r => r.json()).then(setIdeas)
    fetch('/data/books.json').then(r => r.json()).then(setBooks)
  }, [])

  const filtered = ideas.filter(i =>
    (filterCat === 'All' || i.category === filterCat) &&
    (filterStatus === 'All' || i.status === filterStatus)
  )

  function cycleStatus(id) {
    setIdeas(prev => prev.map(i => i.id === id ? { ...i, status: nextStatus(i.status) } : i))
  }

  return (
    <div>
      <h2>💡 Ideas Backlog</h2>
      <div className="filters">
        <select value={filterCat} onChange={e => setFilterCat(e.target.value)}>
          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option>All</option>
          {STATUSES.map(s => <option key={s}>{s}</option>)}
        </select>
      </div>
      {filtered.map(idea => (
        <div key={idea.id} className="idea-row">
          <div className="idea-info">
            <h4>{idea.title}</h4>
            <p>{idea.description}</p>
            <div className="idea-meta">
              <span>{idea.category}</span>
              <span>{idea.sourceDate}</span>
              {idea.bookRef && (() => {
                const book = books.find(b => b.id === idea.bookRef)
                return book ? <Link to={`/books?id=${book.id}`} className="book-ref-tag">📚 {book.title}</Link> : null
              })()}
            </div>
          </div>
          <button className="status-btn" onClick={() => cycleStatus(idea.id)}>
            {idea.status} →
          </button>
        </div>
      ))}
    </div>
  )
}
