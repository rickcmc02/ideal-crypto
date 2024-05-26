import {
  CoinMarket,
  CurrencyType,
  RequestCoinMarkets,
} from "models/coin.model";
import { useEffect, useState } from "react";

import { getCoinMarkets } from "pages/remotes";
import {
  COIN_MARKET_CONTROLLER,
  COIN_MARKET_HEADERS,
  CoinMarketHeader,
} from "./data";

import {
  Box,
  Button,
  Container,
  Grid,
  IconButton,
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
import { KeyboardArrowDown, KeyboardArrowUp, Star } from "@mui/icons-material";

type ViewMode = "list" | "bookmark";
const viewModes: ViewMode[] = ["list", "bookmark"];
const viewModeLabels: { [key in ViewMode]: string } = {
  list: "전체보기",
  bookmark: "북마크",
};

const currencySymbols: { [key in CurrencyType]: string } = {
  krw: "₩",
  usd: "$",
};

const color = {
  text: "#000",
  riseText: "crimson",
  fallText: "royalblue",
  tabText: "#787878",
  tableHeaderBackground: "#fafafa",
  tableHeaderText: "#808080",
  symbolText: "#404040",
  toastBackground: "#bdcce8",
  starOn: "#ebb23e",
  starOff: "#c4c4c4",
};

function BoardPage() {
  const lsBookmarkIds = localStorage.getItem("bookmarkIds");

  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [pages, setPages] = useState<number>(1);
  const [bookmarkIdData, setBookmarkIdData] = useState<{
    [key in string]: boolean;
  }>({});
  const [coinMarkets, setCoinMarkets] = useState<CoinMarket[]>([]);
  const [coinMarketParams, setCoinMarketParams] = useState<RequestCoinMarkets>({
    vs_currency: "krw",
    order: "market_cap_desc",
    per_page: 50,
    price_change_percentage: "1h,24h,7d",
  });
  const [dropdownAnchorEl, setDropdownAnchorEl] = useState<null | HTMLElement>(
    null
  );
  const dropdownOpen = Boolean(dropdownAnchorEl);

  useEffect(() => {
    if (lsBookmarkIds) {
      const idData: { [key in string]: boolean } = {};
      lsBookmarkIds.split(",").forEach((id: string) => (idData[id] = true));
      setBookmarkIdData(idData);
    }
  }, [lsBookmarkIds]);

  useEffect(() => {
    const params = {
      ...coinMarketParams,
      per_page: coinMarketParams.per_page * pages,
    };
    if (viewMode === "bookmark" && lsBookmarkIds) params.ids = lsBookmarkIds;

    getCoinMarkets(params)
      .then((response) => {
        setCoinMarkets(response as CoinMarket[]);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [coinMarketParams, pages, viewMode]);

  const handlePageChange = (page: ViewMode) => {
    setViewMode(page);
  };

  const sectionTab = () => {
    const handleTabChange = (e: React.SyntheticEvent, newValue: number) => {
      handlePageChange(viewModes[newValue] as ViewMode);
    };

    return (
      <Box sx={{ width: "100%" }}>
        <Tabs
          value={viewModes.indexOf(viewMode) || 0}
          onChange={handleTabChange}
          centered
        >
          <Tab label="가상자산 시세 목록" />
          <Tab label={`${viewModeLabels[viewModes[1]]} 목록`} />
        </Tabs>
      </Box>
    );
  };

  const sectionController = () => {
    const handleSelectListButtonClick = (
      event: React.MouseEvent<HTMLButtonElement>
    ) => {
      setDropdownAnchorEl(event.currentTarget);
    };

    const handleDropdownClose = () => {
      setDropdownAnchorEl(null);
    };

    const selectDropdown = (dropdownId: string, itemValue: string | number) => {
      if (dropdownId === "view_mode") {
        setViewMode(itemValue as ViewMode);
      } else {
        if (dropdownId === "per_page") setPages(1);
        setCoinMarketParams({
          ...coinMarketParams,
          [dropdownId]: itemValue,
        });
      }

      handleDropdownClose();
    };

    return (
      <Grid container display="flex" justifyContent="flex-end">
        {Object.values(COIN_MARKET_CONTROLLER).map((controllerItem) => {
          const conId = controllerItem.id;
          const endIcon =
            conId === dropdownAnchorEl?.id ? (
              <KeyboardArrowUp />
            ) : (
              <KeyboardArrowDown />
            );
          const buttonLabel =
            controllerItem.id === "view_mode"
              ? viewModeLabels[viewMode]
              : coinMarketParams[conId as keyof RequestCoinMarkets] +
                (controllerItem.addedLabel || "");

          return (
            <Button
              key={controllerItem.id}
              id={controllerItem.id}
              aria-label={`select-${controllerItem.id}`}
              endIcon={endIcon}
              onClick={handleSelectListButtonClick}
            >
              {buttonLabel}
            </Button>
          );
        })}
        <Menu
          anchorEl={dropdownAnchorEl}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          open={dropdownOpen}
          onClose={handleDropdownClose}
        >
          {dropdownAnchorEl &&
            COIN_MARKET_CONTROLLER[
              dropdownAnchorEl.id as keyof typeof COIN_MARKET_CONTROLLER
            ].items.map((item) => (
              <MenuItem
                key={`${dropdownAnchorEl.id}_${item.value}`}
                onClick={() => selectDropdown(dropdownAnchorEl.id, item.value)}
              >
                {item.label}
              </MenuItem>
            ))}
        </Menu>
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
        const tmpBMIdData = { ...bmIdData };
        if (tmpBMIdData[coinId]) delete tmpBMIdData[coinId];
        else tmpBMIdData[coinId] = true;
        const strBookmarkIds = Object.keys(tmpBMIdData).join(",");
        localStorage.setItem("bookmarkIds", strBookmarkIds);

        setBookmarkIdData({ ...tmpBMIdData });
      };

      return (
        <IconButton onClick={() => toggleBookmark(coinId)}>
          <Star
            sx={{
              fill: starOn ? color.starOn : color.starOff,
            }}
          />
        </IconButton>
      );
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
              <TableRow key={coinMarket.id}>
                <TableCell sx={{ p: 1 }}>
                  {starButton(coinMarket.id, bookmarkIdData)}
                </TableCell>
                {COIN_MARKET_HEADERS.map((header: CoinMarketHeader) => (
                  <BoardTableCell
                    header={header}
                    value={coinMarket[header.id]}
                    currency={coinMarketParams.vs_currency}
                  />
                ))}
              </TableRow>
            ))}
            {viewMode === "list" && (
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
    const symbol = currencySymbols[currency];
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
    <TableCell key={header.id} align={header.align || "left"} style={cellStyle}>
      {value}
    </TableCell>
  );
};

export default BoardPage;
