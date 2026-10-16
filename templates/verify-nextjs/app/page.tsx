import site from "@/data/site.json";
import status from "@/data/status.json";
import { Chapters } from "@/components/Chapters";

export default function Page() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <header className="min-h-[70vh] flex flex-col justify-end gap-6 pb-12 border-b border-ink">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted">templates/verify-nextjs</p>
        <h1 className="text-6xl font-semibold tracking-tight">{site.name}</h1>
        <p className="max-w-prose text-lg text-muted">{site.tagline}</p>
        <ul aria-label="Toolchain" className="flex flex-wrap gap-2">
          {status.items.map((s) => (
            <li key={s.label} className="font-mono text-xs border border-ink px-2 py-1">
              {s.label} · {s.state}
            </li>
          ))}
        </ul>
      </header>
      <Chapters chapters={site.chapters} />
      <footer className="py-12 font-mono text-xs text-muted">Scroll motion: GSAP ScrollTrigger. Reduced motion: no animation.</footer>
    </main>
  );
}
