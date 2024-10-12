export type OptionType = {
  id: string;
  name: string;
  description: string;
  type?: "Fast" | "Turbo" | "Ultra";
  computePrice?: number;
  computeLimit?: number;
};

const clusterOptions: OptionType[] = [
  {
    id: "mainnet",
    name: "Mainnet",
    description: "",
  },
  {
    id: "devnet",
    name: "Devnet",
    description: "",
  },
];

const explorerOptions: OptionType[] = [
  {
    id: "default",
    name: "Solana Explorer",
    description: "https://explorer.solana.com",
  },
  { id: "sol-scan", name: "Solscan", description: "https://solscan.io" },
];

export { clusterOptions, explorerOptions };
