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
  const [listings, setListings] = useState<Listing[]>(initialListings);
  const [newId, setNewId] = useState<string | null>(null);
  const surpriseFired = useRef(false);

  useEffect(() => {
    if (!query || surpriseFired.current) return;
    surpriseFired.current = true;
    const t = setTimeout(() => {
      toast("Found a better match 👀", {
        description: "Just listed in Long Island City — pinned to the top.",
      });
      setListings((prev) => [surpriseListing, ...prev.filter((l) => l.id !== surpriseListing.id)]);
      setNewId(surpriseListing.id);
      setTimeout(() => setNewId(null), 4000);
    }, 4500);
    return () => clearTimeout(t);
  }, [query]);

  const reset = () => {
    setQuery(null);
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
            Skip the filters. Tell Dwellio what matters — light, neighborhood, vibe — and we'll surface the listings that fit.
          </p>
          <div className="mt-10 w-full">
            <SearchInput onSubmit={setQuery} />
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
          <h2 className="mt-1 font-serif text-2xl leading-snug text-foreground md:text-3xl">
            "{query}"
          </h2>
        </div>

        <div className="mb-8">
          <SearchInput onSubmit={setQuery} initialValue={query} compact />
        </div>

        <div className="mb-5 flex items-baseline justify-between">
          <h3 className="font-serif text-xl text-foreground">Top matches</h3>
          <span className="text-xs text-muted-foreground">{listings.length} listings</span>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {listings.map((l) => (
            <ListingCard key={l.id} listing={l} isNew={l.id === newId} />
          ))}
        </div>
      </main>
    </div>
  );
}
