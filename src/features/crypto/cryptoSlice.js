import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { cryptoData } from '../../services/mockData';

// Initial state with mock data as fallback
const initialState = {
  cryptos: cryptoData,
  status: 'idle',
  dataSource: 'mock', // 'mock' or 'live'
  error: null,
};

// Async thunk for fetching initial data from CoinGecko
export const fetchInitialData = createAsyncThunk(
  'crypto/fetchInitialData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,ripple,binancecoin,solana&order=market_cap_desc');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const cryptoSlice = createSlice({
  name: 'crypto',
  initialState,
  reducers: {
    // Update with real-time data from Binance WebSocket
    updateRealTimeData: (state, action) => {
      state.cryptos = action.payload;
      state.dataSource = 'live';
      state.status = 'succeeded';
    },

    // Fallback to mock data with simulated updates
    updateMockData: (state) => {
      state.cryptos = state.cryptos.map((crypto, index) => {
        // Force alternating positive and negative changes based on crypto ID
        // This ensures we always have a mix of green and red in the UI
        const isOdd = index % 2 === 1;

        // For odd-indexed cryptos (like ETH, XRP), force negative changes
        // For even-indexed cryptos (like BTC, BNB), force positive changes
        const hourChange = isOdd
          ? parseFloat((-2 - Math.random() * 3).toFixed(2)) // Negative: -2 to -5
          : parseFloat((2 + Math.random() * 3).toFixed(2));  // Positive: 2 to 5

        const dayChange = isOdd
          ? parseFloat((-5 - Math.random() * 5).toFixed(2)) // Negative: -5 to -10
          : parseFloat((5 + Math.random() * 5).toFixed(2));  // Positive: 5 to 10

        const weekChange = isOdd
          ? parseFloat((-8 - Math.random() * 7).toFixed(2)) // Negative: -8 to -15
          : parseFloat((8 + Math.random() * 7).toFixed(2));  // Positive: 8 to 15

        // Calculate new price based on hourly change
        const change = crypto.price * (hourChange / 100);
        const newPrice = crypto.price + change;

        // Update volume with random change
        const volumeChange = isOdd
          ? parseFloat((-3 - Math.random() * 5).toFixed(2)) // Negative: -3 to -8
          : parseFloat((3 + Math.random() * 5).toFixed(2));  // Positive: 3 to 8
        const newVolume = crypto.volume24h * (1 + volumeChange / 100);

        return {
          ...crypto,
          price: parseFloat(newPrice.toFixed(2)),
          change1h: hourChange,
          change24h: dayChange,
          change7d: weekChange,
          volume24h: parseFloat(newVolume.toFixed(0)),
          priceHistory: [...crypto.priceHistory.slice(-6), newPrice], // Keep last 7 prices for chart
        };
      });
      state.dataSource = 'mock';
    },

    // Set connection status
    setConnectionStatus: (state, action) => {
      state.status = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInitialData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchInitialData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Map CoinGecko data to our format
        const mappedData = action.payload.map(coin => {
          const existingCrypto = cryptoData.find(c =>
            c.name.toLowerCase() === coin.name.toLowerCase() ||
            c.symbol.toLowerCase() === coin.symbol.toLowerCase()
          );

          return {
            id: existingCrypto?.id || Math.random(),
            name: coin.name,
            symbol: coin.symbol.toUpperCase(),
            logo: coin.image,
            logoFallback: coin.symbol.charAt(0).toUpperCase(),
            color: existingCrypto?.color || '#3861fb',
            price: coin.current_price,
            change1h: coin.price_change_percentage_1h_in_currency || 0,
            change24h: coin.price_change_percentage_24h || 0,
            change7d: coin.price_change_percentage_7d_in_currency || 0,
            marketCap: coin.market_cap,
            volume24h: coin.total_volume,
            circulatingSupply: coin.circulating_supply,
            maxSupply: coin.max_supply,
            priceHistory: existingCrypto?.priceHistory || Array(7).fill(coin.current_price),
          };
        });

        state.cryptos = mappedData;
        state.dataSource = 'coingecko';
      })
      .addCase(fetchInitialData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

// Export actions and reducer
export const {
  updateRealTimeData,
  updateMockData,
  setConnectionStatus
} = cryptoSlice.actions;

// Selectors
export const selectAllCryptos = (state) => state.crypto.cryptos;
export const selectCryptoById = (state, id) =>
  state.crypto.cryptos.find(crypto => crypto.id === id);
export const selectDataSource = (state) => state.crypto.dataSource;
export const selectStatus = (state) => state.crypto.status;

export default cryptoSlice.reducer;
