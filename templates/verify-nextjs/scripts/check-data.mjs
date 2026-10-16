// Validates data/*.json against schema.json without dependencies (the subset of JSON Schema the schema uses:
// type, required, additionalProperties: false, properties, items, $ref to #/$defs, enum, pattern, min/max lengths,
// minimum, minItems). Exit 1 on the first file with problems.
import { readFileSync } from "node:fs";

const schema = JSON.parse(readFileSync(new URL("../schema.json", import.meta.url), "utf8"));
const problems = [];

function typeOf(v) { return Array.isArray(v) ? "array" : v === null ? "null" : Number.isInteger(v) ? "integer" : typeof v; }

function check(v, s, at) {
  if (s.$ref) s = schema.$defs[s.$ref.replace("#/$defs/", "")];
  if (s.enum && !s.enum.includes(v)) problems.push(`${at}: ${JSON.stringify(v)} is not one of ${s.enum.join(", ")}`);
  if (s.type) { const t = typeOf(v); if (t !== s.type && !(s.type === "number" && t === "integer")) return problems.push(`${at}: expected ${s.type}, got ${t}`); }
  if (typeof v === "string") {
    if (s.minLength != null && v.length < s.minLength) problems.push(`${at}: shorter than ${s.minLength}`);
    if (s.maxLength != null && v.length > s.maxLength) problems.push(`${at}: longer than ${s.maxLength} (${v.length})`);
    if (s.pattern && !new RegExp(s.pattern).test(v)) problems.push(`${at}: does not match ${s.pattern}`);
  }
  if (typeof v === "number" && s.minimum != null && v < s.minimum) problems.push(`${at}: below ${s.minimum}`);
  if (Array.isArray(v)) {
    if (s.minItems != null && v.length < s.minItems) problems.push(`${at}: fewer than ${s.minItems} items`);
    if (s.items) v.forEach((x, i) => check(x, s.items, `${at}[${i}]`));
  }
  if (v && typeof v === "object" && !Array.isArray(v)) {
    for (const k of s.required ?? []) if (!(k in v)) problems.push(`${at}: missing ${k}`);
    for (const [k, x] of Object.entries(v)) {
      if (s.properties?.[k]) check(x, s.properties[k], `${at}.${k}`);
      else if (s.additionalProperties === false) problems.push(`${at}: unexpected key ${k}`);
    }
  }
}

for (const name of Object.keys(schema.properties)) {
  const data = JSON.parse(readFileSync(new URL(`../data/${name}.json`, import.meta.url), "utf8"));
  check(data, schema.properties[name], `data/${name}.json`);
}
if (problems.length) { console.error(problems.map((p) => `✗ ${p}`).join("\n")); process.exit(1); }
console.log(`✓ data/*.json match schema.json (${Object.keys(schema.properties).length} files)`);
