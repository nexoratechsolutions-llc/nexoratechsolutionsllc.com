import { useSeo } from '../lib/seo'
import { COMPANY, IMG_FRICTIONS, IMG_TRACKS, IMG_CYCLE, IMG_COMPARE, IMG_FAQ, IMG_TIERS } from '../data/site'
import { PageHero, SectionHead, GlowCard, MagneticLink, Reveal } from '../components/Primitives'
import { FaqList, Stepper, CTABand } from '../components/Sections'
import ImgAssessmentForm from '../components/forms/ImgAssessmentForm'
import { Icon } from '../components/Icons'

const IMG_LD = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: IMG_FAQ.map((item) => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: { '@type': 'Answer', text: item.a },
  })),
}

export default function ImgPathway() {
  useSeo({
    title: 'Nexora IMG Pathway',
    description:
      'A single programme covering USMLE Step preparation, match mentorship, ERAS support, interview preparation, U.S. clinical experience and research — sequenced against the cycle calendar.',
    path: '/img-pathway',
    jsonLd: IMG_LD,
  })

  return (
    <>
      <PageHero
        crumb="IMG Pathway"
        eyebrow="New service line — Nexora IMG Pathway"
        title="The same delivery discipline, applied to the residency journey."
        emphasis={['discipline']}
        lede="Nexora is extending its operating model into medical education. Assessment before advice, a roadmap with dated checkpoints, one accountable owner throughout — now for international medical graduates working toward a U.S. residency, from first Step exam to Match Day."
      >
        <div className="hero-actions">
          <MagneticLink to="/img-pathway#assessment" className="btn btn-primary btn-lg">
            Request an assessment call
          </MagneticLink>
          <a className="btn btn-ghost btn-lg" href={COMPANY.phoneHref}>
            {COMPANY.phone}
          </a>
        </div>
      </PageHero>

      {/* ---------- Frictions ---------- */}
      <section>
        <div className="wrap">
          <SectionHead
            eyebrow="Where cycles are lost"
            title="Six places the journey usually goes wrong."
            lede="None of these are about effort. They are about sequence — and sequence is something someone has to own."
          />
          <div className="friction-grid reveal">
            {IMG_FRICTIONS.map((item) => (
              <div className="friction-cell" key={item.n}>
                <span className="fnum">{item.n}</span>
                <h4>{item.title}</h4>
                <p>{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Tracks ---------- */}
      <section>
        <div className="wrap">
          <div className="sub-head reveal">
            <h3>What the pathway covers</h3>
            <p>
              Six tracks, run as one programme rather than six purchases, so work in each one is timed against
              the others.
            </p>
          </div>
          <div className="services-grid reveal">
            {IMG_TRACKS.map((track) => (
              <GlowCard className="service-card" key={track.title}>
                <div className="service-icon">{Icon[track.icon](22)}</div>
                <h3>{track.title}</h3>
                <p>{track.body}</p>
              </GlowCard>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- Cycle ---------- */}
      <section className="impact">
        <div className="wrap">
          <div className="sub-head reveal" style={{ marginTop: 0 }}>
            <h3>How a cycle runs</h3>
            <p>Five phases, each closing with a checkpoint that decides whether the next one starts.</p>
          </div>
          <Stepper steps={IMG_CYCLE} />
        </div>
      </section>

      {/* ---------- Comparison ---------- */}
      <section>
        <div className="wrap">
          <div className="sub-head reveal" style={{ marginTop: 0 }}>
            <h3>Why run it this way</h3>
            <p>The difference is not more content. It is ownership of the sequence.</p>
          </div>

          <div className="compare-grid reveal">
            <div className="compare-col">
              <p className="tag">The usual approach</p>
              <h3>Buying pieces separately</h3>
              <ul>
                {IMG_COMPARE.usual.map((line) => (
                  <li key={line}>
                    <span className="mark" aria-hidden>
                      —
                    </span>
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="compare-col ours">
              <p className="tag">Nexora IMG Pathway</p>
              <h3>One programme, one owner</h3>
              <ul>
                {IMG_COMPARE.ours.map((line) => (
                  <li key={line}>
                    <span className="mark" aria-hidden>
                      →
                    </span>
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Tiers ---------- */}
      <section>
        <div className="wrap">
          <div className="sub-head reveal" style={{ marginTop: 0 }}>
            <h3>How people engage</h3>
            <p>
              Three shapes, depending on how much of the sequence you need someone to own. The assessment call
              decides which one is honest for your profile.
            </p>
          </div>

          <div className="tier-grid reveal">
            {IMG_TIERS.map((tier) => (
              <div className={`tier${tier.featured ? ' featured' : ''}`} key={tier.name}>
                {tier.featured && <span className="tier-flag">Most chosen</span>}
                <h3>{tier.name}</h3>
                <p className="tier-for">{tier.for}</p>
                <ul>
                  {tier.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <a className="btn btn-ghost" href="#assessment">
                  Discuss this option
                </a>
              </div>
            ))}
          </div>
          <Reveal>
            <p className="muted-note" style={{ marginTop: 18 }}>
              Pricing is set after the assessment call, because it depends on which tracks your profile
              genuinely needs. We would rather quote a smaller programme than sell you one you will not use.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ---------- FAQ ---------- */}
      <section className="impact">
        <div className="wrap">
          <div className="sub-head reveal" style={{ marginTop: 0 }}>
            <h3>Questions we get first</h3>
          </div>
          <FaqList items={IMG_FAQ} />
        </div>
      </section>

      {/* ---------- Assessment form ---------- */}
      <section id="assessment">
        <div className="wrap">
          <div className="contact-grid">
            <Reveal variant="reveal-left" className="contact-aside">
              <div>
                <p className="eyebrow">Assessment call</p>
                <h2 style={{ fontSize: 'clamp(1.6rem,3vw,2.2rem)', marginTop: 12 }}>
                  Find out where your profile actually stands.
                </h2>
                <p className="lede" style={{ marginTop: 14 }}>
                  No obligation — an honest read of your timeline and what it would take. Bring your score
                  report if you have one.
                </p>
              </div>

              <div className="contact-method">
                <span className="ci">{Icon.mail(18)}</span>
                <div>
                  <h4>Email</h4>
                  <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>
                </div>
              </div>
              <div className="contact-method">
                <span className="ci">{Icon.phone(18)}</span>
                <div>
                  <h4>Phone</h4>
                  <a href={COMPANY.phoneHref}>{COMPANY.phone}</a>
                </div>
              </div>
              <div className="contact-method">
                <span className="ci">{Icon.calendar(18)}</span>
                <div>
                  <h4>Response time</h4>
                  <p>One business day, {COMPANY.hours}</p>
                </div>
              </div>
            </Reveal>

            <Reveal variant="reveal-right">
              <ImgAssessmentForm />
            </Reveal>
          </div>
        </div>
      </section>

      <CTABand
        title="One programme. One owner. One cycle at a time."
        body="If you are mid-cycle and something has already slipped, that is exactly the conversation to have now rather than in March."
        primary={{ to: '/img-pathway#assessment', label: 'Request an assessment call' }}
        secondary={{ to: '/contact', label: 'General enquiry' }}
      />
    </>
  )
}
