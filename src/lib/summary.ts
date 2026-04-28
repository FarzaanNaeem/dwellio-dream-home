// Lightweight keyword extraction to build a natural-sounding summary.
const FACETS: { label: string; patterns: RegExp[] }[] = [
  { label: "sunlight", patterns: [/\bsun(ny|light)?\b/i, /\bnatural light\b/i, /\bbright\b/i] },
  { label: "budget", patterns: [/\$\s?\d/, /\bunder\b/i, /\baffordable\b/i, /\bcheap\b/i, /\bbudget\b/i] },
  { label: "proximity to parks", patterns: [/\bpark(s)?\b/i, /\bgreen\s?space\b/i] },
  { label: "a quiet neighborhood", patterns: [/\bquiet\b/i, /\bcalm\b/i, /\bpeaceful\b/i] },
  { label: "a short commute", patterns: [/\bcommute\b/i, /\bsubway\b/i, /\btrain\b/i, /\bmidtown\b/i, /\bdowntown\b/i] },
  { label: "spaciousness", patterns: [/\bspacious\b/i, /\bloft\b/i, /\blarge\b/i, /\bbig\b/i] },
  { label: "the neighborhood vibe", patterns: [/\bbrooklyn\b/i, /\bhoboken\b/i, /\bqueens\b/i, /\bmanhattan\b/i, /\bvibe\b/i, /\btrendy\b/i] },
  { label: "pet-friendliness", patterns: [/\bpet(s)?\b/i, /\bdog\b/i, /\bcat\b/i] },
  { label: "modern finishes", patterns: [/\bmodern\b/i, /\brenovated\b/i, /\bnew\b/i] },
];

export function buildSummary(query: string): string {
  const matched = FACETS.filter((f) => f.patterns.some((p) => p.test(query))).map((f) => f.label);
  const facets = matched.length ? matched.slice(0, 3) : ["your overall vibe", "location", "value"];

  const joined =
    facets.length === 1
      ? facets[0]
      : facets.length === 2
        ? `${facets[0]} and ${facets[1]}`
        : `${facets.slice(0, -1).join(", ")}, and ${facets[facets.length - 1]}`;

  return `These matches are based on your preference for ${joined}.`;
}
