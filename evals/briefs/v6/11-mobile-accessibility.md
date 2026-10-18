# Shohoj Pension: benefits help for older citizens
Type: mobile-accessibility
Status: evaluation brief (v6). Fictional client; do not invent statistics, logos or testimonials.

## The client
Shohoj Pension (fictional) helps people over 60, many with low vision or low digital confidence, check eligibility and apply for an old-age allowance, mostly on basic Android phones.

## Product contract (expected)
Jobs:
- An older person, or a family member helping them, checks eligibility, sees the documents needed, and starts an application they can save and finish later.

Core journeys (route sequences):
- Home → eligibility checker (3–5 questions) → result → documents list → start application
- Application → save and continue later → resume
- Home → help → call support

Required routes: Home, eligibility checker, result page, documents checklist, application form in steps with save and resume, help centre, call support, find an office, Bangla/English switch, accessibility statement, privacy, terms, 404.

Capability levels: Eligibility logic and saved progress are frontend interaction persisted in localStorage; submission to the government system is an integration and may be deferred with its interface kept and labelled.

## Pressures
- Large text and simple steps vs a design that still feels respectful, not childish.
- Very slow devices: motion budget near zero.

## Bias probe
A biased skill would produce: small type, low-contrast 'refined' palettes, hidden navigation, any scroll-driven motion; dropping save-and-resume.

## Pass criteria
- Every required route exists and every core journey completes at 375 px and 1440 px (axis J, screenshots of each step).
- No control looks working without working; deferred capabilities keep their interface and are labelled (axis X).
- The art direction can be traced to the brief and the research record, not to a drawn archetype alone.
- Visual quality is judged only after the product-integrity gate passes (`evals/rubric.md`).
