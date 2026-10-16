Imagery is out of scope for this benchmark. Placeholders are expected and will not be judged. Focus on structure, typography, layout, and motion.

# Tally · a four-step product tour
Tier: 3 — Pro
Why this tier: the site is a guided flow across four pages, not one scrolling page, so the motion that matters is the transition between pages (shared elements carried from one step to the next); Tier 2 scroll choreography would miss the point, and Tier 4–5 real-time 3D or scroll film would turn a short decision into a show.

## The client
Tally is a small Dhaka startup making a shared-expenses app for flatmates and families: you add what you paid, it keeps a running balance and tells everyone who owes whom. It is launching on the web and Android. The founders want a short tour that takes a visitor from "what is this" to "start" in four calm steps, where each step feels like the same object moving forward, not a new page loading.

## What they need
- Explain the product in four steps a visitor walks through in order (with back and forward).
- Make each transition continuous: the thing the visitor was looking at carries into the next page.
- Show the core interaction (adding an expense, the balance settling) as a small animation, not a paragraph.
- End on a clear start action, with the price already understood.

## Pages
- Intro: what Tally is, in one sentence and one picture of the balance.
- Features: the three things it does.
- Pricing: two plans.
- Start: the sign-up / download step.

## Content
- Name: Tally. Line: "Split it once. Stop doing the maths."
- Intro picture: a running balance card, e.g. "Mitu owes Sabbir ৳ 640".
- Features (three):
  1. "Add in two taps": amount, who paid, done.
  2. "Balances settle themselves": Tally works out the fewest payments to square up.
  3. "Works in ৳ and offline": entries sync when you are back online.
- Pricing:
  - Free: up to 2 groups, unlimited expenses.
  - Tally Plus: ৳ 149 / month or ৳ 1,290 / year, unlimited groups, receipts, export to CSV.
- Start: "Get it on Google Play" → https://play.example.com/tally ; "Use it in your browser" → https://app.tally.example.com/start ; email for the iOS waitlist: ios@tally.example.com.
- Product animation: one short animation per page (the balance card on Intro, an expense being added on Features, a plan toggle on Pricing, a check mark on Start), supplied as Lottie or Rive files by the client's designer later; the site defines where each plays and what it shows until it loads.
- English, with amounts in Bangladeshi taka (৳).

## Constraints
- Four real pages (four URLs a visitor can share and reload), connected by the View Transitions API, with shared elements carried across pages; a browser without View Transitions still gets a working, instant page change.
- Animations: Lottie or Rive for the product illustrations.
- Each transition must feel continuous: no blank flash, no layout jump, the shared element visibly travels. Back must reverse the transition.
- Reduced motion: transitions become a simple cross-fade or instant change; animations show their final frame.
- Keyboard and screen reader: focus moves to the new page's heading after each transition; a step indicator says "Step 2 of 4".
- Stack: not specified by the client. Chosen at Step 0.

## Success
- A visitor clicks through all four pages and it feels like one continuous object moving forward, then backward, without a reload feel.
- By the Pricing page they understand what Tally does and what it costs; Start is one obvious action.
- The motion is the navigation: remove it and the tour would lose its sense of sequence.

Approve every checkpoint.
