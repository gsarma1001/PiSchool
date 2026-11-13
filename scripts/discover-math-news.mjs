import { readFile } from "node:fs/promises";
import { XMLParser, XMLValidator } from "fast-xml-parser";

const sources = JSON.parse(
  await readFile(new URL("../src/lib/math-news/sources.json", import.meta.url), "utf8"),
);
const parser = new XMLParser({ ignoreAttributes: false });
const candidates = [];
const seenLinks = new Set();
let failures = 0;

for (const source of sources) {
  try {
    const response = await fetch(source.feed, { signal: AbortSignal.timeout(15000) });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const xml = await response.text();
    if (XMLValidator.validate(xml) !== true) throw new Error("Invalid XML");
    const parsed = parser.parse(xml);
    const entries = parsed.rss?.channel?.item ?? parsed["rdf:RDF"]?.item;
    if (!entries) throw new Error("No RSS items found");
    for (const entry of Array.isArray(entries) ? entries : [entries]) {
      if (typeof entry.link !== "string" || typeof entry.title !== "string") continue;
      const link = new URL(entry.link);
      if (link.protocol !== "https:") continue;
      link.hash = "";
      for (const key of [...link.searchParams.keys()]) {
        if (key.startsWith("utm_")) link.searchParams.delete(key);
      }
      const canonical = link.href;
      if (seenLinks.has(canonical)) continue;
      seenLinks.add(canonical);
      candidates.push({
        publisher: source.publisher,
        title: entry.title,
        url: canonical,
        published: entry.pubDate ?? entry["dc:date"] ?? null,
      });
    }
  } catch (error) {
    failures += 1;
    console.error(`${source.id}: ${error instanceof Error ? error.message : "Feed failed"}`);
  }
}

console.log(JSON.stringify(candidates, null, 2));
if (failures) process.exitCode = 1;
