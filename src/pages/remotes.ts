import { RequestCoinMarkets } from "models/coin.model";
import { http } from "utils/http";

export function getCoinMarkets(params: RequestCoinMarkets) {
  return http.get("https://api.coingecko.com/api/v3/coins/markets", {
    params: params,
  });
}
