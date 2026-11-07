// Builds RAG-ready JSONL files from the sector TSV dictionaries.
// Usage: bun tools/build_rag.ts <folder-with-sector-repos>
// For each repo folder named pl-<sector>-wymowa it reads
//   slownik-<sector>-pl.tsv   (termin_en, zapis_pl, kategoria, polski_odpowiednik)
//   idiomy-<sector>-pl-en.tsv (zwrot_pl, angielski, uwagi)
// and writes rag/<sector>.jsonl with one chunk per term or idiom.

import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "fs";
import { join } from "path";

type Chunk = {
  id: string;
  type: "term" | "idiom";
  sector: string;
  text: string;
  en: string;
  pl_pronunciation: string;
  pl_equivalent: string;
};

const root = process.argv[2];
if (!root) {
  console.error("Usage: bun tools/build_rag.ts <folder>");
  process.exit(1);
}

function readRows(file: string): string[][] {
  return readFileSync(file, "utf8")
    .split(/\r?\n/)
    .slice(1)
    .filter((line) => line.trim() !== "")
    .map((line) => line.split("\t").map((c) => c.trim()));
}

function clean(s: string | undefined): string {
  return (s ?? "").replace(/\s+/g, " ").trim();
}

for (const dir of readdirSync(root)) {
  const m = /^pl-(.+)-wymowa$/.exec(dir);
  if (!m) continue;
  const sector = m[1];
  const repo = join(root, dir);
  const chunks = new Map<string, Chunk>();

  const termy = join(repo, `slownik-${sector}-pl.tsv`);
  if (existsSync(termy)) {
    for (const [en, pl, , pol] of readRows(termy)) {
      if (!en || !pl) continue;
      const key = `term:${en.toLowerCase()}`;
      if (chunks.has(key)) continue;
      chunks.set(key, {
        id: `${sector}-term-${chunks.size + 1}`,
        type: "term",
        sector,
        en: clean(en),
        pl_pronunciation: clean(pl),
        pl_equivalent: clean(pol),
        text: `${clean(en)} (wymowa: ${clean(pl)}) - po polsku: ${clean(pol)}`,
      });
    }
  }

  const idiomy = join(repo, `idiomy-${sector}-pl-en.tsv`);
  if (existsSync(idiomy)) {
    for (const [pl, en, uwagi] of readRows(idiomy)) {
      if (!pl || !en) continue;
      const key = `idiom:${pl.toLowerCase()}`;
      if (chunks.has(key)) continue;
      chunks.set(key, {
        id: `${sector}-idiom-${chunks.size + 1}`,
        type: "idiom",
        sector,
        en: clean(en),
        pl_pronunciation: "",
        pl_equivalent: clean(pl),
        text: `Idiom: "${clean(pl)}" = "${clean(en)}"${uwagi ? ` (${clean(uwagi)})` : ""}`,
      });
    }
  }

  const out = join(root, "pl-it-wymowa", "rag");
  mkdirSync(out, { recursive: true });
  const body = [...chunks.values()].map((c) => JSON.stringify(c)).join("\n") + "\n";
  writeFileSync(join(out, `${sector}.jsonl`), body, "utf8");
  const terms = [...chunks.values()].filter((c) => c.type === "term").length;
  const idioms = chunks.size - terms;
  console.log(`${sector}: ${terms} terms, ${idioms} idioms`);
}
