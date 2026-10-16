// critique S (variety) compares a build with the builds logged BEFORE it, never with its own entry.
import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { tmpdir } from "node:os";
import { memoryAxis } from "../../skills/asfakulsiam-motomation-design/scripts/gate.mjs";

const A = resolve("fixtures/variety/a"), B = resolve("fixtures/variety/b");
const log = (runs) => { const d = mkdtempSync(join(tmpdir(), "s-")); const f = join(d, "log.json"); writeFileSync(f, JSON.stringify({ runs })); return f; };
const a = { dir: A, archetype: "timeline", signature: "paper-feed", tier: "1" }, b = { dir: B, archetype: "timeline", signature: "year-ruler", tier: "1" };

test("S: the first build is 5 even when it is logged and a later build follows it", async () => {
  const m = await memoryAxis(log([a, b]), a, [], { dir: A, designFile: join(A, "DESIGN.md") });
  assert.equal(m.s, 5); assert.match(m.trace, /self-excluded/);
});
test("S: the second build with the same archetype scores lower", async () => {
  const f = log([a, b]);
  const first = await memoryAxis(f, a, [], { dir: A, designFile: join(A, "DESIGN.md") }), second = await memoryAxis(f, b, [], { dir: B, designFile: join(B, "DESIGN.md") });
  assert.ok(second.s < first.s, `S ${second.s} < ${first.s}`); assert.equal(second.reused.archetype, true); assert.equal(second.reused.signature, false);
});
test("S: palette family from DESIGN.md counts as a reuse", async () => {
  const f = log([{ archetype: "stage", signature: "x", tier: "3", palette_family: "light-orange" }]);
  const m = await memoryAxis(f, a, [], { dir: A, designFile: join(A, "DESIGN.md") });
  assert.equal(m.palette, "light-orange"); assert.equal(m.reused.palette, true); assert.equal(m.s, 4);
});
test("S: entries logged without --dir fall back to archetype + signature + tier", async () => {
  const f = log([{ archetype: "room", signature: "impact", tier: "4" }, { archetype: "timeline", signature: "paper-feed", tier: "1" }]);
  const m = await memoryAxis(f, a, [], { dir: "/nowhere", designFile: join(A, "DESIGN.md") });
  assert.equal(m.reused.archetype, false); assert.match(m.trace, /self-excluded/);
});
