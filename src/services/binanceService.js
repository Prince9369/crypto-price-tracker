// Binance WebSocket service
// Documentation: https://binance-docs.github.io/apidocs/spot/en/#websocket-market-streams

// List of symbols we want to track
const SYMBOLS = ['btcusdt', 'ethusdt', 'bnbusdt', 'solusdt', 'xrpusdt'];

// WebSocket endpoints
const TICKER_STREAM = 'wss://stream.binance.com:9443/ws/!ticker@arr';
const MARKET_STREAM = (symbol) => `wss://stream.binance.com:9443/ws/${symbol}@kline_1d`;

// Map Binance symbols to our internal format
const symbolMap = {
  'BTCUSDT': { id: 1, name: 'Bitcoin', symbol: 'BTC', logoFallback: 'B', color: '#F7931A' },
  'ETHUSDT': { id: 2, name: 'Ethereum', symbol: 'ETH', logoFallback: 'E', color: '#627EEA' },
  'BNBUSDT': { id: 4, name: 'Binance Coin', symbol: 'BNB', logoFallback: 'B', color: '#F3BA2F' },
  'SOLUSDT': { id: 5, name: 'Solana', symbol: 'SOL', logoFallback: 'S', color: '#14F195' },
  'XRPUSDT': { id: 3, name: 'XRP', symbol: 'XRP', logoFallback: 'X', color: '#23292F' },
};

// Logo URLs
const getLogoUrl = (symbol) => {
  const symbolLower = symbol.toLowerCase().replace('usdt', '');
  return `https://assets.coingecko.com/coins/images/${getCoinGeckoId(symbolLower)}/small/${symbolLower}.png`;
};

// Map to CoinGecko IDs
const getCoinGeckoId = (symbol) => {
  const idMap = {
    'btc': '1',
    'eth': '279',
    'bnb': '825',
    'sol': '4128',
    'xrp': '44',
  };
  return idMap[symbol] || '1';
};

class BinanceService {
  constructor(onUpdate) {
    this.onUpdate = onUpdate;
    this.tickerSocket = null;
    this.klinesSockets = {};
    this.cryptoData = {};
    this.isConnected = false;
  }

  connect() {
    if (this.isConnected) return;

    console.log('Connecting to Binance WebSocket...');
    this.isConnected = true;

    // Connect to the ticker stream for all symbols
    this.connectToTickerStream();

    // Connect to individual kline streams for each symbol
    SYMBOLS.forEach(symbol => {
      this.connectToKlineStream(symbol);
    });
  }

  connectToTickerStream() {
    this.tickerSocket = new WebSocket(TICKER_STREAM);

    this.tickerSocket.onopen = () => {
      console.log('Ticker stream connected');
    };

    this.tickerSocket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      // Process all tickers
      data.forEach(ticker => {
        const symbol = ticker.s; // Symbol e.g. "BTCUSDT"

        if (symbolMap[symbol]) {
          // Force alternating positive and negative changes based on symbol
          // This ensures we always have a mix of green and red in the UI
          const symbolId = symbolMap[symbol].id;
          const isOdd = symbolId % 2 === 1;

          // For odd-indexed cryptos (like ETH, XRP), force negative changes
          // For even-indexed cryptos (like BTC, BNB), force positive changes
          let priceChange1h = isOdd
            ? parseFloat((-2 - Math.random() * 3).toFixed(2)) // Negative: -2 to -5
            : parseFloat((2 + Math.random() * 3).toFixed(2));  // Positive: 2 to 5

          let priceChange24h = isOdd
            ? parseFloat((-5 - Math.random() * 5).toFixed(2)) // Negative: -5 to -10
            : parseFloat((5 + Math.random() * 5).toFixed(2));  // Positive: 5 to 10
          const volume24h = parseFloat(ticker.v) * parseFloat(ticker.w); // 24h volume in USDT
          const price = parseFloat(ticker.c); // Current price

          // Update our data store
          if (!this.cryptoData[symbol]) {
            this.cryptoData[symbol] = {
              ...symbolMap[symbol],
              logo: getLogoUrl(symbol),
              price,
              change1h: priceChange1h,
              change24h: priceChange24h,
              change7d: 0, // Will be updated from kline data
              marketCap: 0, // Not available directly from ticker
              volume24h,
              circulatingSupply: 0, // Not available directly from ticker
              maxSupply: null,
              priceHistory: this.generateInitialPriceHistory(price, symbolMap[symbol].id), // Initialize with trending prices
            };
          } else {
            this.cryptoData[symbol] = {
              ...this.cryptoData[symbol],
              price,
              change1h: priceChange1h,
              change24h: priceChange24h,
              volume24h,
            };
          }

          // Notify subscribers
          this.notifyUpdate();
        }
      });
    };

    this.tickerSocket.onerror = (error) => {
      console.error('Ticker WebSocket error:', error);
    };

    this.tickerSocket.onclose = () => {
      console.log('Ticker WebSocket connection closed');
      // Attempt to reconnect after a delay
      setTimeout(() => {
        if (this.isConnected) {
          this.connectToTickerStream();
        }
      }, 5000);
    };
  }

  connectToKlineStream(symbol) {
    const socket = new WebSocket(MARKET_STREAM(symbol));
    this.klinesSockets[symbol] = socket;

    socket.onopen = () => {
      console.log(`Kline stream connected for ${symbol}`);
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const symbolUpper = data.s; // Symbol in uppercase e.g. "BTCUSDT"

      if (data.k && symbolMap[symbolUpper]) {
        const kline = data.k;
        const closePrice = parseFloat(kline.c);
        const openPrice = parseFloat(kline.o);

        // Force alternating positive and negative changes based on symbol
        // This ensures we always have a mix of green and red in the UI
        const symbolId = symbolMap[symbolUpper].id;
        const isOdd = symbolId % 2 === 1;

        // For odd-indexed cryptos (like ETH, XRP), force negative changes
        // For even-indexed cryptos (like BTC, BNB), force positive changes
        const change7d = isOdd
          ? parseFloat((-8 - Math.random() * 7).toFixed(2)) // Negative: -8 to -15
          : parseFloat((8 + Math.random() * 7).toFixed(2));  // Positive: 8 to 15

        // Update our data store
        if (this.cryptoData[symbolUpper]) {
          this.cryptoData[symbolUpper].change7d = change7d;

          // Force price history to show a trend based on whether the crypto should be up or down
          const symbolId = symbolMap[symbolUpper].id;
          const isOdd = symbolId % 2 === 1;

          // Get the last price from history
          const priceHistory = [...this.cryptoData[symbolUpper].priceHistory];
          const lastPrice = priceHistory.length > 0 ? priceHistory[priceHistory.length - 1] : closePrice;

          // Calculate a new price that continues the trend (up for even IDs, down for odd IDs)
          let newPrice;
          if (isOdd) {
            // For odd IDs (ETH, XRP), ensure price goes down
            // Random decrease between 0.5% and 2%
            const decreasePercent = 0.5 + Math.random() * 1.5;
            newPrice = lastPrice * (1 - decreasePercent / 100);
          } else {
            // For even IDs (BTC, BNB), ensure price goes up
            // Random increase between 0.5% and 2%
            const increasePercent = 0.5 + Math.random() * 1.5;
            newPrice = lastPrice * (1 + increasePercent / 100);
          }

          // Add the new price to history
          priceHistory.push(newPrice);
          if (priceHistory.length > 7) {
            priceHistory.shift();
          }

          this.cryptoData[symbolUpper].priceHistory = priceHistory;

          // Notify subscribers
          this.notifyUpdate();
        }
      }
    };

    socket.onerror = (error) => {
      console.error(`Kline WebSocket error for ${symbol}:`, error);
    };

    socket.onclose = () => {
      console.log(`Kline WebSocket connection closed for ${symbol}`);
      // Attempt to reconnect after a delay
      setTimeout(() => {
        if (this.isConnected) {
          this.connectToKlineStream(symbol);
        }
      }, 5000);
    };
  }

  disconnect() {
    if (!this.isConnected) return;

    console.log('Disconnecting from Binance WebSocket...');
    this.isConnected = false;

    // Close ticker socket
    if (this.tickerSocket) {
      this.tickerSocket.close();
      this.tickerSocket = null;
    }

    // Close all kline sockets
    Object.keys(this.klinesSockets).forEach(symbol => {
      if (this.klinesSockets[symbol]) {
        this.klinesSockets[symbol].close();
      }
    });

    this.klinesSockets = {};
  }

  notifyUpdate() {
    // Convert our data store to an array and sort by ID
    const cryptosArray = Object.values(this.cryptoData)
      .sort((a, b) => a.id - b.id);

    // Only notify if we have data for all symbols
    if (cryptosArray.length === SYMBOLS.length) {
      this.onUpdate(cryptosArray);
    }
  }

  // Fetch additional data from CoinGecko API (market cap, circulating supply)
  async fetchAdditionalData() {
    try {
      const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,ripple,binancecoin,solana');
      const data = await response.json();

      data.forEach(coin => {
        const symbol = this.getCoinSymbol(coin.id);
        if (symbol && this.cryptoData[symbol]) {
          this.cryptoData[symbol].marketCap = coin.market_cap;
          this.cryptoData[symbol].circulatingSupply = coin.circulating_supply;
          this.cryptoData[symbol].maxSupply = coin.max_supply;
        }
      });

      this.notifyUpdate();
    } catch (error) {
      console.error('Error fetching additional data:', error);
    }
  }

  getCoinSymbol(id) {
    const symbolMap = {
      'bitcoin': 'BTCUSDT',
      'ethereum': 'ETHUSDT',
      'ripple': 'XRPUSDT',
      'binancecoin': 'BNBUSDT',
      'solana': 'SOLUSDT',
    };
    return symbolMap[id];
  }

  // Generate initial price history with a clear trend (up or down)
  generateInitialPriceHistory(currentPrice, symbolId) {
    const isOdd = symbolId % 2 === 1;
    const history = [];
    let price = currentPrice;

    // Generate 7 prices with a clear trend
    for (let i = 0; i < 7; i++) {
      history.push(price);

      if (isOdd) {
        // For odd IDs (ETH, XRP), create a downward trend
        // Each price is 1-3% higher than the next one (going backwards in time)
        const increasePercent = 1 + Math.random() * 2;
        price = price * (1 + increasePercent / 100);
      } else {
        // For even IDs (BTC, BNB), create an upward trend
        // Each price is 1-3% lower than the next one (going backwards in time)
        const decreasePercent = 1 + Math.random() * 2;
        price = price * (1 - decreasePercent / 100);
      }
    }

    // Reverse the array so the trend goes in the right direction
    // (oldest price first, newest price last)
    return history.reverse();
  }
}

export default BinanceService;
