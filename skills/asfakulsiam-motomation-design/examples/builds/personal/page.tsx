// @motomation-template
// id: personal
// name: Letters from Nusrat · one letter a month
// kind: personal brand
// archetype: letter
// mutation: second-person
// signature: thread
// sections: hero-personal-letter, cta-personal-subscribe, testimonial-personal-replies
// fonts: display "Instrument Serif" · text "Instrument Serif" · mono "JetBrains Mono"
// theme: --ground:#e3eaf2;--surface:#eef3f8;--ink:#1a2740;--muted:#44536e;--line:rgba(26,39,64,.2);--accent:#a3271f;--display-scale:.86;--display-lh:1.22;--display-track:0em;--label-font:var(--font-display);--label-size:19px;--label-track:0em;--label-case:none;--label-style:italic;--body-size:21px;--body-lh:1.78
// what: A writer's homepage that is this month's letter, on airmail paper: written to you, a postscript to subscribe, and the replies that came in the post.
import { HeroPersonalLetter } from "../../sections/hero-personal-letter";
import { CtaPersonalSubscribe } from "../../sections/cta-personal-subscribe";
import { TestimonialPersonalReplies } from "../../sections/testimonial-personal-replies";

// Navigation: none on purpose; the letter is read top to bottom. Its end has two links: write back (mailto) and back
// to the salutation. Feedback: links change to the stamp red with a hand-drawn-weight underline on hover, a press
// darkens the red, focus is a highlighter band behind the text
// (form controls, which a background cannot mark, get a highlighter-yellow outline).
const CSS = `
.p-personal a{color:var(--ink);text-decoration:none}
.p-personal a:hover{color:var(--accent);text-decoration:underline 1.5px;text-underline-offset:4px}
.p-personal a:active{color:#6e1712}
.p-personal button:hover{color:#ffd9c9}
:focus-visible{outline:none;background:#f5e27a;color:#1a2740}
input:focus-visible,button:focus-visible{outline:3px solid #c9a227;outline-offset:3px}
.signoff{max-width:720px;margin:0 auto;padding:24px clamp(20px,5vw,48px) 72px;display:flex;flex-wrap:wrap;gap:8px 28px;font:italic 400 21px/1.5 var(--font-display)}
.signoff a{display:inline-flex;align-items:center;min-height:44px}
`;

export function Page() {
  return (
    <div className="p-personal" id="top">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <main id="main">
        <HeroPersonalLetter />
        <CtaPersonalSubscribe />
        <TestimonialPersonalReplies />
      </main>
      <footer className="signoff"><a href="mailto:nusrat@lettersfromnusrat.com">Write back to Nusrat</a><a href="#top">Back to the salutation</a></footer>
    </div>
  );
}
