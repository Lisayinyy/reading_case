import { useEffect, useMemo, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'

const papers = [
  {
    id: 'attention', code: '1706.03762', year: '2017', title: 'Attention Is All You Need', authors: 'Vaswani et al.', tags: ['architecture', 'foundational'],
    abstract: 'The dominant sequence transduction models are based on complex recurrent or convolutional neural networks. This paper proposes a simpler architecture based solely on attention mechanisms, dispensing with recurrence and convolutions entirely.',
    note: 'Replace the memory of a sequence with a map of relationships. The model reads every token in relation to the others.',
    path: [['Self-attention', 'lets each token select what matters in the rest of the sequence.'], ['Multiple heads', 'preserve several kinds of relationships at the same time.'], ['Position signals', 'supply the order that recurrence once carried.']]
  },
  {
    id: 'llama', code: '2302.13971', year: '2023', title: 'LLaMA: Open and Efficient Foundation Language Models', authors: 'Touvron et al.', tags: ['open weights', 'foundation'],
    abstract: 'We introduce LLaMA, a collection of foundation language models ranging from 7B to 65B parameters. The models are trained on publicly available datasets and show that smaller, well-trained models can be highly competitive.',
    note: 'Scale is not only a question of parameter count. The quality and curation of the training mixture changes what a small model can become.',
    path: [['Public training data', 'moves a capable family of models into a reproducible research conversation.'], ['Token budget', 'shows why more compute can sometimes outperform a larger parameter count.'], ['Model family', 'turns one training recipe into several practical deployment sizes.']]
  },
  {
    id: 'mistral', code: '2310.06825', year: '2023', title: 'Mistral 7B', authors: 'Jiang et al.', tags: ['efficiency', 'open weights'],
    abstract: 'Mistral 7B is a language model with 7.3 billion parameters that outperforms larger models across several benchmarks. Grouped-query attention and sliding-window attention make the architecture efficient at inference time.',
    note: 'This is an efficiency paper with a product instinct: spend memory where readers of the context actually need it, not everywhere at once.',
    path: [['Sliding windows', 'keep long contexts tractable by localizing most attention work.'], ['Grouped queries', 'share key-value heads to reduce the inference-memory burden.'], ['Benchmark framing', 'compares capability against the cost of making it available.']]
  },
  {
    id: 'deepseek', code: '2401.02954', year: '2024', title: 'DeepSeekMoE: Towards Ultimate Expert Specialization', authors: 'Dai et al.', tags: ['mixture of experts', 'routing'],
    abstract: 'DeepSeekMoE introduces finer-grained expert segmentation and shared experts to improve specialization in mixture-of-experts language models. The approach increases capacity while keeping computation per token controlled.',
    note: 'A mixture-of-experts model is a library with many rooms. The routing policy decides which rooms deserve to stay lit for each question.',
    path: [['Fine-grained experts', 'break broad capabilities into smaller, more distinct computational roles.'], ['Shared experts', 'keep common knowledge available without making every route duplicate it.'], ['Sparse activation', 'grows total capacity while preserving a bounded cost per token.']]
  }
]

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

function PaperDocument({ paper, illuminated = false }) {
  return (
    <article className={`paper-document ${illuminated ? 'paper-document--lit' : ''}`} aria-label={`${paper.title} paper preview`}>
      <header className="paper-header">
        <div className="paper-kicker"><span>Reading now</span><span>arXiv:{paper.code}</span></div>
        <h1>{paper.title}</h1>
        <p className="paper-authors">{paper.authors} · {paper.year}</p>
        <div className="paper-tags">{paper.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
      </header>
      <section className="paper-body">
        <div className="section-label">Abstract</div>
        <p className="abstract">{paper.abstract}</p>
        <aside className="reading-note"><span>Lisa’s margin note</span><p>{paper.note}</p></aside>
        <div className="section-label">A short reading path</div>
        <ol className="reading-path">
          {paper.path.map(([heading, explanation], index) => <li key={heading}><span>{String(index + 1).padStart(2, '0')}</span><p><strong>{heading}</strong> {explanation}</p></li>)}
        </ol>
      </section>
      <footer className="paper-footer"><span>12 min to finish</span><span>1 / 4 in your shelf</span></footer>
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
  const reduced = useReducedMotion()

  const visiblePapers = useMemo(() => papers.filter((paper) => `${paper.title} ${paper.authors} ${paper.tags.join(' ')}`.toLowerCase().includes(query.toLowerCase())), [query])
  const stageStyle = { '--light-x': `${light.x}%`, '--light-y': `${light.y}%`, '--lamp-x': `${Math.max(23, Math.min(77, light.x))}%`, '--lamp-tilt': `${light.tilt}deg` }

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
        <a className="brand" href="#reading-room" aria-label="Lisa's World home"><span className="brand-mark">L</span><span>Lisa’s World</span></a>
        <nav aria-label="Primary navigation"><a href="#reading-room" aria-current="page">Read</a><a href="#shelf">Shelf <span>04</span></a><a href="#notes">Notes</a></nav>
        <div className="topbar-actions"><button className="icon-button" type="button" aria-label="Toggle lamp" aria-pressed={lampOn} onClick={() => setLampOn((value) => !value)}><LampIcon on={lampOn} /></button><button className="avatar" type="button" aria-label="Open Lisa's profile">LY</button></div>
      </header>

      <section className="reading-room" id="reading-room" ref={stageRef} style={stageStyle}>
        <div className="room-grain" aria-hidden="true" />
        <div className="room-haze" aria-hidden="true" />
        <div className="light-cone" aria-hidden="true" />
        <ParticleMist active={lampOn} reduced={reduced} />

        <div className="lamp-rig" aria-hidden="true"><i className="lamp-wire" /><div className="lamp-canopy" /><div className="lamp-shade"><span className="lamp-bulb" /></div></div>

        <aside className="library-rail" id="shelf" aria-label="Reading shelf">
          <div className="rail-heading"><span>Your shelf</span><span>{papers.length} papers</span></div>
          <label className="search-box"><span className="sr-only">Search papers</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search the shelf" /><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="5.8" fill="none" stroke="currentColor" strokeWidth="1.7" /><path d="m15.2 15.2 4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></svg></label>
          <div className="paper-list">
            {visiblePapers.map((paper) => <button className={`paper-choice ${paper.id === activePaper.id ? 'is-active' : ''}`} key={paper.id} type="button" onClick={() => setActivePaper(paper)}><span className="choice-index">{paper.id === activePaper.id ? '●' : paper.year.slice(-2)}</span><span><strong>{paper.title}</strong><small>{paper.authors}</small></span></button>)}
            {visiblePapers.length === 0 && <p className="empty-state">No paper matches “{query}”.</p>}
          </div>
          <div className="rail-tip"><span>Tip</span><p>The lamp stays with you while the paper moves beneath it.</p></div>
        </aside>

        <section className="reading-stage" aria-label="Active paper">
          <div className="stage-intro"><p>Open research, read slowly.</p><button type="button" className={saved ? 'save-button is-saved' : 'save-button'} onClick={() => setSaved((value) => !value)} aria-pressed={saved}>{saved ? 'Saved to notes' : 'Save insight'}<span aria-hidden="true">↗</span></button></div>
          <div className="document-stack">
            <PaperDocument paper={activePaper} />
            <div className="lit-document-mask" aria-hidden="true"><PaperDocument paper={activePaper} illuminated /></div>
          </div>
          <div className="stage-status"><span><i /> lamp {lampOn ? 'on' : 'off'}</span><span>the light follows your pointer and scroll</span></div>
        </section>

        <footer className="room-footer"><span>Lisa’s World / open paper room</span><span>Built for lingering, not scrolling.</span></footer>
      </section>
    </main>
  )
}

createRoot(document.getElementById('root')).render(<App />)
