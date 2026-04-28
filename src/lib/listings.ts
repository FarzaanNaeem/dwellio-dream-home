import img1 from "@/assets/listing-1.jpg";
import img2 from "@/assets/listing-2.jpg";
import img3 from "@/assets/listing-3.jpg";
import img4 from "@/assets/listing-4.jpg";
import img5 from "@/assets/listing-5.jpg";

export type Listing = {
  id: string;
  image: string;
  price: number;
  location: string;
  beds: string;
  strengths: string[];
  tradeoffs: string[];
  match: number; // 0–100
};

export const initialListings: Listing[] = [
  {
    id: "l2",
    image: img2,
    price: 2800,
    location: "Hoboken, NJ",
    beds: "1 bed · 1 bath",
    strengths: ["Within budget with room to spare", "Strong PATH commute to midtown"],
    tradeoffs: ["Slightly farther from a park than ideal"],
    match: 92,
  },
  {
    id: "l1",
    image: img1,
    price: 3150,
    location: "Williamsburg, Brooklyn",
    beds: "Loft · 1 bath",
    strengths: ["Loft layout with abundant natural light", "Lively, walkable neighborhood"],
    tradeoffs: ["$150 over your soft budget", "Busier street than you described"],
    match: 88,
  },
  {
    id: "l3",
    image: img3,
    price: 2650,
    location: "Upper West Side, NY",
    beds: "Studio · 1 bath",
    strengths: ["Quiet block one minute from the park", "Comfortably under budget"],
    tradeoffs: ["Smaller footprint as a studio"],
    match: 84,
  },
  {
    id: "l4",
    image: img4,
    price: 2400,
    location: "Jersey City, NJ",
    beds: "1 bed · 1 bath",
    strengths: ["Best value in your range", "Solid PATH access to Manhattan"],
    tradeoffs: ["Limited natural light in main room", "Few parks within walking distance"],
    match: 76,
  },
];

export const surpriseListing: Listing = {
  id: "l5",
  image: img5,
  price: 2950,
  location: "Long Island City, NY",
  beds: "1 bed · 1 bath · skyline view",
  strengths: ["Floor-to-ceiling light and skyline view", "At your price ceiling, not over"],
  tradeoffs: ["Park access is a short walk, not next door"],
  match: 96,
};

export function matchLabel(score: number): string {
  if (score >= 90) return "Excellent fit";
  if (score >= 80) return "Strong match";
  if (score >= 70) return "Good match";
  return "Fair match";
}
