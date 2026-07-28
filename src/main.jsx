import { useEffect, useMemo, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { papers, PAGE_SIZE, totalPages } from './papers.js'
import './styles.css'

function useReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])
  return reduced
}

function ParticleMist({ active, reduced }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !active || reduced) return undefined
    const context = canvas.getContext('2d')
    let frame
    let start = performance.now()
    const particles = Array.from({ length: 70 }, (_, index) => ({
      seed: index * 0.713,
      x: 0.18 + ((index * 17) % 63) / 100,
      y: 0.2 + ((index * 29) % 45) / 100,
      radius: 1.5 + (index % 4) * 0.7,
    }))

    const resize = () => {
      const bounds = canvas.getBoundingClientRect()
      const scale = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.max(1, Math.round(bounds.width * scale))
      canvas.height = Math.max(1, Math.round(bounds.height * scale))
      context.setTransform(scale, 0, 0, scale, 0, 0)
    }
    const draw = (now) => {
      const { width, height } = canvas.getBoundingClientRect()
      const time = (now - start) / 1000
      context.clearRect(0, 0, width, height)
      particles.forEach((particle) => {
        const flow = Math.sin(time * 0.5 + particle.seed * 7) * 0.045
        const drift = ((time * (0.018 + (particle.seed % 0.01))) + particle.seed) % 1
        const x = width * (particle.x + flow + drift * 0.12)
        const y = height * (particle.y - drift * 0.3 + Math.cos(time + particle.seed * 12) * 0.025)
        const alpha = 0.04 + ((Math.sin(time * 1.4 + particle.seed * 18) + 1) * 0.035)
        const glow = context.createRadialGradient(x, y, 0, x, y, particle.radius * 11)
        glow.addColorStop(0, `rgba(255, 192, 103, ${alpha})`)
        glow.addColorStop(1, 'rgba(255, 192, 103, 0)')
        context.fillStyle = glow
        context.beginPath()
        context.arc(x, y, particle.radius * 11, 0, Math.PI * 2)
        context.fill()
      })
      frame = requestAnimationFrame(draw)
    }
    resize()
    window.addEventListener('resize', resize)
    frame = requestAnimationFrame(draw)
    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(frame)
    }
  }, [active, reduced])

  return <canvas className="particle-mist" ref={canvasRef} aria-hidden="true" />
}

function PaperDocument({ paper, position, total, illuminated = false }) {
  const arxivUrl = paper.absUrl || `https://arxiv.org/abs/${paper.code}`
  const pdfUrl = paper.pdfUrl || `https://arxiv.org/pdf/${paper.code}`
  return (
    <article className={`paper-document ${illuminated ? 'paper-document--lit' : ''}`} aria-label={`${paper.title} paper preview`}>
      <header className="paper-header">
        <div className="paper-kicker">
          <span>Reading now</span>
          <a className="paper-arxiv" href={arxivUrl} target="_blank" rel="noopener noreferrer" aria-label={`Open ${paper.title} on ${paper.venue || 'arXiv'} in a new tab`}>{paper.venue ? `${paper.venue}:${paper.code}` : `arXiv:${paper.code}`}<span aria-hidden="true">↗</span></a>
        </div>
        <h1>{paper.title}</h1>
        <p className="paper-authors">{paper.authors} · {paper.year}</p>
        <div className="paper-tags">{paper.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
      </header>
      <section className="paper-body">
        <div className="section-label">Abstract</div>
        <p className="abstract">{paper.abstract}</p>
        <aside className="reading-note"><span>Reading Case note</span><p>{paper.note}</p></aside>
        <div className="section-label">A short reading path</div>
        <ol className="reading-path">
          {paper.path.map(([heading, explanation], index) => <li key={heading}><span>{String(index + 1).padStart(2, '0')}</span><p><strong>{heading}</strong> {explanation}</p></li>)}
        </ol>
      </section>
      <footer className="paper-footer">
        <span>12 min to finish</span>
        <span className="paper-footer-meta">
          <a className="paper-link" href={pdfUrl} target="_blank" rel="noopener noreferrer" aria-label={`Download ${paper.title} as PDF`}>Read full paper<span aria-hidden="true">↗</span></a>
          <span className="paper-footer-position">{String(position).padStart(2, '0')} / {String(total).padStart(2, '0')} in your shelf</span>
        </span>
      </footer>
    </article>
  )
}

function LampIcon({ on }) {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2v5m-5.5 3.5h11L20 17H4l2.5-6.5Z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" /><path d="M8 20h8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /><circle cx="12" cy="13" r="1.4" fill={on ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.2" /></svg>
}

function App() {
  const stageRef = useRef(null)
  const pointerRef = useRef(null)
  const [lampOn, setLampOn] = useState(true)
  const [activePaper, setActivePaper] = useState(papers[0])
  const [query, setQuery] = useState('')
  const [saved, setSaved] = useState(false)
  const [light, setLight] = useState({ x: 50, y: 45, tilt: 0 })
  const [currentPage, setCurrentPage] = useState(0)
  const reduced = useReducedMotion()

  // Filter first; paginate only when the user is not searching.
  const filteredPapers = useMemo(
    () => papers.filter((paper) => `${paper.title} ${paper.authors} ${paper.tags.join(' ')}`.toLowerCase().includes(query.toLowerCase())),
    [query],
  )
  const searching = query.trim().length > 0
  const pagedPapers = useMemo(
    () => (searching ? filteredPapers : filteredPapers.slice(currentPage * PAGE_SIZE, currentPage * PAGE_SIZE + PAGE_SIZE)),
    [filteredPapers, currentPage, searching],
  )
  const stageStyle = { '--light-x': `${light.x}%`, '--light-y': `${light.y}%`, '--lamp-x': `${Math.max(23, Math.min(77, light.x))}%`, '--lamp-tilt': `${light.tilt}deg` }

  // Prev / Next operate on the full shelf (not the paginated slice) so the user can read the 32 papers in order without having to flip pages manually.
  const activeIndex = useMemo(() => papers.findIndex((paper) => paper.id === activePaper.id), [activePaper.id])
  const prevPaper = activeIndex > 0 ? papers[activeIndex - 1] : null
  const nextPaper = activeIndex >= 0 && activeIndex < papers.length - 1 ? papers[activeIndex + 1] : null
  const goToPaper = (target) => {
    if (!target) return
    setActivePaper(target)
    if (searching) return
    const targetPage = Math.floor(papers.findIndex((paper) => paper.id === target.id) / PAGE_SIZE)
    if (targetPage !== currentPage) setCurrentPage(targetPage)
  }

  // When the user is on a non-searching page, sync the active paper to the current page so the highlight is always visible.
  useEffect(() => {
    if (searching) return
    if (pagedPapers.length === 0) return
    if (!pagedPapers.some((paper) => paper.id === activePaper.id)) {
      setActivePaper(pagedPapers[0])
    }
  }, [pagedPapers, searching, activePaper.id])

  // Keyboard shortcuts: ← / → to move between papers (skipped while typing in the search box).
  useEffect(() => {
    const onKey = (event) => {
      const tag = (event.target && event.target.tagName) || ''
      if (tag === 'INPUT' || tag === 'TEXTAREA') return
      if (event.key === 'ArrowLeft') { goToPaper(prevPaper); event.preventDefault() }
      else if (event.key === 'ArrowRight') { goToPaper(nextPaper); event.preventDefault() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [prevPaper, nextPaper, searching, currentPage])

  useEffect(() => {
    if (reduced || !lampOn) return undefined
    const updateLightPosition = () => {
      const stage = stageRef.current
      if (!stage) return
      const rect = stage.getBoundingClientRect()
      const pointer = pointerRef.current ?? { x: window.innerWidth / 2, y: window.innerHeight / 2 }
      const x = ((pointer.x - rect.left) / rect.width) * 100
      const y = ((pointer.y - rect.top) / rect.height) * 100
      const boundedX = Math.max(12, Math.min(88, x))
      setLight({ x: boundedX, y: Math.max(19, Math.min(78, y)), tilt: Math.max(-10, Math.min(10, (boundedX - 50) * 0.17)) })
    }
    const followCursor = (event) => {
      pointerRef.current = { x: event.clientX, y: event.clientY }
      updateLightPosition()
    }
    const followScroll = () => updateLightPosition()
    updateLightPosition()
    window.addEventListener('pointermove', followCursor, { passive: true })
    window.addEventListener('scroll', followScroll, { passive: true })
    window.addEventListener('resize', followScroll)
    return () => {
      window.removeEventListener('pointermove', followCursor)
      window.removeEventListener('scroll', followScroll)
      window.removeEventListener('resize', followScroll)
    }
  }, [lampOn, reduced])

  return (
    <main className={`app ${lampOn ? 'lamp-on' : 'lamp-off'}`}>
      <header className="topbar">
        <a className="brand" href="#reading-room" aria-label="Reading Case home"><span className="brand-mark">R</span><span>Reading Case</span></a>
        <nav aria-label="Primary navigation"><a href="#reading-room" aria-current="page">Read</a><a href="#shelf">Shelf <span>{String(papers.length).padStart(2, '0')}</span></a><a href="#notes">Notes</a></nav>
        <div className="topbar-actions"><button className="icon-button" type="button" aria-label="Toggle lamp" aria-pressed={lampOn} onClick={() => setLampOn((value) => !value)}><LampIcon on={lampOn} /></button><button className="avatar" type="button" aria-label="Open Reading Case profile">RC</button></div>
      </header>

      <section className="reading-room" id="reading-room" ref={stageRef} style={stageStyle}>
        <div className="room-grain" aria-hidden="true" />
        <div className="room-haze" aria-hidden="true" />
        <div className="light-cone" aria-hidden="true" />
        <ParticleMist active={lampOn} reduced={reduced} />

        <div className="lamp-rig" aria-hidden="true"><i className="lamp-wire" /><div className="lamp-canopy" /><div className="lamp-shade"><span className="lamp-bulb" /></div></div>

        <aside className="library-rail" id="shelf" aria-label="Reading shelf">
          <div className="rail-heading"><span>Your shelf</span><span>{searching ? `${filteredPapers.length} / ${papers.length} papers` : `${String(currentPage * PAGE_SIZE + pagedPapers.length).padStart(2, '0')} / ${String(papers.length).padStart(2, '0')} papers`}</span></div>
          <label className="search-box"><span className="sr-only">Search papers</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search the shelf" /><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="5.8" fill="none" stroke="currentColor" strokeWidth="1.7" /><path d="m15.2 15.2 4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></svg></label>
          <div className="paper-list">
            {pagedPapers.map((paper) => <button className={`paper-choice ${paper.id === activePaper.id ? 'is-active' : ''}`} key={paper.id} type="button" onClick={() => setActivePaper(paper)}><span className="choice-index">{paper.id === activePaper.id ? '●' : paper.year.slice(-2)}</span><span><strong>{paper.title}</strong><small>{paper.authors}</small></span></button>)}
            {pagedPapers.length === 0 && <p className="empty-state">No paper matches “{query}”.</p>}
          </div>
          <div className="pager" role="group" aria-label="Paginate reading shelf">
            <button className="pager-arrow" type="button" onClick={() => setCurrentPage((value) => Math.max(0, value - 1))} disabled={searching || currentPage === 0} aria-label="Previous page">‹</button>
            <ol className="pager-pages" aria-label={`Page ${currentPage + 1} of ${totalPages}`}>
              {Array.from({ length: totalPages }, (_, index) => (
                <li key={index}>
                  <button className={`pager-page ${index === currentPage ? 'is-active' : ''}`} type="button" onClick={() => setCurrentPage(index)} disabled={searching} aria-label={`Go to page ${index + 1}`} aria-current={index === currentPage ? 'page' : undefined}>
                    {String(index + 1).padStart(2, '0')}
                  </button>
                </li>
              ))}
            </ol>
            <button className="pager-arrow" type="button" onClick={() => setCurrentPage((value) => Math.min(totalPages - 1, value + 1))} disabled={searching || currentPage === totalPages - 1} aria-label="Next page">›</button>
          </div>
          <p className="pager-hint" aria-live="polite">{searching ? 'Searching across every page' : `Showing ${String(currentPage * PAGE_SIZE + 1).padStart(2, '0')}–${String(currentPage * PAGE_SIZE + pagedPapers.length).padStart(2, '0')} of ${String(papers.length).padStart(2, '0')}`}</p>
          <div className="rail-tip"><span>Tip</span><p>The lamp stays with you while the paper moves beneath it.</p></div>
        </aside>

        <section className="reading-stage" aria-label="Active paper">
          <div className="stage-intro">
            <div className="stage-nav-meta">
              <p>Open research, read slowly.</p>
              <span className="stage-nav-hint">Use <kbd>←</kbd> <kbd>→</kbd> to turn the page</span>
            </div>
            <button type="button" className={saved ? 'save-button is-saved' : 'save-button'} onClick={() => setSaved((value) => !value)} aria-pressed={saved}>{saved ? 'Saved to notes' : 'Save insight'}<span aria-hidden="true">↗</span></button>
          </div>
          <div className="document-stack">
            <PaperDocument paper={activePaper} position={papers.findIndex((paper) => paper.id === activePaper.id) + 1} total={papers.length} />
            <div className="lit-document-mask" aria-hidden="true"><PaperDocument paper={activePaper} position={papers.findIndex((paper) => paper.id === activePaper.id) + 1} total={papers.length} illuminated /></div>
          </div>
          <div className="stage-status"><span><i /> lamp {lampOn ? 'on' : 'off'}</span><span>the light follows your pointer and scroll</span></div>
        </section>

        <footer className="room-footer"><span>Reading Case / open paper room</span><span>Built for lingering, not scrolling.</span></footer>
      </section>
    </main>
  )
}

createRoot(document.getElementById('root')).render(<App />)
