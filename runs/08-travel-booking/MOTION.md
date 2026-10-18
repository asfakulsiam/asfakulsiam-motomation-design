# Motion: Srimangal Hills

## Motion principles
Tier 1. Calm, direct feedback without cinematic delay.
Ease: cubic-bezier(0.22, 1, 0.36, 1).
Nothing moves automatically. Headings, photographs, prices and dates remain stationary. Native scrolling only.

## Global
| Element | Behaviour | Tier | Duration/ease | Reduced motion |
|---|---|---|---|---|
| Buttons | Press translates down 1px; immediate solid hover colour | 1 | transform 120ms ease-out | No transform, solid state change |
| Links | Underline on hover/focus, no travel | 1 | Instant | Same |
| Calendar | Selection changes fill and explicit selected-date text | 1 | Instant | Same |
| Month change | Immediate replacement, heading announces month | 1 | Instant | Same |
| Async forms | Disabled button and live pending label until fetch settles | 1 | Actual request duration, no fake delay | Same static feedback |
| Experience selection | Immediate button text and live status | 1 | Instant | Same |
| Form errors | Inline text plus aria-invalid, no shake | 1 | Instant | Same |
| Navigation | Native cross-document navigation, no transition gate | 1 | Browser-native | Same |
| Map | Explicit user-triggered iframe load | 1 | Network-dependent, reserved box | Same |

## Route-family motion
Home, room index, room detail and experiences: no entrance reveal. Booking: only press and state feedback. Confirmation: no confetti or animated checkmark. Legal and arrival: no animation.

## Four-question test
Press feedback moves because it confirms activation, tells what changed, uses the cheapest CSS transform, and reverses on release. Disabled/loading states tell the visitor a request is pending without blocking other navigation. All repeated actions are idempotent or reversible. Reduced-motion style removes transforms and transitions; touch receives active/selected state without hover.

## Signature
None: identity comes from composition, type, imagery and the booking system.

## Verification
Planned: keyboard input, reduced-motion emulation, 375/768/1440 journey captures. No smoothness or CPU-throttle performance claim; no persistent animation needs such choreography.
