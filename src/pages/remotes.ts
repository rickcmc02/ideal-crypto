import { CoinInfo, CoinMarket, RequestCoinMarkets } from "models/coin.model";
import { http } from "utils/http";

export function getCoinMarkets(params: RequestCoinMarkets) {
  return http.get<CoinMarket[]>(
    "https://api.coingecko.com/api/v3/coins/markets",
    {
      params: params,
    }
  );
}

export function getCoinInfo(id: string) {
  return http.get<CoinInfo>(`https://api.coingecko.com/api/v3/coins/${id}`);
}
