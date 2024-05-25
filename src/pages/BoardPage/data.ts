import { CoinMarket, RequestCoinMarkets } from "models/coin.model";

export const COIN_MARKET_CONTROLLER: {
  [key in "view_mode" | "vs_currency" | "per_page"]: {
    id: keyof RequestCoinMarkets | "view_mode";
    addedLabel?: string;
    items: { value: string | number; label: string }[];
  };
} = {
  view_mode: {
    id: "view_mode",
    items: [
      { value: "list", label: "전체보기" },
      { value: "bookmark", label: "북마크" },
    ],
  },
  vs_currency: {
    id: "vs_currency",
    addedLabel: " 보기",
    items: [
      { value: "krw", label: "KRW" },
      { value: "usd", label: "USD" },
    ],
  },
  per_page: {
    id: "per_page",
    addedLabel: "개 보기",
    items: [
      { value: 10, label: "10개 보기" },
      { value: 30, label: "30개 보기" },
      { value: 50, label: "50개 보기" },
    ],
  },
};

export const COIN_MARKET_HEADERS: { id: keyof CoinMarket; label: string }[] = [
  { id: "name", label: "자산" },
  { id: "symbol", label: "" },
  { id: "current_price", label: "Price" },
  { id: "price_change_percentage_1h_in_currency", label: "1H" },
  { id: "price_change_percentage_24h_in_currency", label: "24H" },
  { id: "price_change_percentage_7d_in_currency", label: "7D" },
  { id: "market_cap_change_24h", label: "24H Volume" },
];
