import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import ConnectionStatus from './ConnectionStatus';
import cryptoReducer from '../features/crypto/cryptoSlice';

// Create a mock store for testing
const createMockStore = (status, dataSource) => {
  return configureStore({
    reducer: {
      crypto: cryptoReducer
    },
    preloadedState: {
      crypto: {
        cryptos: [],
        status,
        dataSource,
        error: null
      }
    }
  });
};

describe('ConnectionStatus component', () => {
  it('displays connected status when succeeded with live data', () => {
    const store = createMockStore('succeeded', 'live');
    
    render(
      <Provider store={store}>
        <ConnectionStatus />
      </Provider>
    );
    
    expect(screen.getByText('Connected to Binance WebSocket')).toBeInTheDocument();
    expect(screen.getByText('LIVE')).toBeInTheDocument();
  });

  it('displays simulated data status when succeeded with mock data', () => {
    const store = createMockStore('succeeded', 'mock');
    
    render(
      <Provider store={store}>
        <ConnectionStatus />
      </Provider>
    );
    
    expect(screen.getByText('Using simulated data')).toBeInTheDocument();
  });

  it('displays connecting status when loading', () => {
    const store = createMockStore('loading', 'mock');
    
    render(
      <Provider store={store}>
        <ConnectionStatus />
      </Provider>
    );
    
    expect(screen.getByText('Connecting...')).toBeInTheDocument();
  });

  it('displays failed status when connection fails', () => {
    const store = createMockStore('failed', 'mock');
    
    render(
      <Provider store={store}>
        <ConnectionStatus />
      </Provider>
    );
    
    expect(screen.getByText('Connection failed')).toBeInTheDocument();
  });

  it('displays initializing status for other states', () => {
    const store = createMockStore('idle', 'mock');
    
    render(
      <Provider store={store}>
        <ConnectionStatus />
      </Provider>
    );
    
    expect(screen.getByText('Initializing...')).toBeInTheDocument();
  });

  it('has the correct color for each status', () => {
    // Test succeeded status
    const successStore = createMockStore('succeeded', 'live');
    const { rerender } = render(
      <Provider store={successStore}>
        <ConnectionStatus />
      </Provider>
    );
    
    let indicator = screen.getByText('Connected to Binance WebSocket').previousSibling;
    expect(indicator).toHaveStyle('background-color: #16c784');
    
    // Test loading status
    const loadingStore = createMockStore('loading', 'mock');
    rerender(
      <Provider store={loadingStore}>
        <ConnectionStatus />
      </Provider>
    );
    
    indicator = screen.getByText('Connecting...').previousSibling;
    expect(indicator).toHaveStyle('background-color: #f7931a');
    
    // Test failed status
    const failedStore = createMockStore('failed', 'mock');
    rerender(
      <Provider store={failedStore}>
        <ConnectionStatus />
      </Provider>
    );
    
    indicator = screen.getByText('Connection failed').previousSibling;
    expect(indicator).toHaveStyle('background-color: #ea3943');
  });
});
