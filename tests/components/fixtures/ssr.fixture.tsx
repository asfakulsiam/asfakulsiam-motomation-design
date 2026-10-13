// SSR + hydration test entry (tests/components/ssr.test.mjs). Bundled twice: for Node (renderToString of one demo) and
// for the browser (hydrateRoot of the same demo over that markup). Each demo is the component's gallery demo.
import type { ReactNode } from "react";
import { DEMOS } from "../../../skills/asfakulsiam-motomation-design/examples/gallery/demos";

// negative control (not a component): different text on the server and the client, which the test must catch
const CONTROL = () => <p>{typeof window === "undefined" ? "server" : "client"}</p>;
export function Demo({ id }: { id: string }): ReactNode { return <div data-demo={id}>{id === "__control-mismatch" ? <CONTROL /> : DEMOS[id]()}</div>; }
export const IDS = Object.keys(DEMOS);
