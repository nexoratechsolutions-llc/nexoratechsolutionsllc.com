import { useState } from 'react'
import { useSeo } from '../lib/seo'
import { OPEN_ROLES, BENEFITS } from '../data/site'
import { PageHero, SectionHead, Reveal } from '../components/Primitives'
import CareersForm from '../components/forms/CareersForm'
import { Icon } from '../components/Icons'

const JOBS_LD = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Open roles at Nexora TechSolutions',
  itemListElement: OPEN_ROLES.map((role, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: role.title,
  })),
}

export default function Careers() {
  const [selectedRole, setSelectedRole] = useState(undefined)

  useSeo({
    title: 'Careers',
    description:
      'Open roles at Nexora TechSolutions — engineering, AI, platform, quality, delivery and the IMG Pathway. Remote-first, certification funded, ownership over tickets.',
    path: '/careers',
    jsonLd: JOBS_LD,
  })

  const applyTo = (title) => {
    setSelectedRole(title)
    const el = document.getElementById('apply')
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <>
      <PageHero
        crumb="Careers"
        eyebrow="Careers at Nexora"
        title="Work where the sequence is owned, not improvised."
        emphasis={['owned']}
        lede="We are a small, remote-first team building software, AI systems and delivery practice for clients who cannot afford a fragile release. If that sounds like the work you want, these are the seats open."
      />

      <section>
        <div className="wrap">
          <SectionHead
            eyebrow="Open roles"
            title="Seven seats, all currently open."
            lede="Every role is remote-first unless noted. We hire for judgement and follow-through, then fund the certifications."
          />

          <div className="role-list reveal">
            {OPEN_ROLES.map((role) => (
              <div className="role-row" key={role.title}>
                <div>
                  <h3>{role.title}</h3>
                  <span className="role-tag">{role.team}</span>
                </div>
                <span className="meta">{role.location}</span>
                <span className="meta">{role.type}</span>
                <button type="button" className="btn btn-ghost btn-sm" onClick={() => applyTo(role.title)}>
                  Apply
                  <span className="arrow" aria-hidden>
                    {Icon.arrow(13)}
                  </span>
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="impact">
        <div className="wrap">
          <SectionHead
            eyebrow="How we work"
            title="What the job is actually like."
            lede="Four things we hold to. If any of them sound like a problem rather than a benefit, we are probably not the right fit — which is useful to know now."
          />
          <div className="pillar-grid reveal">
            {BENEFITS.map((benefit) => (
              <div className="pillar" key={benefit.title}>
                <span className="pi">{Icon[benefit.icon](20)}</span>
                <div>
                  <h4>{benefit.title}</h4>
                  <p>{benefit.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="wrap">
          <div className="contact-grid">
            <Reveal variant="reveal-left" className="contact-aside">
              <div>
                <p className="eyebrow">Apply</p>
                <h2 style={{ fontSize: 'clamp(1.6rem,3vw,2.2rem)', marginTop: 12 }}>
                  One form. Read by a person.
                </h2>
                <p className="lede" style={{ marginTop: 14 }}>
                  No tracking-system black hole. Tell us about one thing you owned end to end and what you would
                  change about how you built it — that tells us more than a CV keyword scan.
                </p>
              </div>

              <div className="split-panel">
                <p className="badge-pill" style={{ marginBottom: 6 }}>
                  <span className="live-dot" aria-hidden /> Hiring process
                </p>
                <dl style={{ margin: 0 }}>
                  <div className="kv-row">
                    <dt>Step 1</dt>
                    <dd>Application reviewed by the team</dd>
                  </div>
                  <div className="kv-row">
                    <dt>Step 2</dt>
                    <dd>45-minute conversation</dd>
                  </div>
                  <div className="kv-row">
                    <dt>Step 3</dt>
                    <dd>Paid practical exercise</dd>
                  </div>
                  <div className="kv-row">
                    <dt>Step 4</dt>
                    <dd>Offer or a written no</dd>
                  </div>
                </dl>
              </div>
            </Reveal>

            <Reveal variant="reveal-right">
              <CareersForm key={selectedRole || 'open'} preselectedRole={selectedRole} />
            </Reveal>
          </div>
        </div>
      </section>
    </>
  )
}
