import {
  CoinMarket,
  CurrencyType,
  RequestCoinMarkets,
} from "models/coin.model";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { getCoinMarkets } from "pages/remotes";
import {
  COIN_MARKET_HEADERS,
  CoinMarketHeader,
  VIEW_MODES,
  VIEW_MODE_LABELS,
  ViewMode,
} from "./data";

import {
  Box,
  Button,
  Container,
  Grid,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import StarButton from "components/button/Star";
import { useBookmark } from "hooks/useBookmark";
import { COIN_MARKET_CONTROLLER, CURRENCY_SYMBOL } from "models/coin.data";
import DropdownButton from "components/button/Dropdown";
import { PALETTE } from "style/palette";

function BoardPage() {
  const navigate = useNavigate();
  const bookmark = useBookmark();
  const lsBookmarkIds = localStorage.getItem("bookmarkIds");

  let [searchParams, setUseSearchParams] = useSearchParams();

  const [isError, setIsError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [bookmarkIdData, setBookmarkIdData] = useState<{
    [key in string]: boolean;
  }>(bookmark.get());
  const [coinMarkets, setCoinMarkets] = useState<CoinMarket[]>([]);
  const [coinMarketParams, setCoinMarketParams] = useState<RequestCoinMarkets>({
    vs_currency: "krw",
    order: "market_cap_desc",
    per_page: 50,
    page: 1,
    price_change_percentage: "1h,24h,7d",
    isInit: true,
  });

  useEffect(() => {
    const viewParam = searchParams.get("view") as ViewMode;
    if (viewParam && VIEW_MODES.includes(viewParam)) setViewMode(viewParam);
    else setViewMode("list");
  }, [searchParams]);

  useEffect(() => {
    const tmpCMParmas = { ...coinMarketParams };
    if (viewMode === "bookmark") {
      if (lsBookmarkIds) {
        tmpCMParmas.ids = lsBookmarkIds;
      } else {
        if (coinMarkets.length > 0) setCoinMarkets([]);
        return;
      }
    } else {
      delete tmpCMParmas.ids;
    }
    delete tmpCMParmas.isInit;
    setCoinMarketParams(tmpCMParmas);
  }, [viewMode]);

  useEffect(() => {
    getCoinMarketsOnCoinGecko();
  }, [coinMarketParams]);

  const getCoinMarketsOnCoinGecko = () => {
    if (coinMarketParams.isInit) return;
    if (viewMode === "bookmark") {
      if (!(lsBookmarkIds && coinMarketParams.ids)) return setCoinMarkets([]);
    }
    const params = {
      ...coinMarketParams,
      per_page: coinMarketParams.per_page * (coinMarketParams.page || 1),
      page: 1, // per_page를 늘리고, CoinGecko API에서 1페이지만 요청 (전체 코인 목록을 새로고침하기 위함)
    };

    setIsError(false);
    setIsLoading(true);
    getCoinMarkets(params)
      .then((res) => {
        setIsLoading(false);
        if (res) setCoinMarkets(res as CoinMarket[]);
        else setCoinMarkets([]);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
        if (err.code === "ERR_NETWORK") setIsError(true);
        setCoinMarkets([]);
      });
  };

  const handlePageChange = (page: ViewMode) => {
    searchParams.set("view", page);
    setUseSearchParams(searchParams);
  };

  const commonSx = {
    width: "50%",
    py: 1.25,
    borderRadius: "4px",
    fontSize: "1rem",
    fontWeight: 700,
  };
  const activeSx = {
    ...commonSx,
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
    bgcolor: "white",
    color: PALETTE.text,
  };
  const inactiveSx = {
    ...commonSx,
    bgcolor: PALETTE.tabBackground,
    color: PALETTE.tabText,
  };
  const sectionTab = (
    <Box sx={{ width: "100%" }}>
      <Button
        sx={viewMode === "list" ? activeSx : inactiveSx}
        onClick={() => handlePageChange("list")}
      >
        가상자산 시세 목록
      </Button>
      <Button
        sx={viewMode === "bookmark" ? activeSx : inactiveSx}
        onClick={() => handlePageChange("bookmark")}
      >
        {VIEW_MODE_LABELS[VIEW_MODES[1]]} 목록
      </Button>
    </Box>
  );

  const sectionController = (
    <Grid container display="flex" justifyContent="flex-end">
      {Object.values(COIN_MARKET_CONTROLLER).map((controllerItem) => {
        const conId = controllerItem.id;
        const selectDropdown = (value: string | number) => {
          if (conId === "view_mode") {
            handlePageChange(value as ViewMode);
          } else {
            setCoinMarketParams({
              ...coinMarketParams,
              [conId]: value,
              page: conId === "per_page" ? 1 : coinMarketParams.page,
            });
          }
        };

        return (
          <DropdownButton
            key={conId}
            item={controllerItem}
            selectFunc={selectDropdown}
            label={
              conId === "view_mode"
                ? VIEW_MODE_LABELS[viewMode]
                : coinMarketParams[conId as keyof RequestCoinMarkets] +
                  (controllerItem.addedLabel || "")
            }
          />
        );
      })}
    </Grid>
  );

  const sectionTable = () => {
    const viewMoreCoins = () => {
      setCoinMarketParams({
        ...coinMarketParams,
        page: coinMarketParams.page ? coinMarketParams.page + 1 : 2,
      });
    };

    const starButton = (
      coinId: string,
      bmIdData: { [key: string]: boolean }
    ) => {
      const starOn = bmIdData[coinId];

      const toggleBookmark = (coinId: string) => {
        setBookmarkIdData({ ...bookmark.set(coinId, bmIdData) });
      };

      return (
        <StarButton starOn={starOn} action={() => toggleBookmark(coinId)} />
      );
    };

    const moveDetailPage = (coinId: string) => {
      navigate(`/crypto/${coinId}`);
    };

    return (
      <TableContainer>
        {isLoading && <LinearProgress sx={{ mb: -0.5 }} />}
        <Table>
          <TableHead>
            <TableRow
              style={{ backgroundColor: PALETTE.tableHeaderBackground }}
            >
              <TableCell sx={{ p: 1 }}></TableCell>
              {COIN_MARKET_HEADERS.map((header) => (
                <TableCell
                  key={header.id}
                  align={header.align || "left"}
                  sx={{
                    py: 1,
                    fontWeight: 600,
                    color: PALETTE.tableHeaderText,
                  }}
                >
                  {header.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {isError ? (
              <TableRow>
                <TableCell
                  colSpan={COIN_MARKET_HEADERS.length + 1}
                  sx={{ textAlign: "center", fontWeight: 600 }}
                >
                  요청 중 오류가 발생하였습니다. 잠시 후 다시 시도해주세요.
                </TableCell>
              </TableRow>
            ) : coinMarkets.length > 0 ? (
              coinMarkets.map((coinMarket) => (
                <TableRow
                  key={coinMarket.id}
                  onClick={() => moveDetailPage(coinMarket.id)}
                >
                  <TableCell sx={{ p: 1 }}>
                    {starButton(coinMarket.id, bookmarkIdData)}
                  </TableCell>
                  {COIN_MARKET_HEADERS.map((header: CoinMarketHeader) => (
                    <BoardTableCell
                      key={header.id}
                      header={header}
                      value={coinMarket[header.id]}
                      currency={coinMarketParams.vs_currency}
                    />
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={COIN_MARKET_HEADERS.length + 1}
                  sx={{ textAlign: "center", fontWeight: 600 }}
                >
                  {viewMode === "bookmark" && "북마크 "}데이터가 없습니다.
                </TableCell>
              </TableRow>
            )}

            {viewMode === "list" && coinMarkets.length > 0 && (
              <TableRow>
                <TableCell
                  colSpan={COIN_MARKET_HEADERS.length + 1}
                  align="center"
                  sx={{ p: 1 }}
                >
                  <Button
                    sx={{ color: PALETTE.text, fontWeight: 600 }}
                    onClick={viewMoreCoins}
                  >
                    + 더보기
                  </Button>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  return (
    <div>
      <h1>Board Page</h1>
      <Container>
        <Grid container rowGap={2} py={5}>
          {sectionTab}
          <Grid container height={32}>
            {viewMode === "list" && sectionController}
          </Grid>
          {sectionTable()}
        </Grid>
      </Container>
    </div>
  );
}

interface BoardTableCellProps {
  header: CoinMarketHeader;
  value: string | number;
  currency: CurrencyType;
}

const BoardTableCell = ({ header, value, currency }: BoardTableCellProps) => {
  let valueColor = PALETTE.text;
  let valueFontSize = "1rem";
  if (header.id === "symbol") {
    valueColor = PALETTE.symbolText;
    valueFontSize = "0.8rem";
  }
  if (header.isCurrency) {
    const symbol = CURRENCY_SYMBOL[currency];
    const twoDecimal = Math.floor((value as number) * 100) / 100;
    value = symbol + twoDecimal.toLocaleString();
  }
  if (header.isPercentage) {
    const oneDecimal = Math.floor((value as number) * 10) / 10;
    if (oneDecimal > 0) valueColor = PALETTE.riseText;
    if (oneDecimal < 0) valueColor = PALETTE.fallText;
    value = oneDecimal + "%";
  }

  const cellStyle: { [key: string]: string } = {
    color: valueColor,
    fontSize: valueFontSize,
    fontWeight: "bold",
    textTransform: header.isUpperCase ? "uppercase" : "none",
  };

  return (
    <TableCell align={header.align || "left"} style={cellStyle}>
      {value}
    </TableCell>
  );
};

export default BoardPage;
