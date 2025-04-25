// Sample crypto data
export const cryptoData = [
  {
    id: 1,
    name: 'Bitcoin',
    symbol: 'BTC',
    logo: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png',
    logoFallback: 'B',
    color: '#F7931A',
    price: 50000.00,
    change1h: 1.2,
    change24h: 2.5,
    change7d: -0.8,
    marketCap: 950000000000,
    volume24h: 25000000000,
    circulatingSupply: 19000000,
    maxSupply: 21000000,
    priceHistory: [48500, 49200, 49800, 50100, 49700, 49900, 50000],
  },
  {
    id: 2,
    name: 'Ethereum',
    symbol: 'ETH',
    logo: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
    logoFallback: 'E',
    color: '#627EEA',
    price: 3200.00,
    change1h: -0.5,
    change24h: 1.8,
    change7d: 5.2,
    marketCap: 380000000000,
    volume24h: 15000000000,
    circulatingSupply: 120000000,
    maxSupply: null, // Ethereum doesn't have a max supply
    priceHistory: [3100, 3150, 3180, 3220, 3190, 3210, 3200],
  },
  {
    id: 3,
    name: 'Tether',
    symbol: 'USDT',
    logo: 'https://assets.coingecko.com/coins/images/325/small/Tether.png',
    logoFallback: 'T',
    color: '#26A17B',
    price: 1.00,
    change1h: 0.01,
    change24h: -0.02,
    change7d: 0.05,
    marketCap: 83000000000,
    volume24h: 60000000000,
    circulatingSupply: 83000000000,
    maxSupply: null,
    priceHistory: [1.00, 1.00, 1.00, 1.00, 1.00, 1.00, 1.00],
  },
  {
    id: 4,
    name: 'Binance Coin',
    symbol: 'BNB',
    logo: 'https://assets.coingecko.com/coins/images/825/small/bnb-icon2_2x.png',
    logoFallback: 'B',
    color: '#F3BA2F',
    price: 420.00,
    change1h: 0.8,
    change24h: -1.2,
    change7d: 2.3,
    marketCap: 70000000000,
    volume24h: 2000000000,
    circulatingSupply: 166800000,
    maxSupply: 166800000,
    priceHistory: [410, 415, 418, 422, 419, 421, 420],
  },
  {
    id: 5,
    name: 'Solana',
    symbol: 'SOL',
    logo: 'https://assets.coingecko.com/coins/images/4128/small/solana.png',
    logoFallback: 'S',
    color: '#14F195',
    price: 120.00,
    change1h: 2.1,
    change24h: 4.5,
    change7d: 10.2,
    marketCap: 48000000000,
    volume24h: 3000000000,
    circulatingSupply: 400000000,
    maxSupply: null,
    priceHistory: [110, 112, 115, 118, 119, 121, 120],
  },
];

// Mock WebSocket class to simulate real-time updates
export class MockWebSocket {
  constructor(url, onMessage) {
    this.url = url;
    this.onMessage = onMessage;
    this.interval = null;
    this.isConnected = false;
  }

  connect() {
    if (!this.isConnected) {
      this.isConnected = true;
      this.interval = setInterval(() => {
        this.onMessage();
      }, 2000); // Update every 2 seconds
      console.log('WebSocket connected to', this.url);
    }
  }

  disconnect() {
    if (this.isConnected) {
      clearInterval(this.interval);
      this.isConnected = false;
      console.log('WebSocket disconnected from', this.url);
    }
  }
}
