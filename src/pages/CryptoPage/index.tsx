import { getCoinInfo } from "pages/remotes";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import {
  Button,
  Container,
  Grid,
  Input,
  Table,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material";
import { CoinInfo } from "models/coin.model";
import { useBookmark } from "hooks/useBookmark";
import StarButton from "components/button/Star";
import { SwapHoriz } from "@mui/icons-material";

const color = {
  calculaterBackground: "#d0d0d0",
};

function CryptoPage() {
  const location = useLocation();
  const bookmark = useBookmark();

  const [coinInfo, setCoinInfo] = useState<CoinInfo | null>(null);
  const [fromCurrency, setFromCurrency] = useState<string | number>(1);
  const [toCurrency, setToCurrency] = useState<string | number>(1);
  const [bookmarkIdData, setBookmarkIdData] = useState<{
    [key in string]: boolean;
  }>(bookmark.get());

  useEffect(() => {
    const path = location.pathname;
    if (path) {
      const id = path.split("crypto/")[1];
      getCoinInfo(id)
        .then((res) => {
          if (res) {
            setCoinInfo(res);
            setFromCurrency(1);
            setToCurrency(res.market_data.current_price["usd"] || 1);
          } else {
            setCoinInfo(null);
          }
        })
        .catch((err) => {
          console.error(err);
          setCoinInfo(null);
        });
    }
  }, []);

  const changeFromCurrency = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    renderCurrency(value, "from");
  };

  const changeToCurrency = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    renderCurrency(value, "to");
  };

  const renderCurrency = (value: string, changed: "from" | "to") => {
    const removedCommaValue = value.replace(/,/g, "");
    const currencyValue = coinInfo?.market_data.current_price["usd"] || 1;
    if (changed === "from") {
      setFromCurrency(Number(removedCommaValue).toLocaleString());
      const exchangedValue = Number(removedCommaValue) * currencyValue;
      setToCurrency(Number(exchangedValue).toLocaleString());
    } else {
      setToCurrency(Number(removedCommaValue).toLocaleString());
      const exchangedValue = Number(removedCommaValue) / currencyValue;
      setFromCurrency(Number(exchangedValue).toLocaleString());
    }
  };

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
            <Grid container justifyContent="space-between" alignItems="center">
              <Grid display="flex" alignItems="center">
                {starButton(coinInfo.id, bookmarkIdData)}
                {coinInfo.image?.small && (
                  <img src={coinInfo.image.small} alt={coinInfo.name} />
                )}
                <h2>
                  {coinInfo.name}
                  {coinInfo.symbol && (
                    <span style={{ marginLeft: 6, textTransform: "uppercase" }}>
                      ({coinInfo.symbol})
                    </span>
                  )}
                </h2>
              </Grid>
              <Grid>USD 보기</Grid>
            </Grid>

            <Grid container mt={5}>
              <Grid item xs={6}>
                <TableContainer>
                  <Table>
                    <TableRow>
                      <TableCell variant="head">시가총액 Rank</TableCell>
                      <TableCell>Rank #{coinInfo.market_cap_rank}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell variant="head">웹사이트</TableCell>
                      <TableCell>
                        {new URL(coinInfo.links.homepage[0]).hostname}
                      </TableCell>
                    </TableRow>
                  </Table>
                </TableContainer>
              </Grid>
              <Grid item xs={6} container>
                <Grid item xs={12} display="flex" justifyContent="flex-end">
                  {coinInfo.market_data.current_price["usd"]}
                  <br />
                  {
                    coinInfo.market_data.price_change_percentage_1h_in_currency[
                      "usd"
                    ]
                  }
                </Grid>
                <Grid
                  item
                  xs={6}
                  display="flex"
                  flexDirection="column"
                  alignItems="flex-end"
                >
                  <div>시가총액</div>
                  <div>{coinInfo.market_data.market_cap["usd"]}</div>
                </Grid>
                <Grid
                  item
                  xs={6}
                  display="flex"
                  flexDirection="column"
                  alignItems="flex-end"
                >
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

            <Grid container my={5} p={1} bgcolor={color.calculaterBackground}>
              <Grid>가격 계산</Grid>
              <Grid container justifyContent="center">
                <Grid display="flex">
                  <Grid>
                    {coinInfo.name}
                    <Input
                      value={fromCurrency}
                      onInput={changeFromCurrency}
                      inputProps={{ style: { textAlign: "right" } }}
                    />
                  </Grid>
                  <SwapHoriz />
                  <Grid>
                    {"USD"}
                    <Input
                      value={toCurrency}
                      onInput={changeToCurrency}
                      inputProps={{ style: { textAlign: "right" } }}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            <Grid>
              <Grid textAlign="center">
                <Button>설명보기 ▼</Button>
              </Grid>
              <hr />
              <p>
                {coinInfo.description.ko
                  ? coinInfo.description.ko
                  : coinInfo.description.en}
              </p>
            </Grid>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </Container>
    </div>
  );
}

export default CryptoPage;
