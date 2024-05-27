import { getCoinInfo } from "pages/remotes";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import {
  Button,
  Container,
  Collapse,
  Divider,
  Grid,
  Input,
  Table,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
  TableBody,
} from "@mui/material";
import { CoinInfo, CurrencyType } from "models/coin.model";
import { useBookmark } from "hooks/useBookmark";
import StarButton from "components/button/Star";
import { SwapHoriz } from "@mui/icons-material";
import { COIN_MARKET_CONTROLLER, CURRENCY_SYMBOL } from "models/coin.data";
import DropdownButton from "components/button/Dropdown";
import { PALETTE } from "style/palette";

function CryptoPage() {
  const location = useLocation();
  const bookmark = useBookmark();

  const [coinInfo, setCoinInfo] = useState<CoinInfo | null>(null);
  const [fromCurrency, setFromCurrency] = useState<string | number>(1);
  const [toCurrency, setToCurrency] = useState<string | number>(1);
  const [currency, setCurrency] = useState<CurrencyType>("krw");
  const [bookmarkIdData, setBookmarkIdData] = useState<{
    [key in string]: boolean;
  }>(bookmark.get());
  const [descriptionOpen, setDescriptionOpen] = useState<boolean>(false);

  useEffect(() => {
    const path = location.pathname;
    if (path) {
      const id = path.split("crypto/")[1];
      getCoinInfo(id)
        .then((res) => {
          if (res) {
            setCoinInfo(res);
            setFromCurrency(1);
            setToCurrency(res.market_data.current_price[currency] || 1);
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

  const blockNotNum = (e: React.KeyboardEvent) => {
    const key = e.key;
    const isNum = new RegExp("^[0-9.]+$");
    const permittedKeys = [
      "Backspace",
      "Control",
      "Meta",
      "c",
      "v",
      "ArrowUp",
      "ArrowDown",
      "ArrowLeft",
      "ArrowRight",
    ];
    if (permittedKeys.includes(key)) return;
    if (!isNum.test(key)) {
      e.preventDefault();
    }
  };
  const changeFromCurrency = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    renderCurrency(value, "from");
  };

  const changeToCurrency = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    renderCurrency(value, "to");
  };

  const renderCurrency = (value: string, changed: "from" | "to") => {
    let renderedValue = value.replace(
      /[A-Za-z가-힣!@#\$%\^&\*\(\)\-_=+\[\]{};:'"\\|,<>\/?]/g, // 온점을 제외한 모든 문자 제거
      ""
    );
    const dotRegex = new RegExp(/\./g); // 소수점 개수 체크
    if (
      renderedValue === "" ||
      renderedValue === "." ||
      (value.match(dotRegex) && value.match(dotRegex)!.length > 1)
    ) {
      renderedValue = "0";
    }
    const eightDigitAfterDot = new RegExp(/\.\d{8,}/); // 소수점 아래 8자리 이상 제거
    const sliceMoreThanEightAfterDot = (v: string): string => {
      if (eightDigitAfterDot.test(v))
        return v.slice(0, v.indexOf(".") + 9) || "";
      else return v;
    };
    renderedValue = sliceMoreThanEightAfterDot(renderedValue);

    const currencyValue = coinInfo?.market_data.current_price[currency] || 1;
    if (changed === "from") {
      setFromCurrency(renderedValue.toLocaleString());
      const exchangedValue = sliceMoreThanEightAfterDot(
        Number(renderedValue) * currencyValue + ""
      );
      setToCurrency(exchangedValue.toLocaleString());
    } else {
      setToCurrency(renderedValue.toLocaleString());
      const exchangedValue = sliceMoreThanEightAfterDot(
        Number(renderedValue) / currencyValue + ""
      );
      setFromCurrency(exchangedValue.toLocaleString());
    }
  };

  const starButton = (coinId: string, bmIdData: { [key: string]: boolean }) => {
    const starOn = bmIdData[coinId];

    const toggleBookmark = (coinId: string) => {
      setBookmarkIdData({ ...bookmark.set(coinId, bmIdData) });
    };

    return <StarButton starOn={starOn} action={() => toggleBookmark(coinId)} />;
  };

  const selectCurrency = () => {
    const controllerItem = COIN_MARKET_CONTROLLER["vs_currency"];

    const buttonLabel = currency + (controllerItem.addedLabel || "");
    const selectDropdown = (value: string | number) => {
      setCurrency(value as CurrencyType);
    };

    return (
      <DropdownButton
        item={controllerItem}
        label={buttonLabel}
        selectFunc={selectDropdown}
      />
    );
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
                  <img
                    src={coinInfo.image.small}
                    alt={coinInfo.name}
                    style={{ width: "32px", height: "fit-content" }}
                  />
                )}
                <Typography
                  variant="h1"
                  ml={1.25}
                  fontSize="1.6rem"
                  fontWeight={700}
                  lineHeight={1}
                >
                  {coinInfo.name}
                  {coinInfo.symbol && (
                    <span style={{ marginLeft: 6, textTransform: "uppercase" }}>
                      ({coinInfo.symbol})
                    </span>
                  )}
                </Typography>
              </Grid>
              <Grid>{selectCurrency()}</Grid>
            </Grid>

            <Grid container mt={5} columnSpacing={2}>
              <Grid item xs={6}>
                <HorizontalTable
                  contents={[
                    {
                      head: "시가총액 Rank",
                      body: `Rank #${coinInfo.market_cap_rank}`,
                    },
                    {
                      head: "웹사이트",
                      body: new URL(coinInfo.links.homepage[0]).hostname,
                    },
                  ]}
                />
              </Grid>
              <Grid item xs={6} container>
                <Grid item xs={12} mb={3}>
                  <Grid
                    display="flex"
                    justifyContent="flex-end"
                    alignItems="flex-end"
                  >
                    <Typography
                      variant="h5"
                      fontWeight={700}
                      lineHeight={1}
                      mr={2}
                    >
                      {CURRENCY_SYMBOL[currency]}
                      {coinInfo.market_data.current_price[currency]}
                    </Typography>
                    {
                      coinInfo.market_data
                        .price_change_percentage_1h_in_currency[currency]
                    }
                  </Grid>
                  <Grid
                    display="flex"
                    justifyContent="flex-end"
                    alignItems="flex-end"
                  >
                    <Typography variant="body2" color="gray" mr={2}>
                      {(1).toFixed(8)} {coinInfo.symbol}
                    </Typography>
                    {
                      coinInfo.market_data
                        .price_change_percentage_1h_in_currency["usd"]
                    }
                  </Grid>
                </Grid>
                <SubCoinInfo
                  contents={[
                    {
                      head: "시가총액",
                      body: `${
                        CURRENCY_SYMBOL[currency]
                      }${coinInfo.market_data.market_cap[
                        currency
                      ].toLocaleString()}`,
                    },
                    {
                      head: "24시간 거래대금",
                      body: `${
                        CURRENCY_SYMBOL[currency]
                      }${coinInfo.market_data.total_volume[
                        currency
                      ].toLocaleString()}`,
                    },
                  ]}
                />
              </Grid>
            </Grid>

            <Grid
              container
              my={5}
              p={1.5}
              bgcolor={PALETTE.calculaterBackground}
            >
              <Typography variant="body1" fontSize="0.8rem" fontWeight={600}>
                가격 계산
              </Typography>
              <Grid container my={2} justifyContent="center">
                <Grid display="flex" alignItems="center">
                  <HorizontalTable
                    contents={[
                      {
                        head: coinInfo.symbol.toLocaleUpperCase(),
                        body: (
                          <Input
                            value={fromCurrency}
                            onKeyDown={blockNotNum}
                            onInput={changeFromCurrency}
                            inputProps={{
                              style: {
                                textAlign: "right",
                              },
                            }}
                          />
                        ),
                      },
                    ]}
                    isExchange={true}
                  />
                  <SwapHoriz fontSize="large" sx={{ mx: 2 }} />
                  <HorizontalTable
                    contents={[
                      {
                        head: currency.toLocaleUpperCase(),
                        body: (
                          <Input
                            value={toCurrency}
                            onKeyDown={blockNotNum}
                            onInput={changeToCurrency}
                            inputProps={{ style: { textAlign: "right" } }}
                          />
                        ),
                      },
                    ]}
                    isExchange={true}
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid>
              <Grid textAlign="center">
                <Button
                  sx={{ color: PALETTE.text }}
                  onClick={() => setDescriptionOpen(!descriptionOpen)}
                >
                  설명보기 {descriptionOpen ? "▲" : "▼"}
                </Button>
              </Grid>
              <Divider sx={{ color: PALETTE.borderColor }} />
              <Collapse in={descriptionOpen}>
                <Typography
                  variant="body2"
                  fontSize="0.75rem"
                  textAlign="left"
                  whiteSpace={"pre-wrap"}
                  py={2}
                >
                  {coinInfo.description.ko
                    ? coinInfo.description.ko
                    : coinInfo.description.en}
                </Typography>
              </Collapse>
            </Grid>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </Container>
    </div>
  );
}

const SubCoinInfo = ({
  contents,
}: {
  contents: {
    head: string;
    body: string;
  }[];
}) => {
  return (
    <>
      {contents.map((content, idx) => (
        <Grid
          item
          xs={6}
          key={idx}
          display="flex"
          flexDirection="column"
          alignItems="flex-end"
          fontSize="0.75rem"
          fontWeight={500}
        >
          <div>{content.head}</div>
          <div>{content.body}</div>
        </Grid>
      ))}
    </>
  );
};

const HorizontalTable = ({
  contents,
  isExchange,
}: {
  contents: {
    head: string;
    body: string | React.ReactNode;
  }[];
  isExchange?: boolean;
}) => {
  return (
    <TableContainer>
      <Table sx={{ border: "1px solid " + PALETTE.borderColor }}>
        <TableBody>
          {contents.map((content, idx) => (
            <TableRow key={idx}>
              <TableCell
                variant="head"
                sx={{
                  py: isExchange ? 1 : 2,
                  background: PALETTE.tableHeadColor,
                  borderRight: isExchange
                    ? "2px solid " + PALETTE.borderColor
                    : "none",
                }}
              >
                <Typography
                  variant="body1"
                  fontSize={isExchange ? "1rem" : "0.9rem"}
                  fontWeight={600}
                >
                  {content.head}
                </Typography>
              </TableCell>
              <TableCell sx={{ py: 1, background: "white" }}>
                {content.body}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CryptoPage;
