import { useState, useEffect, useRef } from 'react'
import { Link, useSearchParams } from 'react-router-dom'

function SectionTable({ section }) {
  return (
    <div style={{ overflowX: 'auto', marginBottom: 16 }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr>
            {section.headers.map((h, i) => (
              <th key={i} style={{ textAlign: 'left', padding: '8px 12px', borderBottom: '2px solid #333', fontWeight: 700 }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {section.rows.map((row, ri) => (
            <tr key={ri} style={{ background: ri % 2 === 0 ? '#fafafa' : '#fff' }}>
              {row.map((cell, ci) => (
                <td key={ci} style={{ padding: '6px 12px', borderBottom: '1px solid #eee' }}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function SectionList({ section }) {
  return (
    <ul style={{ paddingLeft: 20, marginBottom: 16 }}>
      {section.items.map((item, i) => (
        <li key={i} style={{ marginBottom: 6, fontSize: 13, lineHeight: 1.6 }}>{item}</li>
      ))}
    </ul>
  )
}

function SectionCallout({ section }) {
  return (
    <div style={{
      background: '#f0f7ff',
      border: '1px solid #c8ddf0',
      borderLeft: '4px solid #0066cc',
      padding: '12px 16px',
      marginBottom: 16,
      fontSize: 13,
      lineHeight: 1.6,
      borderRadius: 4
    }}>
      {section.text}
    </div>
  )
}

function CollapsibleSection({ section, id, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div id={id} style={{ marginBottom: 20, scrollMarginTop: 80 }}>
      <h3
        onClick={() => setOpen(!open)}
        style={{
          fontSize: 15,
          marginBottom: open ? 8 : 0,
          borderBottom: open ? '1px solid #eee' : 'none',
          paddingBottom: 4,
          cursor: 'pointer',
          userSelect: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: 6
        }}
      >
        <span style={{ fontSize: 11, color: '#888', transition: 'transform 0.15s', transform: open ? 'rotate(90deg)' : 'rotate(0deg)', display: 'inline-block' }}>▶</span>
        {section.title}
      </h3>
      {open && (
        <>
          {section.type === 'table' && <SectionTable section={section} />}
          {section.type === 'list' && <SectionList section={section} />}
          {section.type === 'callout' && <SectionCallout section={section} />}
        </>
      )}
    </div>
  )
}

function TableOfContents({ sections, extras, activeId }) {
  return (
    <div style={{
      position: 'sticky',
      top: 16,
      width: 200,
      flexShrink: 0,
      fontSize: 12,
      lineHeight: 1.8,
      borderLeft: '2px solid #eee',
      paddingLeft: 12,
      maxHeight: 'calc(100vh - 40px)',
      overflowY: 'auto'
    }}>
      <div style={{ fontWeight: 700, marginBottom: 8, fontSize: 11, textTransform: 'uppercase', color: '#888', letterSpacing: 0.5 }}>On this page</div>
      {sections.map((s, i) => {
        const sectionId = `section-${i}`
        const isActive = activeId === sectionId
        return (
          <a
            key={i}
            href={`#${sectionId}`}
            onClick={(e) => {
              e.preventDefault()
              document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }}
            style={{
              display: 'block',
              color: isActive ? '#0066cc' : '#555',
              fontWeight: isActive ? 600 : 400,
              textDecoration: 'none',
              padding: '1px 0',
              borderLeft: isActive ? '2px solid #0066cc' : '2px solid transparent',
              paddingLeft: 8,
              marginLeft: -14,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {s.title.length > 28 ? s.title.slice(0, 28) + '…' : s.title}
          </a>
        )
      })}
      {extras.map((e, i) => (
        <a
          key={`extra-${i}`}
          href={`#extra-${e.id}`}
          onClick={(ev) => {
            ev.preventDefault()
            document.getElementById(`extra-${e.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }}
          style={{
            display: 'block',
            color: '#555',
            textDecoration: 'none',
            padding: '1px 0',
            borderLeft: '2px solid transparent',
            paddingLeft: 8,
            marginLeft: -14
          }}
        >
          {e.label}
        </a>
      ))}
    </div>
  )
}

export default function DeepDives() {
  const [dives, setDives] = useState([])
  const [books, setBooks] = useState([])
  const [searchParams, setSearchParams] = useSearchParams()
  const [activeSection, setActiveSection] = useState(null)
  const contentRef = useRef(null)

  useEffect(() => {
    fetch('/data/deep-dives.json').then(r => r.json()).then(setDives)
    fetch('/data/books.json').then(r => r.json()).then(setBooks)
  }, [])

  // Track active section on scroll
  useEffect(() => {
    const handler = () => {
      const container = contentRef.current
      if (!container) return
      const headings = container.querySelectorAll('[id^="section-"]')
      let current = null
      headings.forEach(el => {
        const rect = el.getBoundingClientRect()
        if (rect.top <= 120) current = el.id
      })
      if (current) setActiveSection(current)
    }
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  if (!dives.length) return <p>Loading...</p>

  const selectedId = searchParams.get('id') ? Number(searchParams.get('id')) : null
  const active = selectedId ? dives.find(d => d.id === selectedId) || dives[0] : dives[0]
  const hasSections = active.sections && active.sections.length > 0
  const showToc = hasSections && active.sections.length > 4

  const extraLinks = []
  if (active.researchNotes) extraLinks.push({ id: 'notes', label: 'Data Sources' })
  extraLinks.push({ id: 'business', label: 'Business Angle' })
  extraLinks.push({ id: 'poc', label: 'POC Status' })
  extraLinks.push({ id: 'resources', label: 'Resources' })

  return (
    <div className="deep-dive">
      {/* Dive selector tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {dives.map(d => (
          <button
            key={d.id}
            onClick={() => setSearchParams({ id: d.id })}
            style={{
              padding: '6px 14px',
              border: active.id === d.id ? '2px solid #333' : '1px solid #ccc',
              borderRadius: 4,
              background: active.id === d.id ? '#333' : '#fff',
              color: active.id === d.id ? '#fff' : '#333',
              cursor: 'pointer',
              fontSize: 12,
              fontWeight: active.id === d.id ? 700 : 400
            }}
          >
            {d.title.length > 30 ? d.title.slice(0, 30) + '…' : d.title}
            <span style={{ marginLeft: 6, opacity: 0.7 }}>{d.progress}%</span>
          </button>
        ))}
      </div>

      {/* Title + meta */}
      <h2>🔬 {active.title}</h2>
      <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>
        {active.startDate && <>Started {active.startDate} · </>}
        {active.lastUpdated && <>Updated {active.lastUpdated}</>}
      </div>
      <div className="progress-bar">
        <div className="fill" style={{ width: `${active.progress}%` }} />
      </div>
      <div style={{ fontSize: 13, color: '#666', marginBottom: 16 }}>{active.progress}% complete</div>

      {active.inspiredBy && (() => {
        const book = books.find(b => b.id === active.inspiredBy)
        return book ? <div style={{ fontSize: 13, marginBottom: 16 }}>📚 Inspired by: <Link to={`/books?id=${book.id}`} style={{ color: '#3498db' }}>{book.title}</Link></div> : null
      })()}

      {/* Main content area: TOC + body */}
      <div style={{ display: 'flex', gap: 32 }} ref={contentRef}>
        {/* Body */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <section>
            <h3>Overview</h3>
            <p style={{ marginBottom: 20 }}>{active.overview}</p>
          </section>

          {/* Rich sections (collapsible) */}
          {hasSections && active.sections.map((s, i) => (
            <CollapsibleSection key={i} section={s} id={`section-${i}`} defaultOpen={true} />
          ))}

          {/* Legacy format fallback */}
          {!hasSections && active.researchNotes && (
            <section>
              <h3>Research Notes</h3>
              <ul>
                {active.researchNotes.map((n, i) => <li key={i}>{n}</li>)}
              </ul>
            </section>
          )}

          {/* Research notes for rich-format dives */}
          {hasSections && active.researchNotes && (
            <section id="extra-notes" style={{ marginTop: 8, scrollMarginTop: 80 }}>
              <h3 style={{ fontSize: 15, marginBottom: 8, borderBottom: '1px solid #eee', paddingBottom: 4 }}>Data Sources & Notes</h3>
              <ul style={{ paddingLeft: 20 }}>
                {active.researchNotes.map((n, i) => <li key={i} style={{ marginBottom: 4, fontSize: 13, color: '#666' }}>{n}</li>)}
              </ul>
            </section>
          )}

          <section id="extra-business" style={{ scrollMarginTop: 80 }}>
            <h3>Business Angle</h3>
            <p>{active.businessAngle}</p>
          </section>

          <section id="extra-poc" style={{ scrollMarginTop: 80 }}>
            <h3>POC Status</h3>
            <p>{active.pocStatus}</p>
          </section>

          <section id="extra-resources" style={{ scrollMarginTop: 80 }}>
            <h3>Resources</h3>
            <ul>
              {active.resources.map((r, i) => (
                <li key={i}><a href={r.url} target="_blank" rel="noreferrer">{r.title}</a></li>
              ))}
            </ul>
          </section>
        </div>

        {/* Table of Contents (sticky, only for long dives) */}
        {showToc && (
          <TableOfContents
            sections={active.sections}
            extras={extraLinks}
            activeId={activeSection}
          />
        )}
      </div>
    </div>
  )
}
