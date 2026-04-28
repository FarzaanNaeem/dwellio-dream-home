import { useState } from "react";
import { ThumbsUp, ThumbsDown, MapPin, Sparkles } from "lucide-react";
import type { Listing } from "@/lib/listings";
import { cn } from "@/lib/utils";

type Props = {
  listing: Listing;
  isNew?: boolean;
};

export function ListingCard({ listing, isNew }: Props) {
  const [vote, setVote] = useState<"up" | "down" | null>(null);
  const [animKey, setAnimKey] = useState(0);

  const handleVote = (v: "up" | "down") => {
    setVote(vote === v ? null : v);
    setAnimKey((k) => k + 1);
  };

  return (
    <article
      className={cn(
        "group relative overflow-hidden rounded-2xl bg-card border border-border/60 transition-all duration-300",
        "hover:-translate-y-0.5",
        isNew && "ring-2 ring-primary/40 animate-slide-in",
      )}
      style={{ boxShadow: "var(--shadow-soft)" }}
    >
      {isNew && (
        <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
          <Sparkles className="h-3 w-3" />
          New top match
        </div>
      )}

      <div className="aspect-[4/3] overflow-hidden bg-muted">
        <img
          src={listing.image}
          alt={`Apartment in ${listing.location}`}
          loading="lazy"
          width={1024}
          height={768}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
        />
      </div>

      <div className="p-6">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="font-serif text-3xl text-foreground">
            ${listing.price.toLocaleString()}
            <span className="text-base text-muted-foreground font-sans">/mo</span>
          </h3>
          <span className="text-xs text-muted-foreground">{listing.beds}</span>
        </div>

        <div className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" />
          {listing.location}
        </div>

        <p className="mt-4 text-sm leading-relaxed text-foreground/75">
          {listing.explanation}
        </p>

        <div className="mt-6 flex items-center gap-2 border-t border-border/60 pt-4">
          <button
            onClick={() => handleVote("up")}
            aria-label="Thumbs up"
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-full border transition-all",
              vote === "up"
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background text-muted-foreground hover:border-foreground/30 hover:text-foreground",
            )}
          >
            <ThumbsUp
              key={`up-${animKey}-${vote}`}
              className={cn("h-4 w-4", vote === "up" && "animate-pop")}
            />
          </button>
          <button
            onClick={() => handleVote("down")}
            aria-label="Thumbs down"
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-full border transition-all",
              vote === "down"
                ? "border-foreground bg-foreground text-background"
                : "border-border bg-background text-muted-foreground hover:border-foreground/30 hover:text-foreground",
            )}
          >
            <ThumbsDown
              key={`down-${animKey}-${vote}`}
              className={cn("h-4 w-4", vote === "down" && "animate-pop")}
            />
          </button>
          <span className="ml-auto text-xs text-muted-foreground">
            {vote === "up" ? "Saved to favorites" : vote === "down" ? "Got it — less like this" : "Was this a good match?"}
          </span>
        </div>
      </div>
    </article>
  );
}
