import { useSeo } from '../lib/seo'
import { AI_STATS, GENAI_STEPS, INDUSTRIES } from '../data/site'
import { PageHero, SectionHead, MagneticLink, Aurora, DotGrid } from '../components/Primitives'
import { CTABand } from '../components/Sections'

const AI_LD = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  serviceType: 'AI agent development and generative AI enablement',
  provider: { '@type': 'Organization', name: 'Nexora TechSolutions LLC' },
  description:
    'Purpose-built AI agents on AWS, Azure and Google Cloud using TensorFlow, PyTorch, OpenAI, Hugging Face and LangChain.',
}

export default function AiSolutions() {
  useSeo({
    title: 'AI Solutions',
    description:
      'AI agents built to carry real operational weight — on AWS, Azure and Google Cloud, powered by TensorFlow, PyTorch, OpenAI, Hugging Face and LangChain.',
    path: '/ai-solutions',
    jsonLd: AI_LD,
  })

  return (
    <>
      <PageHero
        crumb="AI Solutions"
        eyebrow="AI Solutions"
        title="AI agents built to carry real operational weight."
        emphasis={['real']}
        lede="We build cutting-edge AI agents on AWS, Azure and Google Cloud — powered by TensorFlow, PyTorch, OpenAI, Hugging Face and LangChain — and apply them across healthcare, finance, e-commerce, manufacturing and logistics."
      />

      <section className="ai-section">
        <Aurora />
        <DotGrid />
        <div className="wrap">
          <SectionHead
            eyebrow="The market position"
            title="AI adoption is no longer the differentiator. Execution is."
            lede="Most organizations have now put AI somewhere. The gap between a pilot and a system people rely on is where the work actually lives."
          />

          <div className="ai-stat-grid reveal">
            {AI_STATS.map((stat) => (
              <div className="ai-stat" key={stat.title}>
                <div
                  className="ring"
                  style={{ background: `conic-gradient(${stat.color} ${stat.pct}%, rgba(255,255,255,.12) 0)` }}
                >
                  <span>{stat.pct}%</span>
                </div>
                <h4>{stat.title}</h4>
                <p>{stat.body}</p>
              </div>
            ))}
          </div>

          <div className="case-card reveal">
            <span className="tag">Case Study</span>
            <h3>Health Care Navigator</h3>
            <p>
              An AI-powered solution transforming patient intake and care planning. Purpose-built agents automate
              data collection, perform clinical assessments, and ensure compliance — cutting administrative
              burden and wait times while improving patient outcomes through EHR integration and automated report
              generation.
            </p>
            <div className="case-agents">
              <span className="agent-pill">Intake Coordination Agent</span>
              <span className="agent-pill">Clinical Assessment Agent</span>
              <span className="agent-pill">Care Planning &amp; Compliance Agent</span>
            </div>
          </div>

          <div className="case-card reveal">
            <span className="tag">Case Study · Generative AI</span>
            <h3>Turning a retail brand&apos;s engagement problem into growth</h3>
            <p style={{ marginBottom: 6 }}>
              A retail company had a strong product line but was losing customers to ineffective marketing and a
              lack of personalization. Nexora&apos;s Generative AI training and delivery team stepped in:
            </p>
            <div className="genai-steps">
              {GENAI_STEPS.map((step) => (
                <div className="genai-step" key={step.n}>
                  <span className="gnum">{step.n}</span>
                  <div>
                    <h4>{step.title}</h4>
                    <p>{step.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="chip-label reveal" style={{ color: 'var(--dark-ink-faint)', marginTop: 8 }}>
            Industry-wide application
          </p>
          <div className="industry-grid reveal">
            {INDUSTRIES.map((industry) => (
              <div className="industry-tile" key={industry.name}>
                <b>{industry.name}</b>
                <span>{industry.body}</span>
              </div>
            ))}
          </div>

          <p className="chip-label reveal" style={{ color: 'var(--dark-ink-faint)', marginTop: 40 }}>
            Platforms &amp; frameworks
          </p>
          <div className="chip-row reveal">
            {['TensorFlow', 'PyTorch', 'OpenAI', 'Hugging Face', 'LangChain', 'AWS', 'Azure', 'Google Cloud'].map(
              (tech) => (
                <span
                  className="chip"
                  key={tech}
                  style={{
                    background: 'rgba(255,255,255,.06)',
                    borderColor: 'rgba(255,255,255,.14)',
                    color: 'var(--dark-ink)',
                  }}
                >
                  {tech}
                </span>
              )
            )}
          </div>

          <div className="hero-actions reveal" style={{ marginTop: 40 }}>
            <MagneticLink to="/contact" className="btn btn-primary btn-lg">
              Scope an AI engagement
            </MagneticLink>
          </div>
        </div>
      </section>

      <section>
        <div className="wrap">
          <SectionHead
            eyebrow="How we build agents"
            title="Scoped against a bottleneck, measured against a baseline."
            lede="An agent that cannot be evaluated is a demo. Every build starts by defining what 'working' means numerically."
          />
          <div className="pillar-grid reveal">
            <div className="pillar">
              <span className="pi">01</span>
              <div>
                <h4>Bottleneck first</h4>
                <p>
                  We pick the operational step that actually costs time or accuracy today, and measure it before
                  anything is built.
                </p>
              </div>
            </div>
            <div className="pillar">
              <span className="pi">02</span>
              <div>
                <h4>Evaluation harness</h4>
                <p>
                  Retrieval quality, tool-call correctness and end-task success are tracked from the first
                  iteration, not retrofitted after launch.
                </p>
              </div>
            </div>
            <div className="pillar">
              <span className="pi">03</span>
              <div>
                <h4>Human in the loop</h4>
                <p>
                  Wherever a wrong answer costs more than a pause, the agent escalates rather than guesses —
                  with the reasoning attached.
                </p>
              </div>
            </div>
            <div className="pillar">
              <span className="pi">04</span>
              <div>
                <h4>Observability on day one</h4>
                <p>
                  Traces, cost per task and failure taxonomies are wired in before go-live, so drift is visible
                  rather than anecdotal.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CTABand
        title="Bring us the bottleneck, not the buzzword."
        body="Describe the process that costs the most time today. We will tell you whether an agent is the right answer — including when it is not."
        secondary={{ to: '/services', label: 'All capabilities' }}
      />
    </>
  )
}
