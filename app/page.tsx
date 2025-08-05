'use client';
import { useState, useEffect } from 'react';

// Import Material-UI components
import {
  Container,
  Typography,
  Grid,
  TextField,
  Button,
  CircularProgress,
  Card,
  CardContent,
  Alert,
  AppBar,
  Toolbar,
  Box,
  Autocomplete
} from '@mui/material';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import CurrencyAPI from '@everapi/currencyapi-js';

// --- Type Interfaces ---
interface Currency {
  code: string;
  name: string;
}

interface CurrencyApiResponse {
  meta: {
    last_updated_at: string;
  };
  data: {
    [currencyCode: string]: {
      code: string;
      value: number;
    };
  };
}

// --- Main Component ---
export default function Home() {
  // State for form inputs
  const [amount, setAmount] = useState<number>(1);
  const [fromCurrency, setFromCurrency] = useState<Currency | null>({ code: 'USD', name: 'United States Dollar' });
  const [toCurrency, setToCurrency] = useState<Currency | null>({ code: 'EUR', name: 'Euro' });

  // State for API data and status
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<number | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  // Sample currency list for the Autocomplete dropdowns
  const currencies: Currency[] = [
    { code: 'USD', name: 'United States Dollar' },
    { code: 'EUR', name: 'Euro' },
    { code: 'JPY', name: 'Japanese Yen' },
    { code: 'GBP', name: 'British Pound' },
    { code: 'CAD', name: 'Canadian Dollar' },
    { code: 'AUD', name: 'Australian Dollar' },
    { code: 'CHF', name: 'Swiss Franc' },
    { code: 'CNY', name: 'Chinese Yuan' },
  ];

  // Function to fetch currency data
  const handleConversion = () => {
    if (!fromCurrency || !toCurrency || !amount) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    const client = new CurrencyAPI(process.env.NEXT_PUBLIC_API_KEY);

    client.latest({
      base_currency: fromCurrency.code,
      currencies: toCurrency.code,
    }).then((response: CurrencyApiResponse) => {
      if (response.data && response.data[toCurrency.code]) {
        const rate = response.data[toCurrency.code].value;
        setResult(rate * amount);
        setLastUpdated(new Date(response.meta.last_updated_at).toLocaleString());
      } else {
         setError('Could not fetch conversion rate. Please check the currency codes.');
      }
    }).catch((err : Error) => {
      console.error("API Error:", err);
      setError('Failed to connect to the currency API. Please check your API key and connection.');
    }).finally(() => {
      setLoading(false);
    });
  };
  
  // Trigger conversion on initial load
  useEffect(() => {
    handleConversion();
  }, []);

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* 1. App Bar for the title */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Currency Converter
          </Typography>
        </Toolbar>
      </AppBar>

      {/* 2. Main content container */}
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Card variant="outlined">
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h5" component="h1" gutterBottom>
              Convert Currencies
            </Typography>

            {/* 3. Grid for input fields */}
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={5}>
                <Autocomplete
                  options={currencies}
                  getOptionLabel={(option) => `${option.code} - ${option.name}`}
                  value={fromCurrency}
                  onChange={(event, newValue) => setFromCurrency(newValue)}
                  renderInput={(params) => <TextField {...params} label="From" />}
                  disableClearable
                />
              </Grid>
              <Grid item xs={12} md={2} textAlign="center">
                  <SwapHorizIcon color="action" />
              </Grid>
              <Grid item xs={12} md={5}>
                <Autocomplete
                  options={currencies}
                  getOptionLabel={(option) => `${option.code} - ${option.name}`}
                  value={toCurrency}
                  onChange={(event, newValue) => setToCurrency(newValue)}
                  renderInput={(params) => <TextField {...params} label="To" />}
                  disableClearable
                />
              </Grid>
              <Grid item xs={12}>
                 <TextField
                  label="Amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(parseFloat(e.target.value))}
                  fullWidth
                  InputProps={{ inputProps: { min: 0 } }}
                />
              </Grid>
            </Grid>
            
            {/* 4. Convert Button */}
            <Box textAlign="center" sx={{ mt: 3 }}>
              <Button 
                variant="contained" 
                size="large" 
                onClick={handleConversion}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Convert'}
              </Button>
            </Box>

            {/* 5. Displaying Results & Errors */}
            <Box sx={{ mt: 3, minHeight: 100 }}>
              {error && <Alert severity="error">{error}</Alert>}
              {result && !error && (
                <Card variant="elevation" sx={{ p: 2, backgroundColor: 'grey.100' }}>
                   <Typography variant="h6" component="p" textAlign="center">
                    {amount} {fromCurrency?.code} =
                  </Typography>
                  <Typography variant="h4" component="p" textAlign="center" fontWeight="bold">
                    {result.toFixed(4)} {toCurrency?.code}
                  </Typography>
                   <Typography variant="caption" display="block" textAlign="center" sx={{ mt: 1 }}>
                    Last updated: {lastUpdated}
                  </Typography>
                </Card>
              )}
            </Box>

          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}