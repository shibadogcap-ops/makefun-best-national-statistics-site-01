// Entrypoint for the make.fun bounty kit. This file runs under plain `node main.ts` (Node's type
// stripping, standard library only). It stages this repository for judging:
//
//   1. figure out where this script lives and where the finished entry should go;
//   2. wipe and rebuild that output directory;
//   3. copy the site's files (app/) and the screenshots (screenshots/) into it;
//   4. ask the vendored make.fun library for the dossier JSON and write it out verbatim.
//
// The scorer compares dossier.json byte for byte against what its own copy of
// vendor/makefun-frontend.ts produces, so that file must stay untouched and the
// bytes returned by buildDossier must be written with no extra formatting.

import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

// This script's own directory is the repository root; every path below is relative to it.
const repoRoot = fileURLToPath(new URL('.', import.meta.url));

// MAKEFUN_OUTPUT_DIR overrides where the entry is assembled; otherwise a fresh
// `output/` folder is created next to this file.
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? join(repoRoot, 'output');

// Recreate the output directory from scratch so stale files can never leak into a submission.
rmSync(outputDir, { recursive: true, force: true });
mkdirSync(outputDir, { recursive: true });

// Bring over the frontend (app/) and the judge's screenshots (screenshots/), preserving structure.
cpSync(join(repoRoot, 'app'), join(outputDir, 'app'), { recursive: true });
if (existsSync(join(repoRoot, 'screenshots'))) {
  cpSync(join(repoRoot, 'screenshots'), join(outputDir, 'screenshots'), { recursive: true });
}

// The caps mirror the scorer's gate.json: text_max_bytes bounds the dossier's
// source text, the screenshot caps bound how many/how large the images may be,
// and the app caps refuse an entry the platform would reject (too many files or
// too many bytes under app/).
const dossierBytes = buildDossier(outputDir, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 16777216,
});

// Write the dossier exactly as returned — no newline, no reformatting.
writeFileSync(join(outputDir, 'dossier.json'), dossierBytes);

console.log(`Wrote ${join(outputDir, 'dossier.json')} (${dossierBytes.length} bytes)`);
