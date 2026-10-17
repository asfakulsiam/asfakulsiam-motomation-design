// The signature: a drink drawn as a cross-section of its cup, each layer in proportion to its volume.
// tier 1 · use-when: a drink with layers to show · avoid-when: items without volumes (pastry) · reduced-motion: the finished cup at once · touch: display only, driven by the Station buttons
import type { Layer } from "@/lib/site";

const CAPACITY = 300; // ml; the largest cup on the counter, so a small espresso reads as small
const names: Record<Layer["kind"], string> = { espresso: "Espresso", milk: "Steamed milk", foam: "Microfoam", water: "Hot water", filter: "Filter coffee", ice: "Ice" };

export function Cup({ layers, name, spec }: { layers: Layer[]; name: string; spec?: string }) {
  const total = layers.reduce((s, l) => s + l.ml, 0);
  return (
    <figure className="cup">
      <div className="cup__glass" aria-hidden="true">
        <div className="cup__fill" style={{ height: `${Math.min(100, (total / CAPACITY) * 100)}%` }}>
          {layers.map((l, i) => (
            <span key={`${l.kind}-${i}`} className={`cup__layer cup__layer--${l.kind}`} style={{ flexGrow: l.ml, animationDelay: `${i * 40}ms` }} />
          ))}
        </div>
      </div>
      <figcaption>
        <p className="cup__name">{name}</p>
        <dl className="cup__legend mono">
          {[...layers].reverse().map((l, i) => (
            <div key={`${l.kind}-${i}`}><dt><span className={`swatch cup__layer--${l.kind}`} aria-hidden="true" />{names[l.kind]}</dt><dd>{l.ml} ml</dd></div>
          ))}
        </dl>
        {spec ? <p className="cup__spec mono">{spec}</p> : null}
      </figcaption>
    </figure>
  );
}
