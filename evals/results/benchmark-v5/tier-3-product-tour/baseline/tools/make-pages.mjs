// Writes the four static pages from one template so shared elements stay identical.
// Run: node tools/make-pages.mjs   (output is committed; no build needed to view)
import { writeFileSync } from 'node:fs';

const T = '<span class="taka">৳</span>';
const STEPS = [
  { slug: 'intro', label: 'Intro', file: 'index.html', dir: '' },
  { slug: 'features', label: 'Features', file: 'features/index.html', dir: 'features/' },
  { slug: 'pricing', label: 'Pricing', file: 'pricing/index.html', dir: 'pricing/' },
  { slug: 'start', label: 'Start', file: 'start/index.html', dir: 'start/' },
];
const PLAY = 'https://play.example.com/tally';
const WEB = 'https://app.tally.example.com/start';
const IOS = 'ios@tally.example.com';

const anim = (name, file, ar, alt, extra = '') => `
        <div class="anim" data-name="${name}" data-src="{R}anim/${file}.json" style="--ar:${ar}"${extra} aria-hidden="true">
          <img class="anim-poster" src="{R}anim/${file}-final.svg" alt="" width="320" height="140">
          <div class="anim-player"></div>
        </div>
        <p class="sr-only">${alt}</p>`;

const chip = `<p class="card-balance"><span class="dot" aria-hidden="true"></span><span>Mitu owes Sabbir <strong>${T} 640</strong></span></p>`;

const pages = {
  intro: {
    title: 'Tally · Split it once. Stop doing the maths.',
    desc: 'Tally is a shared-expenses app for flatmates and families. Add what you paid; it keeps a running balance and tells everyone who owes whom.',
    copy: `
        <p class="eyebrow">Shared expenses for flatmates and families</p>
        <h1 id="tour-title" tabindex="-1" aria-describedby="step-label">Split it once. Stop doing the maths.</h1>
        <p class="lede">Tally is a shared-expenses app: you add what you paid, it keeps a running balance and tells everyone who owes whom.</p>
        <p class="card-sub">On the web and Android.</p>`,
    card: `
        ${chip}
        <div class="card-content">
          <p class="card-title">Running balance</p>
          <p class="card-sub">Tally keeps it up to date and tells everyone who owes whom.</p>
          ${anim('balance', 'intro-balance', '16 / 7', 'Animation: the balance between Mitu and Sabbir fills in, showing Mitu owes Sabbir 640 taka.')}
          <div class="toggle-labels" aria-hidden="true" style="padding:0 2%"><span>Mitu</span><span>Sabbir</span></div>
        </div>`,
  },
  features: {
    title: 'Tally · What it does',
    desc: 'Add in two taps. Balances settle themselves. Works in taka and offline.',
    copy: `
        <p class="eyebrow">What it does</p>
        <h1 id="tour-title" tabindex="-1" aria-describedby="step-label">Three things, so nobody keeps score.</h1>
        <ol class="features">
          <li><h2>Add in two taps</h2><p>Amount, who paid, done.</p></li>
          <li><h2>Balances settle themselves</h2><p>Tally works out the fewest payments to square up.</p></li>
          <li><h2>Works in ${T} and offline</h2><p>Entries sync when you are back online.</p></li>
        </ol>`,
    card: `
        ${chip}
        <div class="card-content">
          <p class="card-title">Add an expense</p>
          <p class="card-sub">Amount, who paid, done.</p>
          ${anim('add', 'features-add', '8 / 5', 'Animation: tapping the add button drops a new expense into the list and it is ticked off.')}
        </div>`,
  },
  pricing: {
    title: 'Tally · Pricing',
    desc: `Free: up to 2 groups, unlimited expenses. Tally Plus: ৳ 149 / month or ৳ 1,290 / year.`,
    copy: `
        <p class="eyebrow">Pricing</p>
        <h1 id="tour-title" tabindex="-1" aria-describedby="step-label">Two plans. Start on Free.</h1>
        <div class="billing" role="group" aria-label="Tally Plus billing">
          <button type="button" value="monthly" aria-pressed="true">Monthly</button>
          <button type="button" value="yearly" aria-pressed="false">Yearly</button>
        </div>
        <div class="plans">
          <section class="plan" aria-labelledby="plan-free">
            <h2 id="plan-free">Free</h2>
            <p class="price">${T} 0</p>
            <ul><li>Up to 2 groups</li><li>Unlimited expenses</li></ul>
          </section>
          <section class="plan is-plus" aria-labelledby="plan-plus">
            <h2 id="plan-plus">Tally Plus</h2>
            <p class="price" data-billing="monthly">${T} 149 <small>/ month</small></p>
            <p class="price" data-billing="yearly">${T} 1,290 <small>/ year</small></p>
            <ul><li>Unlimited groups</li><li>Receipts</li><li>Export to CSV</li></ul>
          </section>
        </div>`,
    card: `
        ${chip}
        <div class="card-content">
          <p class="card-title">Tally Plus</p>
          <p class="card-sub" data-billing="monthly">${T} 149 / month</p>
          <p class="card-sub" data-billing="yearly">${T} 1,290 / year</p>
          ${anim('toggle', 'pricing-toggle', '20 / 9', 'Animation: a plan toggle that follows the Monthly / Yearly choice.', ' data-mode="toggle" data-state="monthly"')}
          <div class="toggle-labels" aria-hidden="true"><span data-for="monthly" data-on="true">Monthly</span><span data-for="yearly">Yearly</span></div>
        </div>`,
  },
  start: {
    title: 'Tally · Start',
    desc: 'Use Tally in your browser or get it on Google Play. iOS waitlist by email.',
    copy: `
        <p class="eyebrow">Start</p>
        <h1 id="tour-title" tabindex="-1" aria-describedby="step-label">Start splitting.</h1>
        <p class="recap"><strong>Free</strong> for up to 2 groups. <strong>Tally Plus</strong> when you need more:
          <span data-billing="monthly">${T} 149 / month.</span><span data-billing="yearly">${T} 1,290 / year.</span></p>
        <div class="cta-stack" style="margin-top:1.5rem">
          <a class="btn btn-primary only-web" id="cta" href="${WEB}">Use it in your browser</a>
          <a class="btn btn-primary only-android" href="${PLAY}">Get it on Google Play</a>
          <p class="alt-links only-web">On Android? <a href="${PLAY}">Get it on Google Play</a></p>
          <p class="alt-links only-android">On a computer? <a href="${WEB}">Use it in your browser</a></p>
          <p class="alt-links">On iPhone? Join the iOS waitlist: <a href="mailto:${IOS}">${IOS}</a></p>
        </div>`,
    card: `
        ${chip}
        <div class="card-content">
          <p class="card-title">You're set</p>
          <p class="card-sub">Web and Android.</p>
          ${anim('check', 'start-check', '1 / 1', 'Animation: a check mark is drawn.')}
        </div>`,
  },
};

STEPS.forEach((s, i) => {
  const R = i === 0 ? '' : '../';
  const link = (j) => (R + STEPS[j].dir) || './';
  const p = pages[s.slug];
  const prev = STEPS[i - 1], next = STEPS[i + 1];
  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${p.title} · Step ${i + 1} of 4</title>
  <meta name="description" content="${p.desc}">
  <meta name="view-transition" content="same-origin">
  <link rel="expect" href="#tour-title" blocking="render">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,700&family=Inter:wght@400;500;600;700&display=swap">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Sans+Bengali:wght@500;700&text=%E0%A7%B3&display=swap">
  <link rel="stylesheet" href="${R}assets/tour.css">
  <link rel="preload" href="${R}anim/${p.card.match(/anim\/([a-z-]+)\.json/)[1]}.json" as="fetch" crossorigin>
  <script src="${R}assets/tour-head.js"></script>
  <script src="${R}vendor/lottie_light.min.js" defer></script>
  <script src="${R}assets/tour.js" defer></script>
</head>
<body class="page-${s.slug}" style="--step:${i + 1}">
  <a class="skip" href="#main">Skip to content</a>
  <header class="top">
    <a class="brand" href="${link(0)}" aria-label="Tally, back to the start of the tour"><span class="brand-mark" aria-hidden="true"></span>Tally</a>
    <nav class="steps" aria-label="Tour progress">
      <p class="steps-label" id="step-label">Step ${i + 1} of 4</p>
      <ol>
${STEPS.map((t, j) => `        <li><a href="${link(j)}"${j === i ? ' aria-current="step"' : ''}><span class="n">${j + 1}</span>${t.label}</a></li>`).join('\n')}
      </ol>
      <div class="progress" aria-hidden="true"><span class="progress-fill"></span></div>
    </nav>
  </header>

  <main id="main">
      <div class="copy">${p.copy.replaceAll('{R}', R)}
      </div>
      <figure class="card" aria-label="Tally preview">${p.card.replaceAll('{R}', R)}
      </figure>
  </main>

  <nav class="tour-nav" aria-label="Tour">
    ${prev ? `<a class="nav-btn nav-back" rel="prev" href="${link(i - 1)}"><span aria-hidden="true">←</span> Back<span class="sr-only">: step ${i} of 4, ${prev.label}</span></a>`
           : `<span class="nav-btn nav-back" aria-hidden="true">← Back</span>`}
    <p class="kbd-hint"><kbd>←</kbd> <kbd>→</kbd> to move through the tour</p>
    ${next ? `<a class="nav-btn nav-next" rel="next" href="${link(i + 1)}">Next: ${next.label} <span aria-hidden="true">→</span><span class="sr-only">, step ${i + 2} of 4</span></a>`
           : `<span class="nav-btn nav-next" aria-hidden="true">Next →</span>`}
  </nav>
</body>
</html>
`;
  writeFileSync(s.file, html);
});
console.log('pages written');
