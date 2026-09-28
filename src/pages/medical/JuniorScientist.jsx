import { Link } from 'react-router-dom'
import Reveal from '../../components/Reveal'
import CountUp from '../../components/CountUp'
import { CompareGrid, CtaBand, NumberedGrid, PageHero, SectionHead } from '../../components/Blocks'
import { ArrowRight } from '../../components/Icons'
import {
  compareRows,
  curriculum,
  juniorFeatures,
  juniorPrice,
  juniorProblems,
  juniorStats,
  priceNotes,
  studies,
  yearCompare,
} from '../../data/medical'

const price = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: juniorPrice.currency,
  maximumFractionDigits: 0,
}).format(juniorPrice.amount)

export default function JuniorScientist() {
  return (
    <>
      <PageHero
        eyebrow="Spotlight · Junior Scientist Program"
        title={
          <>
            Your child does real medical research — and <em>earns</em> a publication.
          </>
        }
        lede="Not a science class and not a resume filler. A physician-researcher mentors your child through one real study, every week, from reading their first paper to writing one of their own. Start with a one-month trial, with the deposit returned if it isn't the right fit."
      >
        <div className="actions">
          <Link className="btn btn-primary btn-lg" to="/medical/contact">
            Book a free fit call <ArrowRight size={18} className="arrow" />
          </Link>
          <Link className="btn btn-ghost btn-lg" to="#js-fee">
            See the fee
          </Link>
        </div>
      </PageHero>

      <section className="tight-top">
        <div className="wrap">
          <Reveal effect="zoom" className="spot-stats wide">
            {juniorStats.map((s) => (
              <div key={s.value}>
                <b>
                  <CountUp value={s.value} />
                </b>
                <span>{s.label}</span>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <section>
        <div className="wrap">
          <SectionHead
            title='The problem with most high-school "research"'
            lede="Admissions reviewers can tell real work from a name added to a paper. Most ambitious students never get the real thing, for three reasons."
          />
          <NumberedGrid items={juniorProblems} />

          <SectionHead className="sub" title="Why it works" lede="Research taught the way scientists actually learn it." />
          <Reveal stagger className="feat-grid">
            {juniorFeatures.map((f) => (
              <div className="feat" key={f.title}>
                <h3>{f.title}</h3>
                <p>{f.text}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="alt-band">
        <div className="wrap">
          <SectionHead title="The curriculum: eight skills, in the order that builds" />
          <Reveal as="ol" effect="zoom" stagger className="curric">
            {curriculum.map((c) => (
              <li className="cstep" key={c.title}>
                <span className="wk">{c.when}</span>
                <h3>{c.title}</h3>
              </li>
            ))}
          </Reveal>

          <SectionHead
            className="sub"
            title="The kind of studies students work on"
            lede="Live projects that practicing doctors care about. Students contribute to one or model their own on it."
          />
          <Reveal effect="flip" stagger className="prog-grid">
            {studies.map((s) => (
              <article className="prog-card" key={s.title}>
                <div className="prog-meta">
                  <span className="pill">{s.tag}</span>
                </div>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </article>
            ))}
          </Reveal>
        </div>
      </section>

      <section>
        <div className="wrap">
          <SectionHead title="How it compares" />
          <Reveal effect="left" stagger className="ctable" role="table" aria-label="Junior Scientist compared with typical programs">
            <div className="crow head" role="row">
              <div className="k" role="columnheader">
                Feature
              </div>
              <div className="us" role="columnheader">
                Junior Scientist
              </div>
              <div className="them" role="columnheader">
                Typical programs
              </div>
            </div>
            {compareRows.map((r) => (
              <div className="crow" role="row" key={r.k}>
                <div className="k" role="rowheader">
                  {r.k}
                </div>
                <div className="us" role="cell">
                  {r.us}
                </div>
                <div className="them" role="cell">
                  {r.them}
                </div>
              </div>
            ))}
          </Reveal>

          <SectionHead className="sub" title="A year from now" lede="Your child spends the year either way." />
          <CompareGrid left={yearCompare.without} right={yearCompare.with} />
        </div>
      </section>

      <section className="alt-band" id="js-fee">
        <div className="wrap">
          <SectionHead
            title="One fee for a full year of mentored research"
            lede="The fee covers your child's place, training and mentorship. It does not — and cannot — buy a publication or a byline."
          />
          <div className="price-wrap">
            <Reveal effect="zoom" className="price-card">
              <span className="pill live">{juniorPrice.label}</span>
              <p className="amt">
                <CountUp value={price} /> <small>USD · full program year</small>
              </p>
              <ul>
                {juniorPrice.includes.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
              <Link className="btn btn-primary" to="/medical/contact">
                Book a fit call <ArrowRight size={16} className="arrow" />
              </Link>
              <p className="fine">Limited places, offered after a fit conversation. Payment plans available on request.</p>
            </Reveal>
            <Reveal effect="right" stagger className="price-notes" delay={150}>
              {priceNotes.map((n) => (
                <div key={n.title}>
                  <h3>{n.title}</h3>
                  <p>{n.text}</p>
                </div>
              ))}
            </Reveal>
          </div>
        </div>
      </section>

      <CtaBand practice="medical" />
    </>
  )
}
