'use client';
/**
 * shortlistpass.com/brands — Marc's approved mockup (~/Downloads/shorty-manager-landing-final.html), four sections and nothing more:
 * the hero (job chips + the live text thread), the twelve jobs that fly to Shorty's plate, a day on the job (shift log + the website and
 * app), and the hire (the badge + prices). Every job's words are in ./jobs.ts. Motion follows the mockup; with reduced motion on, every
 * part shows its finished state and nothing moves.
 */
import Link from 'next/link';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { JOBS, JOB_ORDER, SIGNIN_HREF, SIGNUP_HREF, TWELVE, type JobKey } from './jobs';
import './brands.css';

const useIso = typeof window === 'undefined' ? useEffect : useLayoutEffect;
const reducedNow = () => typeof window !== 'undefined' && (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches || new URLSearchParams(window.location.search).has('still'));

/* where each of the twelve sits while it is still "your plate" (the mockup's positions, % of the field) */
const MX = [6, 56, 14, 50, 3, 60, 12, 48, 8, 58, 2, 52], MY = [15, 13, 28, 27, 41, 40, 54, 53, 67, 66, 80, 79], MR = [-6, 5, -3, 7, 4, -5, 3, -4, 6, -3, 5, -5];

function Chips({ k, onPick, label }: { k: JobKey; onPick: (k: JobKey) => void; label: string }) {
  return <div className="chips" role="group" aria-label={label}>
    {JOB_ORDER.map(j => <button key={j} type="button" aria-pressed={j === k} data-job={j} onClick={() => onPick(j)}>{JOBS[j].chip}</button>)}
  </div>;
}

export default function BrandsPage() {
  const [k, setK] = useState<JobKey>('baker');
  const [still, setStill] = useState(false);
  const v = JOBS[k];
  /* the thread: how many messages are on screen, and whether Shorty is typing */
  const [shown, setShown] = useState(0);
  const [typing, setTyping] = useState(false);
  const [rowsIn, setRowsIn] = useState(0);
  const timers = useRef<number[]>([]);
  const [now, setNow] = useState('');

  useIso(() => { setStill(reducedNow()); }, []);
  /* "On shift · 9:41 PM" — the visitor's own local time */
  useEffect(() => { const tick = () => setNow(new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })); tick(); const id = window.setInterval(tick, 20000); return () => window.clearInterval(id); }, []);

  /* the text thread types itself (on load, and each time a job is picked); the log's rows fade in */
  const play = useCallback((key: JobKey) => {
    timers.current.forEach(window.clearTimeout); timers.current = [];
    const job = JOBS[key];
    if (reducedNow()) { setShown(job.chat.length); setTyping(false); setRowsIn(job.log.length); return; }
    setShown(0); setTyping(false); setRowsIn(0);
    const later = (f: () => void, ms: number) => { timers.current.push(window.setTimeout(f, ms)); };
    let t = 500;
    job.chat.forEach((c, i) => {
      if (c[0] === 's') { later(() => setTyping(true), t); t += 900; later(() => { setTyping(false); setShown(i + 1); }, t); t += 700; }
      else { later(() => setShown(i + 1), t); t += 800; }
    });
    job.log.forEach((_, i) => later(() => setRowsIn(i + 1), 150 + i * 220));
  }, []);
  /* a chip tap picks the job and plays its thread; on load it plays once (after the ?v= read above) */
  const pick = useCallback((j: JobKey) => { setK(j); play(j); }, [play]);
  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get('v'); const j: JobKey = q && q in JOBS ? (q as JobKey) : 'baker';   /* ?v=realtor opens on that job */
    const id = window.setTimeout(() => pick(j), 0); return () => window.clearTimeout(id);
  }, [pick]);
  useEffect(() => () => { timers.current.forEach(window.clearTimeout); }, []);

  /* the twelve jobs fly once, when the field is 55% on screen */
  const field = useRef<HTMLDivElement | null>(null);
  const [done, setDone] = useState(false);
  const [fw, setFw] = useState(1200);
  useEffect(() => {
    const el = field.current; if (!el) return;
    const ro = new ResizeObserver(() => setFw(el.clientWidth)); ro.observe(el); setFw(el.clientWidth);
    if (reducedNow()) { setDone(true); return () => ro.disconnect(); }
    let fired = false;
    const io = new IntersectionObserver(e => { if (e[0].isIntersecting && !fired) { fired = true; window.setTimeout(() => setDone(true), 700); io.disconnect(); } }, { threshold: 0.55 });
    io.observe(el);
    return () => { io.disconnect(); ro.disconnect(); };
  }, []);
  const again = () => { if (reducedNow()) return; setDone(false); window.setTimeout(() => setDone(true), 900); };
  const mob = fw < 700;
  const pos = (i: number) => {
    let x: number, y: number, r = 0;
    if (!done) { if (mob) { x = Math.min(2 + MX[i] * 0.62, 56); y = 5 + MY[i] * 0.42; } else { x = 1.5 + MX[i] * 0.44; y = MY[i]; } r = MR[i]; }
    else { const col = i % 2, row = Math.floor(i / 2); if (mob) { x = 2.5 + col * 46; y = 58 + row * 6.5; } else { x = 54.5 + col * 22.5; y = 15 + row * 13.6; } }
    return { left: `${x}%`, top: `${y}%`, transform: `rotate(${r}deg)`, transitionDelay: `${done ? i * 70 : 0}ms` };
  };
  const colA: React.CSSProperties = mob ? { width: '100%', left: 0, right: 'auto', top: 0, bottom: '52%' } : {};
  const colB: React.CSSProperties = mob ? { width: '100%', left: 0, right: 'auto', top: '50%', bottom: 0 } : {};

  const url = `${v.biz.toLowerCase().replace(/[^a-z]/g, '')}.shortlistpass.com`;
  /* a sample photo, lazy-loaded; a job with no photos yet draws the mockup's coloured block (jobs.ts img: []) */
  const im = (i: number) => <div className="im">{/* eslint-disable-next-line @next/next/no-img-element -- the sample photos live in Supabase storage, outside next/image's allowed hosts */}
    {v.img[i] ? <img src={v.img[i]} alt="" loading="lazy" decoding="async" /> : null}</div>;

  return (
    <div className={`bx${still ? ' still' : ''}`} style={{ ['--ac' as string]: v.accent, ['--dk' as string]: v.dark }}>
      <nav className="nv" aria-label="Main"><div className="w">
        <Link className="lg" href="/"><i aria-hidden="true" />Shortlist Pass</Link>
        <div className="r"><a href={SIGNIN_HREF}>Sign in</a><a className="btn s" href={SIGNUP_HREF}>Hire Shorty</a></div>
      </div></nav>

      <header className="hero"><div className="w"><div>
        <div className="ey">Meet Shorty · your new manager</div>
        <h1><em data-verb="">{v.verb}</em>Shorty runs everything else.</h1>
        <p className="sub">Shorty is a real manager for your business who never clocks out. He builds your <b>website and app</b>, takes <b>orders and bookings</b>, <b>texts and emails</b> your customers, <b>posts to social</b>, and reports back to you. Talk to him in the app, or just <b>text him</b>.</p>
        <div className="pick" id="bx-pick">WHAT DO YOU DO?</div>
        <Chips k={k} onPick={pick} label="What do you do?" />
        <div className="ctas"><a className="btn" href={SIGNUP_HREF} data-hire="hero">Hire Shorty, free</a><span>Free to start · No commission, ever</span></div>
      </div>
      <div className="phone" aria-label="A text thread with Shorty" role="img"><div className="scr">
        <div className="th"><div className="face" aria-hidden="true" /><div><b>Shorty</b><small>On shift · <span data-now="">{now}</span></small></div><div className="via">Text message</div></div>
        <div className="msgs" data-thread={k}>
          {v.chat.map((c, i) => <div key={`${k}-${i}`} className={`m ${c[0]}${i < shown ? ' in' : ''}`}>{c[1]}</div>)}
          {typing && <div className="typ" aria-hidden="true"><i /><i /><i /></div>}
        </div>
        <div className="tin">Text your manager…</div>
      </div></div></div></header>

      <section className="jug" aria-labelledby="bx-jobs"><div className="w">
        <div className="ey">Running a business in 2027</div>
        <h2 id="bx-jobs" style={{ marginTop: 12, maxWidth: 820 }}>You didn&apos;t start a business to do twelve other jobs.</h2>
        <p>Being good at what you do isn&apos;t enough anymore. You&apos;re also supposed to be a web designer, a marketer and a receptionist who answers at midnight. Hand all of it to Shorty.</p>
        <div className="field" ref={field} data-done={done ? '' : undefined}>
          <div className="col a" style={colA}><span>YOUR PLATE</span></div>
          <div className="col b" style={colB}><span>SHORTY&apos;S PLATE</span></div>
          <div className={`one${done ? ' in' : ''}`} style={mob ? { width: '100%', bottom: '52%' } : undefined}><small>What&apos;s left on your plate</small><b>{v.one}.</b><small>That&apos;s the whole list now.</small></div>
          {TWELVE.map((j, i) => <div key={j} className={`jc${done ? ' dn' : ''}`} style={pos(i)}>{j}</div>)}
        </div>
        <button type="button" className="again" onClick={again}>Watch that again</button>
      </div></section>

      <section className="day" aria-labelledby="bx-day"><div className="w">
        <div className="top"><div><div className="ey">A normal day on the job</div><h2 id="bx-day" style={{ marginTop: 12 }}>He never clocks out. He never misses one.</h2></div>
          <Chips k={k} onPick={pick} label="Pick a job" /></div>
        <div className="g">
          <div>
            <div className="log"><div className="hd"><div className="face" aria-hidden="true" /><div><b>Shorty&apos;s {v.day} at {v.biz}</b><small>What your manager got done</small></div></div>
              <div data-log={k}>{v.log.map((r, i) => <div key={`${k}-${i}`} className={`row${i < rowsIn ? ' in' : ''}`}><time>{r[0]}</time><div><u>{r[1]}</u>{r[2]}</div>{r[3] ? <span>{r[3]}</span> : <i />}</div>)}</div>
              <div className="late">{v.late}</div></div>
            <p className="example">Example day. Your numbers will be your own.</p>
          </div>
          <div className="built"><h3>And on day one, he built you these.</h3>
            <p>A website on computers and an app on phones, under one link. Change something once and both update. Found on Google, ChatGPT and Claude.</p>
            <div className="dev" role="img" aria-label={`${v.biz}: a sample website and app`}>
              <div className="lap"><div className="bar"><i /><i /><i /><span data-url="">{url}</span></div>
                <div className="mnav"><b /><span>{v.biz}</span><em>{v.tabs.slice(1).map(t => <span key={t}>{t}</span>)}<u>{v.cta}</u></em></div>
                <div className="mh"><div><h4 data-head="">{v.head}</h4><span className="c">{v.cta}</span></div>{im(0)}</div>
                <div className="mr">{im(1)}{im(2)}{im(3)}</div></div>
              <div className="ph2"><div className="sc"><div className="tp"><b /><span>{v.biz}</span></div>
                <div className="cd">{im(0)}<h5>{v.head}</h5></div>
                <div className="pp">{im(1)}{im(2)}</div>
                <div className="tb">{v.tabs.map(t => <span key={t}>{t}</span>)}</div></div></div>
            </div>
          </div>
        </div>
      </div></section>

      <section className="offer" aria-labelledby="bx-hire"><div className="w">
        <div className="badge"><div className="t"><div className="face" aria-hidden="true" /><div><b>Shorty</b><small>Manager, <span data-badge-biz="">{v.biz}</span></small></div></div>
          <dl><dt>Hours</dt><dd>24/7, every day</dd><dt>Sick days</dt><dd>None</dd><dt>Reports to</dt><dd>You</dd><dt>Reach him by</dt><dd>App or text</dd><dt>Cut of your sales</dt><dd className="g">Never</dd><dt>Start date</dt><dd className="g">Today</dd></dl></div>
        <div><div className="ey">Make the hire</div><h2 id="bx-hire" style={{ marginTop: 12 }}>The best manager you&apos;ll ever hire costs less than $2 a day.</h2>
          <p>You stay the boss. He works from what you tell him, and you can change anything, any time.</p>
          <div className="price"><div><b>$0</b><small>Website, app and 24/7 answers</small></div><div><b>$50<span> / mo</span></b><small>Adds orders, bookings and reports</small></div><div><b>+$30<span> / mo</span></b><small>Adds texts, emails and social posting</small></div></div>
          <div className="ctas"><a className="btn" href={SIGNUP_HREF} data-hire="offer">Hire Shorty, free</a><span>Live in minutes</span></div>
          <div className="fine">Payments go straight to your Stripe or Square.</div></div>
      </div></section>
      <footer><div className="w"><span>Shortlist Pass · Myrtle Beach, SC</span><a href="mailto:hello@shortlistpass.com">hello@shortlistpass.com</a></div></footer>
    </div>
  );
}
