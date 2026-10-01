import Reveal from '../../components/Reveal'
import AiRing from '../../components/AiRing'
import { CtaBand, HeroBackdrop, PageHero, SectionHead } from '../../components/Blocks'
import { aiStats, genAiSteps, industries, navigatorAgents } from '../../data/technical'

export default function AiSolutions() {
  return (
    <>
      <PageHero
        eyebrow="AI Solutions"
        title={<>AI agents built to carry real <em>operational</em> weight.</>}
        lede="We build cutting-edge AI agents on AWS, Azure and Google Cloud — powered by TensorFlow, PyTorch, OpenAI, Hugging Face and LangChain — and apply them across healthcare, finance, e-commerce, manufacturing and logistics."
      />

      {/* ── Stats dark panel ── */}
      <section className="dark-panel">
        <HeroBackdrop />
        <div className="wrap">
          <SectionHead
            eyebrow="The numbers behind AI adoption"
            title={<>Why AI is no longer optional for <em>serious</em> businesses.</>}
          />
          <Reveal effect="zoom" className="ai-stat-grid">
            {aiStats.map((s) => (
              <div className="ai-stat" key={s.title}>
                <AiRing value={s.value} tone={s.tone} />
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </div>
            ))}
          </Reveal>

          {/* ── Case study 1: Health Care Navigator ── */}
          <SectionHead
            eyebrow="Case Study"
            title="Health Care Navigator"
            lede="An AI-powered solution transforming patient intake and care planning."
          />
          <Reveal as="article" effect="flip" className="case-card">
            <span className="tag">Healthcare · Agentic AI</span>
            <p>
              Purpose-built agents automate data collection, perform clinical assessments, and ensure
              compliance — cutting administrative burden and wait times while improving patient outcomes
              through EHR integration and automated report generation.
            </p>
            <ul className="case-agents">
              {navigatorAgents.map((a) => (
                <li className="agent-pill" key={a}>{a}</li>
              ))}
            </ul>
          </Reveal>

          {/* ── Case study 2: Generative AI ── */}
          <Reveal as="article" effect="flip" className="case-card">
            <span className="tag">Case Study · Generative AI</span>
            <h2>Turning a retail brand's engagement problem into growth</h2>
            <p>
              A retail company had a strong product line but was losing customers to ineffective marketing
              and a lack of personalization. Nexora's Generative AI training and delivery team stepped in:
            </p>
            <ol className="genai-steps">
              {genAiSteps.map((s, i) => (
                <li className="genai-step" key={s.title}>
                  <span className="gnum">{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <h3>{s.title}</h3>
                    <p>{s.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Reveal>

          {/* ── Industry application ── */}
          <SectionHead
            eyebrow="Industry-wide application"
            title="AI wherever it removes real friction."
          />
          <Reveal effect="zoom" stagger className="industry-grid">
            {industries.map((i) => (
              <div className="industry-tile" key={i.title}>
                <b>{i.title}</b>
                <span>{i.text}</span>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <CtaBand practice="technical" />
    </>
  )
}
