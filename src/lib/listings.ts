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
  explanation: string;
};

export const initialListings: Listing[] = [
  {
    id: "l2",
    image: img2,
    price: 2800,
    location: "Hoboken, NJ",
    beds: "1 bed · 1 bath",
    explanation: "Great commute and within budget, slightly quieter area.",
  },
  {
    id: "l1",
    image: img1,
    price: 3150,
    location: "Williamsburg, Brooklyn",
    beds: "Loft · 1 bath",
    explanation: "Loft layout with the natural light you mentioned wanting.",
  },
  {
    id: "l3",
    image: img3,
    price: 2650,
    location: "Upper West Side, NY",
    beds: "Studio · 1 bath",
    explanation: "Quiet street near the park — fits your calm-neighborhood note.",
  },
  {
    id: "l4",
    image: img4,
    price: 2400,
    location: "Jersey City, NJ",
    beds: "1 bed · 1 bath",
    explanation: "Best value in budget with strong PATH access to Manhattan.",
  },
];

export const surpriseListing: Listing = {
  id: "l5",
  image: img5,
  price: 2950,
  location: "Long Island City, NY",
  beds: "1 bed · 1 bath · skyline view",
  explanation: "Just listed — better light and a skyline view at your price ceiling.",
};
