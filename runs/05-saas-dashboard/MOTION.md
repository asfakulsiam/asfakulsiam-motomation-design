# MOTION.md: Ledgerly
Tier 1, ENERGY 1 / RHYTHM 1 / MOTION 1.

| Behavior | Purpose and trigger | Tool / timing | Edges and reduced motion |
|---|---|---|---|
| Press feedback | Show the tapped control has responded | CSS translateY(1px), 120ms ease-out | Instant at reduced motion; no delayed navigation or save |
| Hover feedback | Identify actionable rows/links | Instant background/underline; button opacity 120ms | Hover restricted to hover-capable pointers; visible links on touch |
| Field validation | Explain missing/invalid data after submit | Immediate message and aria-invalid border | Focus moves to first invalid field; no shake |
| Local save | Immediate visible persisted result / confirmation route | Synchronous storage, then navigation | Failure retains entered data and provides an alert; no artificial network/loading fiction |
| Native dialog | Confirm destructive local operations | Browser dialog, no entrance choreography | Escape and native focus return; keyboard/touch buttons |
| Data filtering | Replace only rows and count | Immediate DOM update | No stagger or layout transition; live count |

Four questions: these changes communicate action/selection; CSS/native states are cheapest; repeated use merits minimal feedback; interruptions/repeats remain immediate. No decorative/narrative animation, pinning, canvas, rAF loop, smooth scrolling or layout-property animation. All content is visible without motion. No designed-still composition is necessary because there is no narrative motion to replace.

Route families: overview static data; records static rows with selection feedback; forms immediate field/save feedback; preview static invoice; status pages persistent confirmation; navigation has no transitional delay. Mobile retains the same functional language, not a reduced product.
