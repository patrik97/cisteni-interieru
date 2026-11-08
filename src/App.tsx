import { type FormEvent, useEffect, useRef, useState } from 'react'

type IconName = 'arrow' | 'calendar' | 'check' | 'close' | 'diamond' | 'mail' | 'next' | 'seat' | 'shield' | 'sparkles' | 'spray' | 'trunk'

const Icon = ({ name, className = 'h-6 w-6' }: { name: IconName; className?: string }) => {
  const paths: Record<IconName, React.ReactNode> = {
    arrow: <><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01"/></>,
    check: <path d="m5 12 4 4L19 6"/>,
    close: <path d="m6 6 12 12M18 6 6 18"/>,
    diamond: <><path d="m12 3 7 5-7 13L5 8l7-5Z"/><path d="M5 8h14M9 8l3 13 3-13M8 3l1 5M16 3l-1 5"/></>,
    mail: <><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></>,
    next: <path d="m9 18 6-6-6-6"/>,
    seat: <><path d="M7 12V6a3 3 0 0 1 6 0v5"/><path d="M6 12h8a3 3 0 0 1 3 3v5H5v-6a2 2 0 0 1 1-2ZM17 20h2M5 20H3"/></>,
    shield: <><path d="M12 3 5 6v5c0 5 3 8 7 10 4-2 7-5 7-10V6l-7-3Z"/><path d="m9 12 2 2 4-5"/></>,
    sparkles: <><path d="m12 3-1.3 3.7L7 8l3.7 1.3L12 13l1.3-3.7L17 8l-3.7-1.3L12 3ZM5 14l-.8 2.2L2 17l2.2.8L5 20l.8-2.2L8 17l-2.2-.8L5 14ZM19 14l-.6 1.4L17 16l1.4.6L19 18l.6-1.4L21 16l-1.4-.6L19 14Z"/></>,
    spray: <><path d="M8 7h8l2 4v10H6V11l2-4Z"/><path d="M10 7V4h5M15 4l3 2M5 9H2M5 5 3 3M5 13l-3 2"/></>,
    trunk: <><path d="M5 8h14l2 5v6H3v-6l2-5Z"/><path d="m7 8 2-4h6l2 4M3 14h18M7 19v2M17 19v2"/></>,
  }
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>
}

const gallery = [
  { src: '/images/superb/superb-03.jpeg', alt: 'Vyčištěné přední sedačky a palubní deska vozu Škoda Superb' },
  { src: '/images/bmw/bmw-03.jpeg', alt: 'Detail koženého sedadla s ukázkou rozdílu po čištění' },
  { src: '/images/vw/vw-06.jpeg', alt: 'Vyčištěný zavazadlový prostor červeného vozu' },
  { src: '/images/bmw/bmw-25.jpeg', alt: 'Čistý koberec v zavazadlovém prostoru BMW' },
  { src: '/images/superb/superb-14.jpeg', alt: 'Detail vyčištěného volantu a středového panelu' },
  { src: '/images/bmw/bmw-28.jpeg', alt: 'Detail vyčištěných kožených sedadel BMW' },
  { src: '/images/vw/vw-12.jpeg', alt: 'Čistý interiér červeného vozu Volkswagen' },
  { src: '/images/superb/superb-21.jpeg', alt: 'Kompletně vyčištěný interiér vozu Škoda Superb' },
  { src: '/images/bmw/bmw-02.jpeg', alt: 'Pruhy po extrakčním čištění zavazadlového prostoru' },
]

const services: { icon: IconName; title: string; text: string }[] = [
  { icon: 'seat', title: 'Hloubkové čištění sedadel', text: 'Textil, kůže i Alcantara. Šetrně a s důrazem na každý detail.' },
  { icon: 'spray', title: 'Kompletní čištění interiéru', text: 'Sedadla, koberce, plasty, výplně dveří i špatně dostupná místa.' },
  { icon: 'trunk', title: 'Péče o zavazadlový prostor', text: 'Vysátí, čištění koberců a odstranění běžných nečistot.' },
]

function App() {
  const [bookingOpen, setBookingOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [comparePosition, setComparePosition] = useState(52)
  const [carouselPaused, setCarouselPaused] = useState(false)
  const carouselRef = useRef<HTMLDivElement>(null)

  const moveCarousel = (direction: 1 | -1) => {
    const carousel = carouselRef.current
    if (!carousel) return
    const firstCard = carousel.firstElementChild as HTMLElement | null
    const amount = (firstCard?.offsetWidth ?? 320) + 16
    const nearEnd = carousel.scrollLeft + carousel.clientWidth >= carousel.scrollWidth - amount / 2
    if (direction === 1 && nearEnd) carousel.scrollTo({ left: 0, behavior: 'smooth' })
    else if (direction === -1 && carousel.scrollLeft <= amount / 2) carousel.scrollTo({ left: carousel.scrollWidth, behavior: 'smooth' })
    else carousel.scrollBy({ left: direction * amount, behavior: 'smooth' })
  }

  useEffect(() => {
    if (carouselPaused || lightboxIndex !== null || bookingOpen) return
    const interval = window.setInterval(() => moveCarousel(1), 3400)
    return () => window.clearInterval(interval)
  }, [carouselPaused, lightboxIndex, bookingOpen])

  useEffect(() => {
    if (!bookingOpen && lightboxIndex === null) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setBookingOpen(false)
        setLightboxIndex(null)
      }
      if (lightboxIndex !== null && event.key === 'ArrowRight') setLightboxIndex((lightboxIndex + 1) % gallery.length)
      if (lightboxIndex !== null && event.key === 'ArrowLeft') setLightboxIndex((lightboxIndex - 1 + gallery.length) % gallery.length)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [bookingOpen, lightboxIndex])

  return (
    <main className="overflow-hidden bg-ink text-white">
      <section className="hero-grid relative isolate min-h-[760px] overflow-hidden border-b border-white/10 lg:min-h-[780px]">
        <div className="absolute inset-0 -z-20 bg-[#080b0d]" />
        <div className="hero-image absolute inset-y-0 right-0 -z-10 w-full lg:w-[61%]">
          <img src="/images/superb/superb-03.jpeg" alt="Profesionálně vyčištěný interiér automobilu" className="h-full w-full object-cover object-[55%_52%]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#080b0d] via-[#080b0d]/40 to-transparent lg:from-[#080b0d] lg:via-[#080b0d]/10" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080b0d] via-transparent to-black/25" />
        </div>

        <div className="mx-auto flex min-h-[760px] max-w-7xl flex-col justify-between px-5 py-7 sm:px-8 lg:min-h-[780px] lg:px-10 lg:py-10">
          <div className="flex items-center gap-3" aria-label="Lukáš Pluhař, čištění interiérů">
            <div className="grid h-11 w-11 place-items-center rounded-xl border border-orange/40 bg-orange/10 text-orange shadow-[0_0_30px_rgba(255,91,0,.15)]"><Icon name="sparkles" className="h-6 w-6" /></div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/55">Lukáš Pluhař</p>
              <p className="text-sm font-extrabold uppercase tracking-[0.13em]">Čištění interiérů</p>
            </div>
          </div>

          <div className="max-w-2xl py-14 sm:py-20 lg:py-16">
            <p className="mb-5 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.26em] text-orange sm:text-sm"><span className="h-px w-9 bg-orange" /> Pečlivost v každém detailu</p>
            <h1 className="text-balance text-5xl font-black italic leading-[0.95] tracking-[-0.045em] sm:text-7xl lg:text-[5.6rem]">
              Čistý interiér.<br /><span className="text-orange">Lepší pocit</span><br />z každé jízdy.
            </h1>
            <p className="mt-7 max-w-xl text-base leading-7 text-white/70 sm:text-lg sm:leading-8">Důkladné ruční čištění interiéru, které vrátí vašemu vozu svěžest, čistotu a reprezentativní vzhled.</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <button className="button-primary group" onClick={() => setBookingOpen(true)}>Rezervovat termín <Icon name="arrow" className="h-5 w-5 transition-transform group-hover:translate-x-1" /></button>
              <button className="button-secondary" onClick={() => document.querySelector('#sluzby')?.scrollIntoView({ behavior: 'smooth' })}>Prohlédnout služby</button>
            </div>
          </div>

          <div className="grid max-w-3xl gap-3 pb-2 sm:grid-cols-3">
            {([['diamond', 'Precizní ruční péče'], ['shield', 'Šetrný postup'], ['calendar', 'Termín po domluvě']] as [IconName, string][]).map(([icon, label]) => (
              <div key={label} className="flex items-center gap-3 border-l border-white/15 bg-black/20 px-4 py-3.5 backdrop-blur-sm"><Icon name={icon} className="h-5 w-5 shrink-0 text-orange" /><span className="text-sm font-semibold text-white/85">{label}</span></div>
            ))}
          </div>
        </div>
      </section>

      <section id="sluzby" className="section-shell relative py-20 sm:py-24">
        <div className="absolute inset-0 -z-10 opacity-40 [background:radial-gradient(circle_at_15%_20%,rgba(255,91,0,.12),transparent_26%),radial-gradient(circle_at_90%_80%,rgba(255,255,255,.06),transparent_32%)]" />
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="mb-10 grid items-end gap-5 lg:grid-cols-[.8fr_1.2fr]">
            <div><p className="eyebrow">Naše služby</p><h2 className="section-title mt-3">Kompletní péče<br />od stropu po koberec.</h2></div>
            <p className="max-w-xl text-base leading-7 text-white/55 lg:justify-self-end">Každý vůz potřebuje trochu jiný přístup. Rozsah práce proto přizpůsobím materiálům i aktuálnímu stavu interiéru.</p>
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            {services.map((service, index) => (
              <article key={service.title} className="service-card group">
                <div className="mb-8 flex items-start justify-between"><div className="grid h-14 w-14 place-items-center rounded-2xl border border-orange/30 bg-orange/10 text-orange transition-transform duration-300 group-hover:-translate-y-1"><Icon name={service.icon} className="h-8 w-8" /></div><span className="text-5xl font-black italic text-white/[0.04]">0{index + 1}</span></div>
                <h3 className="text-xl font-extrabold leading-tight">{service.title}</h3><p className="mt-3 leading-7 text-white/55">{service.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-white/8 bg-[#080b0d] py-20 sm:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 sm:px-8 lg:grid-cols-[1.15fr_.85fr] lg:px-10">
          <div className="comparison-frame">
            <img src="/images/bmw/bmw-07.jpeg" alt="Čistý prostor řidiče po ošetření" className="absolute inset-0 h-full w-full object-cover object-center" />
            <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `inset(0 ${100 - comparePosition}% 0 0)` }}><img src="/images/bmw/bmw-29.jpeg" alt="Znečištěný prostor řidiče před čištěním" className="h-full w-full object-cover object-center" /></div>
            <div className="absolute inset-y-0 z-10 w-0.5 bg-white shadow-[0_0_20px_rgba(0,0,0,.8)]" style={{ left: `${comparePosition}%` }}><div className="absolute left-1/2 top-1/2 grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-orange bg-[#0a0d0f] text-orange shadow-xl"><div className="flex -space-x-1.5"><Icon name="next" className="h-5 w-5 rotate-180" /><Icon name="next" className="h-5 w-5" /></div></div></div>
            <input className="absolute inset-0 z-20 h-full w-full cursor-ew-resize opacity-0" type="range" min="8" max="92" value={comparePosition} onChange={(event) => setComparePosition(Number(event.target.value))} aria-label="Porovnat stav před a po čištění" />
            <span className="comparison-label left-4 bg-black/65 sm:left-6">Před čištěním</span><span className="comparison-label right-4 bg-orange sm:right-6">Po čištění</span>
          </div>
          <div className="lg:pl-8">
            <p className="eyebrow">Viditelný rozdíl</p><h2 className="section-title mt-3">Výsledek, který<br />je vidět i cítit.</h2>
            <p className="mt-5 max-w-lg leading-7 text-white/55">Posuňte jezdcem a porovnejte stav prostoru řidiče před čištěním a po něm.</p>
            <ul className="mt-8 space-y-4">
              {['Odstranění běžných nečistot a skvrn', 'Oživení vzhledu povrchů', 'Svěží a hygienicky čisté prostředí'].map((item) => <li key={item} className="flex items-center gap-3 text-white/85"><span className="grid h-6 w-6 place-items-center rounded-full bg-orange/15 text-orange"><Icon name="check" className="h-4 w-4" /></span>{item}</li>)}
            </ul>
          </div>
        </div>
      </section>

      <section className="section-shell py-20 sm:py-24" aria-labelledby="galerie-nadpis">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="mb-8 flex items-end justify-between gap-5">
            <div><p className="eyebrow">Galerie realizací</p><h2 id="galerie-nadpis" className="section-title mt-3">Poctivá práce.<br />Čistý výsledek.</h2></div>
            <div className="hidden gap-2 sm:flex"><button className="carousel-control rotate-180" onClick={() => moveCarousel(-1)} aria-label="Předchozí fotografie"><Icon name="next" /></button><button className="carousel-control" onClick={() => moveCarousel(1)} aria-label="Další fotografie"><Icon name="next" /></button></div>
          </div>
          <div ref={carouselRef} className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 sm:-mx-8 sm:px-8 lg:-mx-10 lg:px-10" onMouseEnter={() => setCarouselPaused(true)} onMouseLeave={() => setCarouselPaused(false)} onFocus={() => setCarouselPaused(true)} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setCarouselPaused(false) }}>
            {gallery.map((photo, index) => (
              <button key={photo.src} className="gallery-card group relative aspect-[4/5] w-[78vw] shrink-0 snap-center overflow-hidden text-left sm:w-[45vw] lg:w-[30%]" onClick={() => setLightboxIndex(index)} aria-label={`Zvětšit fotografii: ${photo.alt}`}>
                <img src={photo.src} alt={photo.alt} className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.035]" loading="lazy" /><div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-70" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between"><span className="text-xs font-bold uppercase tracking-[0.16em] text-white/80">Realizace {String(index + 1).padStart(2, '0')}</span><span className="grid h-10 w-10 place-items-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-sm transition group-hover:border-orange group-hover:bg-orange"><Icon name="sparkles" className="h-5 w-5" /></span></div>
              </button>
            ))}
          </div>
          <div className="mt-5 flex justify-center gap-2 sm:hidden"><button className="carousel-control rotate-180" onClick={() => moveCarousel(-1)} aria-label="Předchozí fotografie"><Icon name="next" /></button><button className="carousel-control" onClick={() => moveCarousel(1)} aria-label="Další fotografie"><Icon name="next" /></button></div>
        </div>
      </section>

      <section className="border-y border-white/8 bg-[#0a0d0f] py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10"><div className="grid gap-10 lg:grid-cols-[.72fr_1.28fr]">
          <div><p className="eyebrow">Jak to probíhá</p><h2 className="section-title mt-3">Tři kroky k čistému vozu.</h2><p className="mt-5 max-w-md leading-7 text-white/55">Jednoduchá domluva, pečlivé provedení a předání interiéru, do kterého se budete rádi vracet.</p></div>
          <ol className="grid gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 sm:grid-cols-3">
            {([['01', 'Napište mi', 'Pošlete představu o rozsahu čištění a pár informací o voze.'], ['02', 'Domluvíme termín', 'Společně najdeme vhodný termín a upřesníme rozsah práce.'], ['03', 'Převezmete vůz', 'Po dokončení si převezmete čistý a svěží interiér.']] as string[][]).map(([number, title, text]) => <li key={number} className="bg-[#0d1114] p-7 sm:min-h-64 sm:p-8"><span className="text-sm font-black tracking-[0.2em] text-orange">{number}</span><h3 className="mt-10 text-xl font-extrabold">{title}</h3><p className="mt-3 text-sm leading-6 text-white/50">{text}</p></li>)}
          </ol>
        </div></div>
      </section>

      <section className="relative overflow-hidden py-20 sm:py-28">
        <img src="/images/bmw/bmw-35.jpeg" alt="Čistý interiér vozu BMW" className="absolute inset-0 h-full w-full object-cover object-center opacity-25" loading="lazy" /><div className="absolute inset-0 bg-gradient-to-r from-black via-[#080b0d]/90 to-[#080b0d]/55" /><div className="absolute inset-y-0 left-0 w-2 bg-orange" />
        <div className="relative mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 px-5 sm:px-8 lg:flex-row lg:items-center lg:px-10"><div><p className="eyebrow">Dopřejte svému vozu péči</p><h2 className="mt-3 max-w-3xl text-4xl font-black italic leading-tight tracking-[-0.035em] sm:text-6xl">Připraven na opravdu<br /><span className="text-orange">čistý interiér?</span></h2><p className="mt-5 text-white/60">Napište mi a domluvíme vhodný termín čištění.</p></div><button className="button-primary group shrink-0" onClick={() => setBookingOpen(true)}>Rezervovat termín <Icon name="arrow" className="h-5 w-5 transition-transform group-hover:translate-x-1" /></button></div>
      </section>

      <footer className="border-t border-white/8 bg-[#050708]"><div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-7 text-sm text-white/35 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10"><p>© {new Date().getFullYear()} Lukáš Pluhař — čištění interiérů vozů</p><p>Pečlivost. Čistota. Detail.</p></div></footer>

      {bookingOpen && <BookingModal onClose={() => setBookingOpen(false)} />}
      {lightboxIndex !== null && <Lightbox index={lightboxIndex} onIndex={setLightboxIndex} onClose={() => setLightboxIndex(null)} />}
    </main>
  )
}

function BookingModal({ onClose }: { onClose: () => void }) {
  const [sent, setSent] = useState(false)
  const emailRef = useRef<HTMLInputElement>(null)
  useEffect(() => { emailRef.current?.focus() }, [])
  const submit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); setSent(true) }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/80 p-4 backdrop-blur-md" role="dialog" aria-modal="true" aria-labelledby="booking-title">
      <button className="absolute inset-0 cursor-default" onClick={onClose} aria-label="Zavřít formulář" />
      <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-3xl border border-white/12 bg-[#101417] p-6 shadow-2xl sm:p-9">
        <div className="absolute inset-x-0 top-0 h-1 bg-orange" /><button className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full border border-white/10 text-white/60 transition hover:border-orange/50 hover:text-orange" onClick={onClose} aria-label="Zavřít formulář"><Icon name="close" className="h-5 w-5" /></button>
        {sent ? (
          <div className="py-8 text-center" aria-live="polite"><div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-orange/15 text-orange"><Icon name="check" className="h-8 w-8" /></div><h2 id="booking-title" className="mt-6 text-3xl font-black italic">Děkuji za zprávu.</h2><p className="mx-auto mt-3 max-w-sm leading-7 text-white/55">Vaše poptávka byla přijata. Ozvu se vám co nejdříve a společně domluvíme termín.</p><button className="button-secondary mt-7" onClick={onClose}>Zpět na web</button></div>
        ) : (
          <><p className="eyebrow">Rezervace čištění</p><h2 id="booking-title" className="mt-3 pr-10 text-3xl font-black italic sm:text-4xl">Napište mi o termín.</h2><p className="mt-3 leading-7 text-white/55">Stačí e-mail a krátká zpráva o vašem voze. Ozvu se vám s možnostmi termínu.</p>
          <form className="mt-7 space-y-5" onSubmit={submit}>
            <label className="block"><span className="mb-2 block text-sm font-semibold text-white/75">Váš e-mail</span><div className="relative"><Icon name="mail" className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/30" /><input ref={emailRef} className="form-field pl-12" type="email" name="email" placeholder="jmeno@email.cz" autoComplete="email" required /></div></label>
            <label className="block"><span className="mb-2 block text-sm font-semibold text-white/75">Zpráva</span><textarea className="form-field min-h-36 resize-y" name="message" placeholder="Typ vozu, představa o rozsahu čištění…" required /></label>
            <button className="button-primary w-full justify-center" type="submit">Odeslat poptávku <Icon name="arrow" className="h-5 w-5" /></button>
          </form></>
        )}
      </div>
    </div>
  )
}

function Lightbox({ index, onIndex, onClose }: { index: number; onIndex: (index: number) => void; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/95 p-3 backdrop-blur-md sm:p-8" role="dialog" aria-modal="true" aria-label="Zvětšená fotografie">
      <button className="absolute inset-0 cursor-default" onClick={onClose} aria-label="Zavřít galerii" /><button className="overlay-close" onClick={onClose} aria-label="Zavřít galerii"><Icon name="close" /></button>
      <button className="lightbox-arrow left-3 rotate-180 sm:left-6" onClick={() => onIndex((index - 1 + gallery.length) % gallery.length)} aria-label="Předchozí fotografie"><Icon name="next" /></button>
      <figure className="relative z-10 flex max-h-[88vh] max-w-6xl flex-col items-center"><img src={gallery[index].src} alt={gallery[index].alt} className="max-h-[80vh] max-w-full rounded-xl object-contain shadow-2xl" /><figcaption className="mt-3 text-center text-sm text-white/55">{index + 1} / {gallery.length} · {gallery[index].alt}</figcaption></figure>
      <button className="lightbox-arrow right-3 sm:right-6" onClick={() => onIndex((index + 1) % gallery.length)} aria-label="Další fotografie"><Icon name="next" /></button>
    </div>
  )
}

export default App
