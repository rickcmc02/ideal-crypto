import { getCoinInfo } from "pages/remotes";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import { Container, Grid } from "@mui/material";
import { CoinInfo } from "models/coin.model";
import { useBookmark } from "hooks/useBookmark";
import StarButton from "components/button/Star";

function CryptoPage() {
  const location = useLocation();
  const bookmark = useBookmark();

  const [coinInfo, setCoinInfo] = useState<CoinInfo | null>(null);
  const [bookmarkIdData, setBookmarkIdData] = useState<{
    [key in string]: boolean;
  }>(bookmark.get());

  useEffect(() => {
    const path = location.pathname;
    if (path) {
      const id = path.split("crypto/")[1];
      getCoinInfo(id)
        .then((res) => {
          if (res) setCoinInfo(res);
          else setCoinInfo(null);
        })
        .catch((err) => {
          console.error(err);
          setCoinInfo(null);
        });
    }
  }, []);

  const starButton = (coinId: string, bmIdData: { [key: string]: boolean }) => {
    const starOn = bmIdData[coinId];

    const toggleBookmark = (coinId: string) => {
      setBookmarkIdData({ ...bookmark.set(coinId, bmIdData) });
    };

    return <StarButton starOn={starOn} action={() => toggleBookmark(coinId)} />;
  };

  return (
    <div>
      <h1>Crypto Page</h1>
      <Container>
        {coinInfo ? (
          <div>
            <h2>
              {starButton(coinInfo.id, bookmarkIdData)}
              <img src={coinInfo.image.small} alt={coinInfo.name} />
              {coinInfo.name}
              {coinInfo.symbol && (
                <span style={{ marginLeft: 6, textTransform: "uppercase" }}>
                  ({coinInfo.symbol})
                </span>
              )}
            </h2>
            <Grid container>
              <Grid item xs={6}>
                <div>시가총액 Rank</div>
                <div>Rank #{coinInfo.market_cap_rank}</div>
                <div>웹사이트</div>
                <div>{new URL(coinInfo.links.homepage[0]).hostname}</div>
              </Grid>
              <Grid item xs={6} container>
                <div>{coinInfo.market_data.current_price["usd"]}</div>
                <Grid item xs={6}>
                  <div>시가총액</div>
                  <div>{coinInfo.market_data.market_cap["usd"]}</div>
                </Grid>
                <Grid item xs={6}>
                  <div>24시간 거래대금</div>
                  <div>
                    {
                      coinInfo.market_data.market_cap_change_24h_in_currency[
                        "usd"
                      ]
                    }
                  </div>
                </Grid>
              </Grid>
            </Grid>
            <Grid container>
              <div>가격 계산</div>
              <div>{coinInfo.name}</div>
            </Grid>
            <hr />
            <p>
              {coinInfo.description.ko
                ? coinInfo.description.ko
                : coinInfo.description.en}
            </p>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </Container>
    </div>
  );
}

export default CryptoPage;
