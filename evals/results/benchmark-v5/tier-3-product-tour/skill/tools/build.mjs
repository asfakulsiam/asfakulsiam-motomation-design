// Writes the four tour pages from one template so the route, slip and pager are identical in structure.
// Run from the project folder: node tools/build.mjs   (re-run after editing; stamps are kept per page)
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";

const SITE = "https://tally.example.com/";
const posters = JSON.parse(readFileSync("tools/posters.json", "utf8"));
const TK = "৳\u00a0"; // taka sign + no-break space

// Inline, render-time script: direction for the transition, and whether we arrived from another tour step.
const HEAD_JS = `(function(){var d=document.documentElement;d.className+=" js";var m={"":0,"index.html":0,"features.html":1,"pricing.html":2,"start.html":3};function s(u){try{var p=new URL(u,location.href).pathname.split("/").pop();return p in m?m[p]:null}catch(e){return null}}addEventListener("pagereveal",function(e){var a=window.navigation&&navigation.activation;if(!a||!a.from||!a.entry||a.navigationType==="reload")return;var f=s(a.from.url),t=s(a.entry.url);if(f===null||t===null||f===t)return;d.setAttribute("data-dir",t<f?"back":"fwd");d.setAttribute("data-arrived","");if(e.viewTransition){window.__tallyReveal=e.viewTransition.finished.catch(function(){}).then(function(){d.removeAttribute("data-dir")})}})})();`;
const HASH = "sha256-" + createHash("sha256").update(HEAD_JS).digest("base64");

const steps = [
  { file: "index.html", name: "Intro", short: "What it is" },
  { file: "features.html", name: "Features", short: "What it does" },
  { file: "pricing.html", name: "Pricing", short: "What it costs" },
  { file: "start.html", name: "Start", short: "Start" },
];

const lines = [
  `<li class="line-1"><span class="ln">01</span><span>Mitu owes Sabbir</span><span class="amt">${TK}640</span></li>`,
  `<li class="line-2"><span class="ln">02</span><span>Expense added in two taps</span><span class="amt">done</span></li>`,
  `<li class="line-3"><span class="ln">03</span><span>Free, or Plus</span><span class="amt">${TK}149/mo</span></li>`,
  `<li class="line-4"><span class="ln">04</span><span>Ready on web and Android</span><span class="amt">&#10003;</span></li>`,
];

const windows = [
  { lottie: "balance", label: "Balance card: an arrow draws from Mitu to Sabbir and the balance bar fills to ৳ 640 owed.", tags: `<span class="tag tag--on" style="left:15%;top:38.3%">M</span><span class="tag tag--on" style="left:85%;top:38.3%">S</span>` },
  { lottie: "add-expense", label: "An expense being added: the add button is tapped twice and a new row drops into the list with a tick.", tags: "" },
  { lottie: "plan-toggle", label: "Plan toggle: the switch slides from Free to Tally Plus.", tags: `<span class="tag" style="left:17%;top:50%">Free</span><span class="tag" style="left:83%;top:50%">Plus</span>` },
  { lottie: "check", label: "A check mark draws inside a circle: you are ready to start.", tags: "" },
];

const meta = [
  { title: "Tally · split shared expenses with flatmates and family", desc: "Tally keeps a running balance for flatmates and families and tells everyone who owes whom. A four-step tour, step 1 of 4." },
  { title: "What Tally does · three features · Tally", desc: "Add an expense in two taps, let balances settle themselves, and keep working in taka while offline. Step 2 of 4 of the Tally tour." },
  { title: "Tally pricing · Free, or Tally Plus at ৳ 149 a month", desc: "Free covers up to 2 groups with unlimited expenses. Tally Plus is ৳ 149 a month or ৳ 1,290 a year with receipts and CSV export." },
  { title: "Start with Tally · Google Play or your browser", desc: "Get Tally on Google Play or use it in your browser. On iPhone, join the iOS waitlist at ios@tally.example.com. Step 4 of 4." },
];

const copy = [
  // 1 · Intro
  `<p class="kicker"><b>01</b> · What it is</p>
        <h1 id="title" tabindex="-1">Split it once. Stop doing the maths.</h1>
        <p class="lead">Tally is a shared-expenses app for flatmates and families. Add what you paid. Tally keeps a running balance and tells everyone who owes whom.</p>
        <p class="aside">On the web and Android.</p>`,
  // 2 · Features
  `<p class="kicker"><b>02</b> · What it does</p>
        <h1 id="title" tabindex="-1">Three things it does for the whole group</h1>
        <ol class="features">
          <li><span class="no" aria-hidden="true">2.1</span><h2>Add in two taps</h2><p>Amount, who paid, done.</p></li>
          <li><span class="no" aria-hidden="true">2.2</span><h2>Balances settle themselves</h2><p>Tally works out the fewest payments to square up.</p></li>
          <li><span class="no" aria-hidden="true">2.3</span><h2>Works in ${TK.trim()} and offline</h2><p>Entries sync when you are back online.</p></li>
        </ol>`,
  // 3 · Pricing
  `<p class="kicker"><b>03</b> · What it costs</p>
        <h1 id="title" tabindex="-1">Free for up to 2 groups, or ${TK}149 a month for unlimited</h1>
        <div class="plans">
          <section class="plan" aria-labelledby="plan-free">
            <h2 id="plan-free">Free</h2>
            <p class="price">Up to 2 groups</p>
            <ul><li>Unlimited expenses</li></ul>
          </section>
          <section class="plan plan--plus" aria-labelledby="plan-plus">
            <h2 id="plan-plus">Tally Plus</h2>
            <p class="price num">${TK}149 <small>/ month</small></p>
            <p class="alt num">or ${TK}1,290 / year</p>
            <ul><li>Unlimited groups</li><li>Receipts</li><li>Export to CSV</li></ul>
          </section>
        </div>`,
  // 4 · Start
  `<p class="kicker"><b>04</b> · Start</p>
        <h1 id="title" tabindex="-1">Start your first group</h1>
        <p class="lead">Free for up to 2 groups. Tally Plus is <span class="num">${TK}149</span> a month or <span class="num">${TK}1,290</span> a year when you need more.</p>
        <div class="actions">
          <a class="btn btn--go" href="https://play.example.com/tally">Get it on Google Play</a>
          <a class="btn btn--quiet" href="https://app.tally.example.com/start">Use it in your browser</a>
        </div>
        <p class="waitlist">On iPhone? Email <a href="mailto:ios@tally.example.com">ios@tally.example.com</a> to join the iOS waitlist.</p>`,
];

const pager = [
  { next: ["features.html", "See what it does"] },
  { back: ["index.html", "Back to Intro"], next: ["pricing.html", "See the two plans"] },
  { back: ["features.html", "Back to Features"], next: ["start.html", "Go to Start"] },
  { back: ["pricing.html", "Back to Pricing"] },
];

const logo = `<svg viewBox="0 0 24 28" aria-hidden="true" focusable="false"><path d="M3 2h18v22l-3-2-3 2-3-2-3 2-3-2-3 2z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M7 8h10M7 12h10M7 16h6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`;

const jsonld = (i) => JSON.stringify(i === 2 || i === 3 ? {
  "@context": "https://schema.org", "@type": "SoftwareApplication", name: "Tally", applicationCategory: "FinanceApplication",
  operatingSystem: "Android, Web", url: SITE,
  offers: [
    { "@type": "Offer", name: "Free", price: "0", priceCurrency: "BDT", description: "Up to 2 groups, unlimited expenses" },
    { "@type": "Offer", name: "Tally Plus (monthly)", price: "149", priceCurrency: "BDT", description: "Unlimited groups, receipts, export to CSV" },
    { "@type": "Offer", name: "Tally Plus (yearly)", price: "1290", priceCurrency: "BDT", description: "Unlimited groups, receipts, export to CSV" },
  ],
} : { "@context": "https://schema.org", "@type": "SoftwareApplication", name: "Tally", applicationCategory: "FinanceApplication", operatingSystem: "Android, Web", url: SITE, description: "Shared expenses for flatmates and families: a running balance that tells everyone who owes whom." });

function page(i) {
  const st = steps[i];
  const url = SITE + (i === 0 ? "" : st.file);
  const prev = existsSync(st.file) ? readFileSync(st.file, "utf8").match(/\/\* motomation · [^*]*\*\//) : null;
  const stamp = prev ? prev[0] : `/* motomation · archetype: atlas · mutation: remove-expected · signature: slip-carry · tier: 3 · critique: <from gate.mjs> · gate: <from gate.mjs> */`;
  const w = windows[i];
  const route = steps.map((s, n) => `<li><a data-tour href="${s.file}"${n === i ? ' aria-current="step"' : ""}><b>0${n + 1}</b> ${s.name}</a></li>`).join("\n          ");
  const p = pager[i];
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${meta[i].title}</title>
<meta name="description" content="${meta[i].desc}">
<link rel="canonical" href="${url}">
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' '${HASH}'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'none'; form-action 'none'">
<meta name="referrer" content="strict-origin-when-cross-origin">
<meta name="theme-color" content="#ECE8DF">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Tally">
<meta property="og:title" content="${meta[i].title}">
<meta property="og:description" content="${meta[i].desc}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${SITE}og.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<link rel="icon" href="assets/favicon.svg" type="image/svg+xml">
<link rel="preload" href="assets/fonts/YoungSerif-400-normal-latin.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="assets/tour.css">
<style>
${stamp}
</style>
<link rel="expect" href="#tour-end" blocking="render">
<script>${HEAD_JS}</script>
<script src="assets/tour.js" defer></script>
<script type="application/ld+json">${jsonld(i)}</script>
</head>
<body class="s${i + 1}">
<a class="skip" href="#title">Skip to step ${i + 1}</a>
<header class="top">
  <a class="mark" href="index.html" data-tour aria-label="Tally, back to the start of the tour">${logo}<span aria-hidden="true">Tally</span></a>
  <nav class="route" aria-label="Tour steps">
    <p class="route-count">Step ${i + 1} of 4<span class="vh">: ${st.name}</span></p>
    <div class="track">
      <ol>
          ${route}
      </ol>
      <span class="route-marker" aria-hidden="true"></span>
    </div>
  </nav>
</header>
<main id="main">
  <div class="stage">
    <div class="copy">
        ${copy[i]}
    </div>
    <aside class="slip" aria-label="Your Tally slip, ${i + 1} of 4 lines printed">
      <p class="slip-head"><b>TALLY</b><span>running balance</span></p>
      <div class="window" role="img" aria-label="${w.label}" data-lottie="assets/lottie/${w.lottie}.json" data-player="assets/vendor/lottie_light.min.js">
        ${posters[w.lottie]}${w.tags}
      </div>
      <ol class="slip-lines">
        ${lines.slice(0, i + 1).join("\n        ")}
      </ol>
    </aside>
  </div>
  <nav class="pager" id="tour-end" aria-label="Previous and next step">
    ${p.back ? `<a class="back" data-tour rel="prev" href="${p.back[0]}"><span aria-hidden="true">&larr;</span> ${p.back[1]}</a>` : `<span class="spacer"></span>`}
    ${p.next ? `<a class="btn btn--go" data-tour rel="next" href="${p.next[0]}">${p.next[1]} <span class="arr" aria-hidden="true">&rarr;</span></a>` : ""}
  </nav>
</main>
<footer class="foot">
  <p>Tally · shared expenses for flatmates and families · a small team in Dhaka</p>
</footer>
</body>
</html>
`;
}

steps.forEach((s, i) => writeFileSync(s.file, page(i)));
console.log("wrote", steps.map((s) => s.file).join(", "), "· CSP", HASH);
