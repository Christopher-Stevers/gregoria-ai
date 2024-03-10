export type TeamPlan = {
  name: string;
  description: string;
  price?: number;
  hasPrice: boolean;
  feature: string[];
};

export const TeamPlans = [
  {
    name: "Free",
    description: "Manage your personal marketing goals",
    feature: ["1 user", "1 projects", "No Credit card required"],
    price: 0,
    hasPrice: true,
  },
  {
    name: "Starter",
    description: `Streamline your team{"'"}s workflow`,
    feature: ["15 users", "Unlimited projects"],
    price: 99,
    hasPrice: true,
  },
  {
    name: "Pro",
    description: "Bring your agency to the next level.",
    feature: ["100 users", "Unlimited projects", "24hr support"],
    price: 499,
    hasPrice: true,
  },
];
