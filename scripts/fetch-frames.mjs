#!/usr/bin/env node
// Repository-root entry point for skills/asfakulsiam-motomation-design/scripts/fetch-frames.mjs (same arguments).
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
const target = fileURLToPath(new URL("../skills/asfakulsiam-motomation-design/scripts/fetch-frames.mjs", import.meta.url));
process.exit(spawnSync(process.execPath, [target, ...process.argv.slice(2)], { stdio: "inherit" }).status ?? 1);
