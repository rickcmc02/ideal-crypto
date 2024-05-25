import {
  Container,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { CoinMarket, RequestCoinMarkets } from "models/coin.model";
import { getCoinMarkets } from "pages/remotes";
import { useEffect, useState } from "react";
import StarIcon from "@mui/icons-material/Star";

function BoardPage() {
  const [coinMarkets, setCoinMarkets] = useState<CoinMarket[]>([]);
  const params: RequestCoinMarkets = {
    vs_currency: "krw",
    order: "market_cap_desc",
    per_page: 50,
    price_change_percentage: "1h,24h,7d",
  };
  const coinMarketHeaders: { id: keyof CoinMarket; label: string }[] = [
    { id: "name", label: "자산" },
    { id: "symbol", label: "" },
    { id: "current_price", label: "Price" },
    { id: "price_change_percentage_1h_in_currency", label: "1H" },
    { id: "price_change_percentage_24h_in_currency", label: "24H" },
    { id: "price_change_percentage_7d_in_currency", label: "7D" },
    { id: "market_cap_change_24h", label: "24H Volume" },
  ];

  useEffect(() => {
    getCoinMarketsOnCoinGecko();
  }, []);

  const getCoinMarketsOnCoinGecko = () => {
    getCoinMarkets(params).then((response) => {
      console.log(response);
      setCoinMarkets(response as CoinMarket[]);
    });
  };

  return (
    <div>
      <h1>Board Page</h1>
      <Container>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                {coinMarketHeaders.map((header) => (
                  <TableCell key={header.id}>{header.label}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {coinMarkets.map((coinMarket) => (
                <TableRow key={coinMarket.id}>
                  <TableCell>
                    <IconButton>
                      <StarIcon />
                    </IconButton>
                  </TableCell>
                  {coinMarketHeaders.map((header) => (
                    <TableCell key={header.id}>
                      {coinMarket[header.id]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </div>
  );
}

export default BoardPage;
