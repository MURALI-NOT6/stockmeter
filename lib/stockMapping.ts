export const COMPANY_TICKER_MAP: Record<string, string> = {
  // Technology
  "Apple": "AAPL",
  "Microsoft": "MSFT",
  "NVIDIA": "NVDA",
  "Google": "GOOGL",
  "Oracle": "ORCL",
  "Adobe": "ADBE",

  // E-commerce
  "Amazon": "AMZN",
  "eBay": "EBAY",
  "Shopify": "SHOP",

  // Automotive
  "Tesla": "TSLA",
  "Toyota": "TM",
  "Ford": "F",
  "Ferrari": "RACE",

  // Finance
  "Visa": "V",
  "Mastercard": "MA",
  "JPMorgan": "JPM",
  "Goldman Sachs": "GS",
  "Bank of America": "BAC",

  // Healthcare
  "Johnson & Johnson": "JNJ",
  "Pfizer": "PFE",
  "UnitedHealth": "UNH",
  "Eli Lilly": "LLY",

  // Energy
  "Exxon Mobil": "XOM",
  "Chevron": "CVX",
  "Shell": "SHEL",

  // Consumer Staples
  "Walmart": "WMT",
  "Coca-Cola": "KO",
  "PepsiCo": "PEP",
  "Costco": "COST",

  // Communication & Entertainment
  "Meta": "META",
  "Netflix": "NFLX",
  "Disney": "DIS",
};

export const SECTORS = [
  "All Sectors",
  "Technology",
  "E-commerce",
  "Automotive",
  "Finance",
  "Healthcare",
  "Energy",
  "Consumer Staples",
  "Communication & Entertainment",
];

export const SECTOR_COMPANIES_MAP: Record<string, string[]> = {
  "Technology": ["Apple", "Microsoft", "NVIDIA", "Google", "Oracle", "Adobe"],
  "E-commerce": ["Amazon", "eBay", "Shopify"],
  "Automotive": ["Tesla", "Toyota", "Ford", "Ferrari"],
  "Finance": ["Visa", "Mastercard", "JPMorgan", "Goldman Sachs", "Bank of America"],
  "Healthcare": ["Johnson & Johnson", "Pfizer", "UnitedHealth", "Eli Lilly"],
  "Energy": ["Exxon Mobil", "Chevron", "Shell"],
  "Consumer Staples": ["Walmart", "Coca-Cola", "PepsiCo", "Costco"],
  "Communication & Entertainment": ["Meta", "Netflix", "Disney"],
};

export const getTicker = (name: string): string => {
  return COMPANY_TICKER_MAP[name] || "AAPL";
};

export const getCompaniesBySector = (sector: string): string[] => {
  if (sector === "All Sectors") return Object.keys(COMPANY_TICKER_MAP);
  return SECTOR_COMPANIES_MAP[sector] || [];
};
