Imagery is out of scope for this benchmark. Placeholders are expected and will not be judged. Focus on structure, typography, layout, and motion.

# Kaal Studio
Tier: 4 — Max
Why this tier: the studio sells real-time 3D and interactive work, so a live WebGL hero and spatial sections are a claim about what they can build; a Tier 2–3 site would undersell the product, and a Tier 5 scroll film would turn the portfolio into one linear story when clients need to browse four case studies.

## The client
Kaal Studio is a five-person design and creative-technology studio in Dhaka (Gulshan) that builds interactive installations, WebGL product configurators and brand worlds for clients in Bangladesh and abroad. Their site is their pitch: prospective clients judge their craft by how the site itself behaves. It must also work for a procurement manager on an old Android phone.

## What they need
- Prove the craft in the first seconds: a real-time 3D hero that responds to the visitor.
- Let clients browse four case studies and understand each one: problem, what was built, result.
- Introduce the people and how they work.
- Make getting in touch easy from anywhere on the site.

## Pages
- Home: WebGL hero, a short statement, the four case studies as a spatial index, a contact prompt.
- Work: four case-study pages (one per project).
- About: the studio, the team, the process.
- Contact: enquiry details.

## Content
- Statement: "We build the things you can walk around in."
- Case studies (four, use only these facts):
  1. **Jamdani Configurator** for a textile house: a WebGL tool to preview woven patterns on a sari in real time; 9 weeks; online custom orders opened for the first time.
  2. **River Room**, a museum installation at a Dhaka gallery: projection and sensors that ripple a river map as people walk; ran for 6 weeks.
  3. **Volt Bike Launch** for an electric two-wheeler brand: a 3D product page with colour and battery options; launched with the bike in 2025.
  4. **Night Market**, an interactive festival map: a walkable 3D map of 120 food stalls, used on phones at the event.
- Each case study: a hero still (supplied later as a file; hold its place), a 3–4 sentence summary, role list, year, and one "how we built it" note.
- Team: Nusrat Jahan (creative director), Arif Chowdhury (technical director), Labiba Islam (3D artist), Shams Rahman (developer), Priya Das (producer).
- Process (four words with one line each): Listen, Prototype, Build, Tune.
- Contact: hello@kaal.example.com, +880 1800 000000, House 12, Road 41, Gulshan 2, Dhaka. Enquiries for 2027 open.

## Constraints
- A WebGL hero (real time, responds to pointer or scroll) and spatial sections (depth, parallax or a 3D index) on Home; case-study pages may use lighter motion.
- Static poster fallback on mobile and under reduced motion: no WebGL canvas, a designed still in its place, and every piece of content and navigation still available.
- Performance: the first screen is usable before the 3D scene finishes loading; the scene must not block reading or navigation; it pauses when off screen or in a background tab.
- Accessible: everything reachable by keyboard; the 3D hero has a text equivalent; contrast AA over the scene and over the poster.
- English only.
- Stack: not specified by the client. Chosen at Step 0.

## Success
- On a laptop, the hero makes a prospective client want to touch it, and the four case studies are easy to tell apart and open.
- On an old phone or with reduced motion, the site is just as complete, fast and good-looking with posters instead of a live scene.
- The 3D is the studio's argument, not decoration: it shows the kind of thing Kaal builds.
