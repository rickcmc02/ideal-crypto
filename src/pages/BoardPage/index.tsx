import { CoinMarket, RequestCoinMarkets } from "models/coin.model";
import { useEffect, useState } from "react";

import { getCoinMarkets } from "pages/remotes";
import { COIN_MARKET_CONTROLLER, COIN_MARKET_HEADERS } from "./data";

import {
  Button,
  Container,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowUp, Star } from "@mui/icons-material";

type ViewMode = "list" | "bookmark";

const viewModeLabels: { [key in ViewMode]: string } = {
  list: "전체보기",
  bookmark: "북마크",
};

function BoardPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("list");
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
    getCoinMarketsOnCoinGecko();
  }, [coinMarketParams]);

  const getCoinMarketsOnCoinGecko = () => {
    getCoinMarkets(coinMarketParams).then((response) => {
      setCoinMarkets(response as CoinMarket[]);
    });
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

    const selectDropdown = (dropdownId: string, itemId: string | number) => {
      if (dropdownId === "view_mode") {
        setViewMode(itemId as ViewMode);
      } else {
        setCoinMarketParams({
          ...coinMarketParams,
          [dropdownId]: itemId,
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
    return (
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              {COIN_MARKET_HEADERS.map((header) => (
                <TableCell key={header.id}>{header.label}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {coinMarkets.map((coinMarket) => (
              <TableRow key={coinMarket.id}>
                <TableCell>
                  <IconButton>
                    <Star />
                  </IconButton>
                </TableCell>
                {COIN_MARKET_HEADERS.map((header) => (
                  <TableCell key={header.id}>{coinMarket[header.id]}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  return (
    <div>
      <h1>Board Page</h1>
      <Container>
        {sectionController()}
        {sectionTable()}
      </Container>
    </div>
  );
}

export default BoardPage;
