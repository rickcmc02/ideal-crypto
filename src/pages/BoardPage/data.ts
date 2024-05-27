import { CoinMarket } from "models/coin.model";

export type ViewMode = "list" | "bookmark";
export const VIEW_MODES: ViewMode[] = ["list", "bookmark"];
export const VIEW_MODE_LABELS: { [key in ViewMode]: string } = {
  list: "전체보기",
  bookmark: "북마크",
};

export interface CoinMarketHeader {
  id: keyof CoinMarket;
  label: string;
  align?: "left" | "right";
  isUpperCase?: boolean;
  isCurrency?: boolean;
  isPercentage?: boolean;
}

export const COIN_MARKET_HEADERS: CoinMarketHeader[] = [
  { id: "name", label: "자산" },
  { id: "symbol", label: "", isUpperCase: true },
  { id: "current_price", label: "Price", align: "right", isCurrency: true },
  {
    id: "price_change_percentage_1h_in_currency",
    label: "1H",
    align: "right",
    isPercentage: true,
  },
  {
    id: "price_change_percentage_24h_in_currency",
    label: "24H",
    align: "right",
    isPercentage: true,
  },
  {
    id: "price_change_percentage_7d_in_currency",
    label: "7D",
    align: "right",
    isPercentage: true,
  },
  {
    id: "market_cap_change_24h",
    label: "24H Volume",
    align: "right",
    isCurrency: true,
  },
];
