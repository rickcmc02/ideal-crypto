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
  Menu,
  MenuItem,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
} from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import StarButton from "components/button/Star";
import { useBookmark } from "hooks/useBookmark";
import { COIN_MARKET_CONTROLLER, CURRENCY_SYMBOL } from "models/coin.data";
import DropdownButton from "components/button/Dropdown";

const color = {
  text: "#000",
  riseText: "crimson",
  fallText: "royalblue",
  tabText: "#787878",
  tableHeaderBackground: "#fafafa",
  tableHeaderText: "#808080",
  symbolText: "#404040",
};

function BoardPage() {
  const navigate = useNavigate();
  const bookmark = useBookmark();
  let [searchParams, setUseSearchParams] = useSearchParams();

  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [pages, setPages] = useState<number>(1);
  const [bookmarkIdData, setBookmarkIdData] = useState<{
    [key in string]: boolean;
  }>(bookmark.get());
  const [coinMarkets, setCoinMarkets] = useState<CoinMarket[]>([]);
  const [coinMarketParams, setCoinMarketParams] = useState<RequestCoinMarkets>({
    vs_currency: "krw",
    order: "market_cap_desc",
    per_page: 50,
    price_change_percentage: "1h,24h,7d",
  });

  useEffect(() => {
    const viewParam = searchParams.get("view") as ViewMode;
    if (viewParam && VIEW_MODES.includes(viewParam)) setViewMode(viewParam);
  }, [searchParams]);

  useEffect(() => {
    const params = {
      ...coinMarketParams,
      per_page: coinMarketParams.per_page * pages,
    };
    const lsBookmarkIds = localStorage.getItem("bookmarkIds");
    if (viewMode === "bookmark" && lsBookmarkIds) params.ids = lsBookmarkIds;

    getCoinMarkets(params)
      .then((res) => {
        if (res) setCoinMarkets(res as CoinMarket[]);
        else setCoinMarkets([]);
      })
      .catch((err) => {
        console.error(err);
        setCoinMarkets([]);
      });
  }, [coinMarketParams, pages, viewMode]);

  const handlePageChange = (page: ViewMode) => {
    searchParams.set("view", page);
    setUseSearchParams(searchParams);
  };

  const sectionTab = () => {
    const handleTabChange = (e: React.SyntheticEvent, newValue: number) => {
      handlePageChange(VIEW_MODES[newValue] as ViewMode);
    };

    return (
      <Box sx={{ width: "100%" }}>
        <Tabs
          value={VIEW_MODES.indexOf(viewMode) || 0}
          onChange={handleTabChange}
          centered
        >
          <Tab label="가상자산 시세 목록" />
          <Tab label={`${VIEW_MODE_LABELS[VIEW_MODES[1]]} 목록`} />
        </Tabs>
      </Box>
    );
  };

  const sectionController = () => {
    return (
      <Grid container display="flex" justifyContent="flex-end">
        {Object.values(COIN_MARKET_CONTROLLER).map((controllerItem) => {
          const conId = controllerItem.id;
          const selectDropdown = (value: string | number) => {
            if (conId === "view_mode") {
              handlePageChange(value as ViewMode);
            } else {
              if (conId === "per_page") setPages(1);
              setCoinMarketParams({
                ...coinMarketParams,
                [conId]: value,
              });
            }
          };

          return (
            <DropdownButton
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
  };

  const sectionTable = () => {
    const viewMoreCoins = () => {
      setPages(pages + 1);
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
        <Table>
          <TableHead>
            <TableRow style={{ backgroundColor: color.tableHeaderBackground }}>
              <TableCell sx={{ p: 1 }}></TableCell>
              {COIN_MARKET_HEADERS.map((header) => (
                <TableCell
                  key={header.id}
                  align={header.align || "left"}
                  style={{
                    fontWeight: 500,
                    color: color.tableHeaderText,
                  }}
                >
                  {header.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {coinMarkets.map((coinMarket) => (
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
            ))}
            {viewMode === "list" && coinMarkets.length > 0 && (
              <TableRow>
                <TableCell
                  colSpan={COIN_MARKET_HEADERS.length + 1}
                  align="center"
                >
                  <Button
                    sx={{ color: color.text, fontWeight: 600 }}
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
        {sectionTab()}
        {sectionController()}
        {sectionTable()}
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
  let valueColor = color.text;
  let valueFontSize = "1rem";
  if (header.id === "symbol") {
    valueColor = color.symbolText;
    valueFontSize = "0.8rem";
  }
  if (header.isCurrency) {
    const symbol = CURRENCY_SYMBOL[currency];
    const twoDecimal = Math.floor((value as number) * 100) / 100;
    value = symbol + twoDecimal.toLocaleString();
  }
  if (header.isPercentage) {
    const oneDecimal = Math.floor((value as number) * 10) / 10;
    if (oneDecimal > 0) valueColor = color.riseText;
    if (oneDecimal < 0) valueColor = color.fallText;
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
