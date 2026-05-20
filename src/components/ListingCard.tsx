import { useState } from "react";
import { ThumbsUp, ThumbsDown, MapPin, Sparkles, Check, AlertCircle, Award } from "lucide-react";
import { matchLabel, type Listing } from "@/lib/listings";
import { cn } from "@/lib/utils";

type Props = {
  listing: Listing;
  sessionId: string;
  isNew?: boolean;
  isBest?: boolean;
};

export function ListingCard({ listing, sessionId, isNew, isBest }: Props) {
  const [vote, setVote] = useState<"up" | "down" | null>(null);
  const [animKey] = useState(0);

  const handleVote = async (v: "up" | "down") => {
    setVote(vote === v ? null : v);

    await fetch("http://127.0.0.1:8001/api/feedback", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        session_id: sessionId,
        listing_id: listing.id,
        action: v === "up" ? "like" : "dislike",
      }),
    });
  };

  const elevated = isNew || isBest;
  const hasStrengths = listing.strengths && listing.strengths.length > 0;
  const hasTradeoffs = listing.tradeoffs && listing.tradeoffs.length > 0;

  return (
    <article
      id={`listing-${listing.id}`}
      className={cn(
        "group relative overflow-hidden rounded-2xl bg-card border transition-all duration-500",
        "hover:-translate-y-0.5",
        elevated ? "border-primary/40" : "border-border/60",
        isNew && "ring-2 ring-primary/50 -translate-y-1 animate-slide-in",
        isBest && !isNew && "ring-1 ring-primary/30",
      )}
      style={{ boxShadow: elevated ? "var(--shadow-lift)" : "var(--shadow-soft)" }}
    >
      {isNew ? (
        <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
          <Sparkles className="h-3 w-3" />
          New top match
        </div>
      ) : isBest ? (
        <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 rounded-full bg-foreground px-3 py-1 text-xs font-medium text-background">
          <Award className="h-3 w-3" />
          Best match
        </div>
      ) : null}

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
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-serif text-3xl text-foreground">
              ${listing.price.toLocaleString()}
              <span className="text-base text-muted-foreground font-sans">/mo</span>
            </h3>
            <div className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" />
              {listing.location}
            </div>
          </div>

          <div
            className="flex shrink-0 flex-col items-end gap-0.5 rounded-full border border-border/70 bg-background/80 px-3 py-1.5 text-right"
            title={matchLabel(listing.match)}
          >
            <span className="font-serif text-sm leading-none text-foreground tabular-nums">{listing.match}%</span>
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground leading-none">
              {matchLabel(listing.match)}
            </span>
          </div>
        </div>

        <div className="mt-3 text-xs text-muted-foreground">{listing.beds}</div>

        <div className="mt-4 space-y-3">
          {hasStrengths && (
            <div>
              <div className="mb-1.5 flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-primary">
                <Check className="h-3 w-3" strokeWidth={2.5} />
                Matches
              </div>
              <ul className="space-y-1 text-sm leading-relaxed">
                {listing.strengths.map((s) => (
                  <li key={s} className="flex items-start gap-2 text-foreground/85">
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" strokeWidth={2.5} />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {hasTradeoffs && (
            <div className={cn(hasStrengths && "border-t border-border/50 pt-3")}>
              <div className="mb-1.5 flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                <AlertCircle className="h-3 w-3" strokeWidth={2.5} />
                Tradeoffs
              </div>
              <ul className="space-y-1 text-sm leading-relaxed">
                {listing.tradeoffs.map((t) => (
                  <li key={t} className="flex items-start gap-2 text-muted-foreground">
                    <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground/70" strokeWidth={2.5} />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

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
            <ThumbsUp key={`up-${animKey}-${vote}`} className={cn("h-4 w-4", vote === "up" && "animate-pop")} />
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
            <ThumbsDown key={`down-${animKey}-${vote}`} className={cn("h-4 w-4", vote === "down" && "animate-pop")} />
          </button>
          <span className="ml-auto text-xs text-muted-foreground">
            {vote === "up"
              ? "Saved to favorites"
              : vote === "down"
                ? "Got it — less like this"
                : "Was this a good match?"}
          </span>
        </div>
      </div>
    </article>
  );
}
