export type CurrencyType = "krw" | "usd";

export interface RequestCoinMarkets {
  vs_currency: CurrencyType;
  ids?: string;
  category?: string;
  order?: string;
  per_page: number;
  page?: number;
  sparkline?: boolean;
  price_change_percentage?: string;
  locale?: string;
  precison?: string;
}

export interface CoinMarket {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  price_change_percentage_1h_in_currency?: number;
  price_change_percentage_24h_in_currency?: number;
  price_change_percentage_7d_in_currency?: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  roi: any;
  last_updated: string;
}

export interface CoinInfo {
  id: string;
  symbol: string;
  name: string;
  asset_platform_id: string;
  platforms: any;
  block_time_in_minutes: number;
  hashing_algorithm: string;
  categories: string[];
  public_notice: string;
  additional_notices: string[];
  description: {
    en: string;
    ko: string;
  };
  links: {
    homepage: string[];
    blockchain_site: string[];
    official_forum_url: string[];
    chat_url: string[];
    announcement_url: string[];
    twitter_screen_name: string;
    facebook_username: string;
    bitcointalk_thread_identifier: number;
    telegram_channel_identifier: string;
    subreddit_url: string;
    repos_url: {
      github: string[];
      bitbucket: string[];
    };
  };
  image: {
    thumb: string;
    small: string;
    large: string;
  };
  country_origin: string;
  genesis_date: string;
  sentiment_votes_up_percentage: number;
  sentiment_votes_down_percentage: number;
  market_cap_rank: number;
  market_data: {
    current_price: {
      [key: string]: number;
    };
    total_value_locked: {
      [key: string]: number;
    };
    mcap_to_tvl_ratio: number;
    fdv_to_tvl_ratio: number;
    roi: {
      times: number;
      currency: string;
      percentage: number;
    };
    ath: {
      [key: string]: number;
    };
    ath_change_percentage: {
      [key: string]: number;
    };
    ath_date: {
      [key: string]: string;
    };
    atl: {
      [key: string]: number;
    };
    atl_change_percentage: {
      [key: string]: number;
    };
    atl_date: {
      [key: string]: string;
    };
    market_cap: {
      [key: string]: number;
    };
    market_cap_rank: number;
    fully_diluted_valuation: {
      [key: string]: number;
    };
    total_volume: {
      [key: string]: number;
    };
    high_24h: {
      [key: string]: number;
    };
    low_24h: {
      [key: string]: number;
    };
    price_change_24h: number;
    price_change_percentage_24h: number;
    price_change_percentage_1h_in_currency: {
      [key: string]: number;
    };
    price_change_percentage_24h_in_currency: {
      [key: string]: number;
    };
    price_change_percentage_7d_in_currency: {
      [key: string]: number;
    };
    market_cap_change_24h: number;
    market_cap_change_percentage_24h: number;
    market_cap_change_24h_in_currency: {
      [key: string]: number;
    };
    circulating_supply: number;
    total_supply: number;
    max_supply: number;
    last_updated: string;
  };
  coingecko_rank: number;
  coingecko_score: number;
  developer_score: number;
  community_score: number;
  liquidity_score: number;
  public_interest_score: number;
  public_interest_stats: {
    alexa_rank: number;
    bing_matches: null;
  };
  status_updates: any[];
  last_updated: string;
  tickers: any[];
}
