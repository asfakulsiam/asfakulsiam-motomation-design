// React side of the variant comparison: the same demo content as vendor/plain/<id>/plain.html, built from the React
// components. Bundled by compare.mjs (esbuild from the local toolchain; never a repo dependency). ?c=<id> picks one.
import { createRoot } from "react-dom/client";
import type { ReactNode } from "react";
import { CountUp } from "../../skills/asfakulsiam-motomation-design/examples/components/micro/count-up";
import { SplitFlap } from "../../skills/asfakulsiam-motomation-design/examples/components/type/split-flap";
import { CopyButton } from "../../skills/asfakulsiam-motomation-design/examples/components/micro/copy-button";
import { InkFill } from "../../skills/asfakulsiam-motomation-design/examples/components/type/ink-fill";
import { Typewriter } from "../../skills/asfakulsiam-motomation-design/examples/components/text/typewriter";
import { useState } from "react";

const Label = ({ children }: { children: ReactNode }) => <p className="demo-label">{children}</p>;
const Spacer = () => <div className="demo-spacer" />;
const LONG = "We exist to make that ruling mean something on the bank: we survey, we go to court, and we pay local people to watch their water.";

function Flap() {
  const [v, setV] = useState("JAN 2027");
  return (<><Label>Next free start</Label><p className="demo-big"><SplitFlap value={v} /></p>
    <button type="button" className="demo-button" onClick={() => setV(v === "JAN 2027" ? "MAR 2027" : "JAN 2027")}>Change the date</button></>);
}

const DEMOS: Record<string, () => ReactNode> = {
  "count-up": () => <><Label>Audited, 2025</Label><p className="demo-big"><CountUp value={1260} /></p><p>people paid to watch their own river, monthly.</p></>,
  "split-flap": () => <Flap />,
  "copy-button": () => <><p className="demo-big">work@hawa.studio</p><CopyButton text="work@hawa.studio" label="Copy email" style={{ justifySelf: "start" }} /></>,
  "ink-fill": () => <><Spacer /><InkFill className="demo-big" text={LONG} /><Spacer /></>,
  typewriter: () => <Typewriter className="demo-big" text="Dear reader, this month is about the binders." />,
};

const id = new URLSearchParams(location.search).get("c") || "count-up";
const Demo = DEMOS[id];
createRoot(document.getElementById("root")!).render(<main className="demo">{Demo ? <Demo /> : <p>unknown {id}</p>}</main>);
