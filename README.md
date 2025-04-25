# Real-Time Crypto Price Tracker

![Crypto Tracker Demo](demo.gif)

A responsive React + Redux Toolkit application that tracks real-time cryptocurrency prices using Binance WebSocket API, with all state managed via Redux.

## 🎮 Live Demo

Check out the live demo: [Crypto Price Tracker Demo](https://your-demo-url-here.com)

> **Note:** You can also view a video walkthrough of the application [here](https://your-video-url-here.com).

## 🚀 Features

- **Live Binance WebSocket Integration**: Real-time price updates directly from Binance
- **Advanced Filtering & Sorting**: Filter by top gainers, losers, and sort by any metric
- **User Preferences with localStorage**: Remembers filter, sort, theme, and starred cryptos
- **Comprehensive Unit Tests**: Thorough testing of reducers, selectors, and components
- **Fallback to Simulation**: Graceful degradation to simulated data if connection fails
- **Theme Switching**: Toggle between light and dark themes with persistent preference
- **Responsive UI**: Fully responsive design that works on all devices
- **Redux State Management**: All application state managed through Redux Toolkit
- **Interactive Elements**: Hover effects, animations, and color-coded price changes
- **Performance Optimized**: Uses Redux selectors and memoization to minimize re-renders
- **Connection Status Indicator**: Visual feedback on WebSocket connection status
- **Welcome Back Message**: Personalized greeting based on last visit timestamp

## 🛠️ Tech Stack

- **React 19**: Modern UI library with hooks and functional components
- **Redux Toolkit**: State management with simplified Redux setup
- **Binance WebSocket API**: Real-time cryptocurrency market data
- **CoinGecko API**: Additional market data for enriched information
- **Styled Components**: CSS-in-JS styling for component-scoped styles
- **Chart.js & React-Chartjs-2**: Interactive price history charts
- **Vite**: Fast, modern build tool and development server
- **Vitest**: Unit testing framework compatible with Vite
- **Testing Library**: Component testing with user-centric approach
- **localStorage API**: Client-side storage for user preferences

## 🏗️ Architecture

The application follows a clean architecture pattern with a focus on maintainability and scalability:

```
src/
├── app/                # Redux store configuration
├── components/         # Reusable UI components
│   ├── CryptoTable.jsx # Main cryptocurrency table
│   ├── FilterSort.jsx  # Filtering and sorting controls
│   ├── Header.jsx      # Application header with stats
│   ├── MiniChart.jsx   # Price history sparkline charts
│   ├── PriceDisplay.jsx # Price display with animations
│   └── ...
├── features/           # Feature-specific Redux slices
│   └── crypto/         # Cryptocurrency data management
│       ├── cryptoSlice.js    # Redux slice for crypto data
│       └── cryptoSlice.test.js # Tests for the crypto slice
├── services/           # External services integration
│   ├── binanceService.js     # Binance WebSocket integration
│   ├── localStorageService.js # User preferences persistence
│   └── mockData.js           # Fallback mock data
├── tests/              # Test setup and utilities
├── utils/              # Utility functions and helpers
│   ├── formatters.js   # Data formatting utilities
│   ├── cryptoIcons.js  # SVG icons for cryptocurrencies
│   └── ...
└── main.jsx           # Application entry point
```

### Data Flow

1. **Data Fetching**: The `binanceService.js` connects to Binance WebSocket API to receive real-time market data
2. **State Management**: Data is stored in Redux using the crypto slice in `features/crypto/cryptoSlice.js`
3. **UI Rendering**: Components subscribe to the Redux store and render based on the current state
4. **User Interactions**: User actions (filtering, sorting, starring) are dispatched to Redux
5. **Persistence**: User preferences are saved to localStorage via `localStorageService.js`

### Key Architectural Decisions

- **Redux for State Management**: Centralized state with Redux Toolkit for predictable data flow
- **WebSocket for Real-time Data**: Direct connection to Binance for live market updates
- **Fallback Mechanism**: Graceful degradation to simulated data if connection fails
- **Component Composition**: Modular components with clear separation of concerns
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Testing Strategy**: Unit tests for business logic and component rendering

## 🚦 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/Prince9369/crypto-price-tracker.git
   cd crypto-price-tracker
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Start the development server
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

### Running Tests

Run the unit tests with:
```bash
npm run test
```

Run tests with coverage report:
```bash
npm run test:coverage
```

### Building for Production

Build the application for production:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## 🚀 Deployment

This application can be easily deployed to Netlify. See the [DEPLOY.md](DEPLOY.md) file for detailed instructions.

### Quick Deployment Steps

1. Create a Netlify account at [netlify.com](https://www.netlify.com/)
2. Build your application: `npm run build`
3. Drag and drop the `dist` folder to Netlify's upload area
4. Your application will be live in seconds!

## 🔍 Implementation Details

- **Real-time Updates**: The application connects to Binance WebSocket API to receive live market data.
- **Advanced Filtering**: Filter cryptocurrencies by top gainers, losers, market cap, and volume.
- **Flexible Sorting**: Sort the data by any column in ascending or descending order.
- **Persistent Preferences**: User preferences are saved to localStorage and restored on return visits.
- **Star Favorite Cryptos**: Users can star their favorite cryptocurrencies for quick access.
- **Theme Switching**: Users can toggle between light and dark themes with persistent preference.
- **Comprehensive Testing**: Unit tests for reducers, selectors, and components ensure reliability.
- **Data Enrichment**: Additional market data is fetched from CoinGecko API to provide comprehensive information.
- **Responsive Design**: The UI is designed to work on all screen sizes, from mobile to desktop.
- **Performance**: Redux selectors and React.useMemo are used to optimize rendering performance.
- **Animations**: CSS animations are used to provide visual feedback for price changes.
- **Error Handling**: Graceful fallback to simulated data if the WebSocket connection fails.
- **Connection Status**: Visual indicator shows the current connection status.
- **Welcome Back**: Personalized welcome message for returning users.

## 🌟 Future Enhancements

- Historical price charts with different time ranges
- Price alerts and notifications
- Portfolio tracking functionality
- Advanced search capabilities
- Cryptocurrency comparison tool
- Export data to CSV/Excel
- End-to-end testing with Cypress

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.
