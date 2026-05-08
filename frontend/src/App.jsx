import { useState, useEffect } from "react"
import axios from "axios"

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { background: #060914; min-height: 100vh; font-family: 'DM Sans', sans-serif; color: #e8eaf6; }
  .bg-mesh { position: fixed; inset: 0; z-index: 0; background: radial-gradient(ellipse 80% 60% at 20% 10%, rgba(99,102,241,0.12) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 80% 80%, rgba(139,92,246,0.10) 0%, transparent 60%); pointer-events: none; }
  .wrapper { position: relative; z-index: 1; max-width: 860px; margin: 0 auto; padding: 60px 24px 100px; }
  .hero { text-align: center; margin-bottom: 56px; }
  .badge { display: inline-flex; align-items: center; gap: 6px; background: rgba(99,102,241,0.12); border: 1px solid rgba(99,102,241,0.25); border-radius: 100px; padding: 6px 16px; font-size: 12px; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase; color: #a5b4fc; margin-bottom: 24px; }
  .badge-dot { width: 6px; height: 6px; border-radius: 50%; background: #6366f1; box-shadow: 0 0 8px #6366f1; animation: pulse-dot 2s ease-in-out infinite; }
  @keyframes pulse-dot { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
  .hero-title { font-family: 'Syne', sans-serif; font-size: clamp(38px, 7vw, 68px); font-weight: 800; line-height: 1.05; letter-spacing: -0.03em; margin-bottom: 20px; background: linear-gradient(135deg, #e0e7ff 0%, #a5b4fc 40%, #818cf8 70%, #c084fc 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
  .hero-sub { font-size: 17px; font-weight: 300; color: #94a3b8; line-height: 1.7; max-width: 480px; margin: 0 auto; }
  .input-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 20px; padding: 28px; margin-bottom: 20px; backdrop-filter: blur(12px); }
  .input-label { font-size: 11px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: #64748b; margin-bottom: 12px; display: block; }
  .textarea { width: 100%; height: 160px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; padding: 16px; font-size: 14px; font-family: 'DM Sans', sans-serif; color: #e2e8f0; resize: vertical; outline: none; line-height: 1.6; }
  .textarea::placeholder { color: #334155; }
  .textarea:focus { border-color: rgba(99,102,241,0.4); }
  .char-count { font-size: 11px; color: #334155; text-align: right; margin-top: 8px; }
  .analyze-btn { width: 100%; padding: 18px; border-radius: 14px; border: none; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; font-family: 'Syne', sans-serif; font-size: 16px; font-weight: 700; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s; position: relative; overflow: hidden; }
  .analyze-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(99,102,241,0.4); }
  .analyze-btn:disabled { opacity: 0.6; cursor: not-allowed; }
  .error-box { background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.2); border-radius: 12px; padding: 16px 20px; color: #fca5a5; font-size: 14px; margin: 16px 0; }
  .results { animation: fade-up 0.5s ease forwards; }
  @keyframes fade-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  .divider { display: flex; align-items: center; gap: 12px; margin: 32px 0 20px; }
  .divider-line { flex: 1; height: 1px; background: rgba(255,255,255,0.06); }
  .divider-label { font-size: 10px; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; color: #334155; }
  .score-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 20px; padding: 40px 28px; text-align: center; margin-bottom: 16px; }
  .score-ring-wrap { position: relative; width: 160px; height: 160px; margin: 0 auto 24px; }
  .score-ring-wrap svg { transform: rotate(-90deg); }
  .score-number { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; }
  .score-num { font-family: 'Syne', sans-serif; font-size: 48px; font-weight: 800; background: linear-gradient(135deg, #e0e7ff, #a5b4fc); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
  .score-denom { font-size: 12px; color: #475569; }
  .one-liner { font-size: 16px; font-style: italic; color: #94a3b8; line-height: 1.6; max-width: 500px; margin: 0 auto; font-weight: 300; }
  .glass-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 16px; padding: 22px 24px; margin-bottom: 12px; transition: border-color 0.3s, transform 0.3s; }
  .glass-card:hover { border-color: rgba(255,255,255,0.12); transform: translateY(-1px); }
  .card-header { display: flex; align-items: center; gap: 10px; margin-bottom: 14px; }
  .card-icon { width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 15px; flex-shrink: 0; }
  .icon-orange { background: rgba(251,146,60,0.15); }
  .icon-green { background: rgba(52,211,153,0.15); }
  .icon-red { background: rgba(248,113,113,0.15); }
  .icon-purple { background: rgba(167,139,250,0.15); }
  .icon-blue { background: rgba(96,165,250,0.15); }
  .icon-yellow { background: rgba(251,191,36,0.15); }
  .card-title { font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 700; color: #e2e8f0; }
  .card-body { font-size: 14px; color: #94a3b8; line-height: 1.75; font-weight: 300; }
  .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px; }
  @media (max-width: 600px) { .two-col { grid-template-columns: 1fr; } }
  .list-item { display: flex; align-items: flex-start; gap: 10px; padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.04); font-size: 13px; color: #94a3b8; line-height: 1.5; }
  .list-item:last-child { border-bottom: none; }
  .list-dot { width: 6px; height: 6px; border-radius: 50%; margin-top: 6px; flex-shrink: 0; }
  .dot-green { background: #34d399; box-shadow: 0 0 6px rgba(52,211,153,0.5); }
  .dot-red { background: #f87171; box-shadow: 0 0 6px rgba(248,113,113,0.5); }
  .headline-before { font-size: 13px; color: #475569; text-decoration: line-through; margin-bottom: 10px; font-style: italic; }
  .headline-after { font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 700; color: #e2e8f0; line-height: 1.4; }
  .action-item { display: flex; align-items: flex-start; gap: 14px; padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.04); }
  .action-item:last-child { border-bottom: none; }
  .action-num { font-family: 'Syne', sans-serif; font-size: 11px; font-weight: 800; color: #4f46e5; background: rgba(79,70,229,0.12); border: 1px solid rgba(79,70,229,0.2); border-radius: 6px; padding: 3px 8px; flex-shrink: 0; margin-top: 2px; }
  .action-text { font-size: 13px; color: #94a3b8; line-height: 1.6; }
  .loading-wrap { text-align: center; padding: 60px 20px; }
  .loading-spinner { width: 48px; height: 48px; border: 2px solid rgba(99,102,241,0.15); border-top-color: #6366f1; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 20px; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .loading-text { font-size: 14px; color: #475569; font-weight: 300; }
`

function ScoreRing({ score }) {
  const r = 70
  const circ = 2 * Math.PI * r
  const color = score >= 70 ? "#34d399" : score >= 40 ? "#fbbf24" : "#f87171"
  const [animScore, setAnimScore] = useState(0)

  useEffect(() => {
    let s = 0
    const step = () => {
      s += 2
      if (s <= score) { setAnimScore(s); requestAnimationFrame(step) }
      else setAnimScore(score)
    }
    requestAnimationFrame(step)
  }, [score])

  const offset = circ - (animScore / 100) * circ

  return (
    <div className="score-ring-wrap">
      <svg width="160" height="160" viewBox="0 0 160 160">
        <circle cx="80" cy="80" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
        <circle cx="80" cy="80" r={r} fill="none" stroke={color} strokeWidth="10" strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={offset}
          style={{ filter: `drop-shadow(0 0 8px ${color})`, transition: "stroke-dashoffset 0.05s linear" }} />
      </svg>
      <div className="score-number">
        <span className="score-num">{animScore}</span>
        <span className="score-denom">/100</span>
      </div>
    </div>
  )
}

export default function App() {
  const [profileText, setProfileText] = useState("")
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const analyzeProfile = async () => {
    if (!profileText.trim()) return
    setLoading(true); setError(""); setResult(null)
    try {
      const response = await axios.post("http://localhost:8000/analyze", { profile_text: profileText })
      setResult(response.data)
    } catch (err) {
      setError("Something went wrong. Make sure the backend is running.")
    }
    setLoading(false)
  }

  return (
    <>
      <style>{styles}</style>
      <div className="bg-mesh" />
      <div className="wrapper">
        <div className="hero">
          <div className="badge"><div className="badge-dot" />AI Profile Analyzer</div>
          <h1 className="hero-title">Your LinkedIn is<br />quietly sabotaging<br />your career.</h1>
          <p className="hero-sub">Paste your profile. ProfilePilot reads it like a recruiter, roasts it like a friend, and rewrites it like a copywriter.</p>
        </div>

        <div className="input-card">
          <span className="input-label">Your LinkedIn Profile</span>
          <textarea className="textarea" placeholder="Paste your headline, about section, experience, and skills here..."
            value={profileText} onChange={(e) => setProfileText(e.target.value)} />
          <div className="char-count">{profileText.length} characters</div>
        </div>

        <button className="analyze-btn" onClick={analyzeProfile} disabled={loading || !profileText.trim()}>
          {loading ? "Analyzing... ✈️" : "Analyze My Profile →"}
        </button>

        {error && <div className="error-box">⚠️ {error}</div>}

        {loading && (
          <div className="loading-wrap">
            <div className="loading-spinner" />
            <div className="loading-text">Reading your profile like a recruiter...</div>
          </div>
        )}

        {result && (
          <div className="results">
            <div className="divider"><div className="divider-line" /><div className="divider-label">Analysis · {new Date().toLocaleDateString()}</div><div className="divider-line" /></div>

            <div className="score-card">
              <ScoreRing score={result.profile_score} />
              <p className="one-liner">"{result.one_liner}"</p>
            </div>

            <div className="glass-card">
              <div className="card-header"><div className="card-icon icon-orange">🔥</div><div className="card-title">The Roast</div></div>
              <div className="card-body">{result.roast}</div>
            </div>

            <div className="two-col">
              <div className="glass-card" style={{marginBottom:0}}>
                <div className="card-header"><div className="card-icon icon-green">✓</div><div className="card-title">What's Working</div></div>
                {result.strengths.map((s, i) => <div className="list-item" key={i}><div className="list-dot dot-green" />{s}</div>)}
              </div>
              <div className="glass-card" style={{marginBottom:0}}>
                <div className="card-header"><div className="card-icon icon-red">!</div><div className="card-title">What's Costing You</div></div>
                {result.weaknesses.map((w, i) => <div className="list-item" key={i}><div className="list-dot dot-red" />{w}</div>)}
              </div>
            </div>

            <div className="glass-card" style={{marginTop:"12px"}}>
              <div className="card-header"><div className="card-icon icon-purple">✦</div><div className="card-title">Rewritten Headline</div></div>
              <div className="headline-before">{profileText.split("\n")[0]}</div>
              <div className="headline-after">{result.rewritten_headline}</div>
            </div>

            <div className="glass-card">
              <div className="card-header"><div className="card-icon icon-blue">≡</div><div className="card-title">Rewritten About Section</div></div>
              <div className="card-body">{result.rewritten_about}</div>
            </div>

            <div className="glass-card">
              <div className="card-header"><div className="card-icon icon-yellow">★</div><div className="card-title">Action Plan</div></div>
              {result.action_tips.map((t, i) => (
                <div className="action-item" key={i}>
                  <div className="action-num">0{i+1}</div>
                  <div className="action-text">{t}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
}