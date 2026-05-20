import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { ArrowLeft, Sparkles } from "lucide-react";
import { SearchInput } from "@/components/SearchInput";
import { ListingCard } from "@/components/ListingCard";
import { initialListings, surpriseListing, type Listing } from "@/lib/listings";
import { buildSummary } from "@/lib/summary";

type Phase = "analyzing" | "ready";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Dwellio — Find your next home, in your own words" },
      {
        name: "description",
        content: "Describe your ideal apartment and Dwellio surfaces the listings that actually match.",
      },
    ],
  }),
});

function Header() {
  return (
    <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-foreground text-background">
          <span className="font-serif text-sm leading-none">D</span>
        </div>
        <span className="font-serif text-xl tracking-tight text-foreground">Dwellio</span>
      </div>
      <span className="text-xs text-muted-foreground">Beta</span>
    </header>
  );
}

function Index() {
  const [query, setQuery] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>("analyzing");
  const [listings, setListings] = useState<Listing[]>(initialListings);
  const [newId, setNewId] = useState<string | null>(null);
  const surpriseFired = useRef(false);

  const [sessionId, setSessionId] = useState(() => {
    let id = localStorage.getItem("session_id");
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem("session_id", id);
    }
    return id;
  });

  const handleQuery = async (q: string) => {
    setQuery(q);
    setPhase("analyzing");

    const res = await fetch("http://127.0.0.1:8001/api/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: q,
        session_id: sessionId,
      }),
    });

    const data = await res.json();

    const transformedListings = data.results.map((l: any) => ({
      id: l.id,
      price: l.price,
      location: l.location,

      match: Math.round(l.score),

      strengths:
        l.explanation?.strengths ?? (l.explanation?.summary ? [l.explanation.summary] : []),

      tradeoffs: l.explanation?.tradeoffs || [],
    }));

    setListings(transformedListings);
    setPhase("ready");
  };

  // Analyzing → ready transition
  useEffect(() => {
    if (!query) return;
    setPhase("analyzing");
    const t = setTimeout(() => setPhase("ready"), 1200);
    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => {
    if (!sessionId) return;

    const es = new EventSource(`http://127.0.0.1:8001/api/events?session_id=${sessionId}`);

    es.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "better_listing") {
        const l = data.listing;

        const transformed = {
          id: l.id,
          price: l.price,
          location: l.location,
          match: Math.round(l.score),
          strengths: l.explanation?.summary ? [l.explanation.summary] : [],
          tradeoffs: l.explanation?.tradeoffs || [],
        };

        toast("🔥 Found a better match", {
          description: "New listing added to the top",
        });

        setListings((prev) => [transformed, ...prev.filter((p) => p.id !== transformed.id)]);
      }
    };

    return () => es.close();
  }, [sessionId]);

  const reset = () => {
    setQuery(null);
    setPhase("analyzing");
    setListings(initialListings);
    surpriseFired.current = false;
    setNewId(null);
  };

  if (!query) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="mx-auto flex max-w-2xl flex-col items-center px-6 pt-24 pb-16 md:pt-32">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground">
            <Sparkles className="h-3 w-3" />
            AI-powered apartment hunting
          </div>
          <h1 className="text-center font-serif text-5xl leading-[1.05] text-foreground md:text-6xl">
            Find your next home,
            <br />
            <em className="italic text-muted-foreground">in your own words.</em>
          </h1>
          <p className="mt-5 max-w-md text-center text-sm leading-relaxed text-muted-foreground md:text-base">
            Skip the filters. Tell Dwellio what matters — light, neighborhood, vibe — and we'll surface the listings
            that fit.
          </p>
          <div className="mt-10 w-full">
            <SearchInput onSubmit={handleQuery} />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="mx-auto max-w-6xl px-6 pb-24">
        <button
          onClick={reset}
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          New search
        </button>

        <div className="mb-8 max-w-3xl">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Searching for</p>
          <h2 className="mt-1 font-serif text-2xl leading-snug text-foreground md:text-3xl">"{query}"</h2>
        </div>

        <div className="mb-8">
          <SearchInput onSubmit={handleQuery} initialValue={query} compact />
        </div>

        {/* Agent status + dynamic summary */}
        <div
          key={phase + query}
          className="mb-8 rounded-2xl border border-border bg-card/60 px-5 py-4 animate-[fade-in_0.4s_ease-out]"
          style={{ boxShadow: "var(--shadow-soft)" }}
        >
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
            <span
              className={
                phase === "analyzing"
                  ? "inline-block h-1.5 w-1.5 rounded-full bg-foreground/60 animate-pulse"
                  : "inline-block h-1.5 w-1.5 rounded-full bg-primary"
              }
            />
            {phase === "analyzing" ? "Analyzing your preferences…" : "Found your best matches"}
          </div>
          <p className="mt-2 text-sm leading-relaxed text-foreground/80 md:text-base">
            {phase === "analyzing" ? "Reading between the lines of what you described." : buildSummary(query)}
          </p>
        </div>

        <div
          className={
            "transition-all duration-500 " +
            (phase === "analyzing" ? "opacity-0 translate-y-2 pointer-events-none" : "opacity-100 translate-y-0")
          }
        >
          <div className="mb-5 flex items-baseline justify-between">
            <h3 className="font-serif text-xl text-foreground">Top matches</h3>
            <span className="text-xs text-muted-foreground">{listings.length} listings</span>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {(() => {
              const bestId = listings.reduce((acc, l) => (l.match > acc.match ? l : acc), listings[0])?.id;
              return listings.map((l) => <ListingCard key={l.id} listing={l} sessionId={sessionId} />);
            })()}
          </div>
        </div>
      </main>
    </div>
  );
}
