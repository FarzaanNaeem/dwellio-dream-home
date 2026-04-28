import { useState, type FormEvent } from "react";
import { ArrowRight, Mic } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  onSubmit: (query: string) => void;
  initialValue?: string;
  compact?: boolean;
};

const suggestions = [
  "Sunny 1-bed under $3000 near a park",
  "Quiet studio with good commute to midtown",
  "Loft with natural light in Brooklyn",
];

export function SearchInput({ onSubmit, initialValue = "", compact = false }: Props) {
  const [value, setValue] = useState(initialValue);
  const [listening, setListening] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (value.trim()) onSubmit(value.trim());
  };

  return (
    <div className="w-full">
      <form
        onSubmit={handleSubmit}
        className={cn(
          "group relative flex items-center gap-2 rounded-2xl border border-border bg-card transition-all",
          "focus-within:border-foreground/30 focus-within:shadow-[var(--shadow-lift)]",
          compact ? "px-4 py-3" : "px-6 py-5",
        )}
        style={{ boxShadow: "var(--shadow-soft)" }}
      >
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Describe your ideal home..."
          className={cn(
            "flex-1 bg-transparent text-foreground placeholder:text-muted-foreground/70 outline-none",
            compact ? "text-base" : "text-lg md:text-xl",
          )}
        />

        <button
          type="button"
          onClick={() => setListening((l) => !l)}
          aria-label="Voice input"
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors",
            "hover:border-foreground/30 hover:text-foreground",
            listening && "border-primary text-primary bg-accent",
          )}
        >
          <Mic className="h-4 w-4" />
        </button>

        <button
          type="submit"
          aria-label="Search"
          disabled={!value.trim()}
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-foreground text-background transition-all",
            "hover:bg-foreground/85 disabled:opacity-30 disabled:cursor-not-allowed",
          )}
        >
          <ArrowRight className="h-4 w-4" />
        </button>
      </form>

      {!compact && (
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {suggestions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => {
                setValue(s);
                onSubmit(s);
              }}
              className="rounded-full border border-border bg-card/60 px-4 py-1.5 text-xs text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
