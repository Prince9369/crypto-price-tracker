import { describe, it, expect, beforeEach } from 'vitest';
import cryptoReducer, {
  updateRealTimeData,
  updateMockData,
  setConnectionStatus,
  selectAllCryptos,
  selectCryptoById,
  selectDataSource,
  selectStatus
} from './cryptoSlice';
import { cryptoData } from '../../services/mockData';

describe('crypto reducer', () => {
  let initialState;

  beforeEach(() => {
    // Set up a fresh initial state before each test
    initialState = {
      cryptos: cryptoData,
      status: 'idle',
      dataSource: 'mock',
      error: null,
    };
  });

  it('should handle initial state', () => {
    // When reducer is called with undefined state, it should return the initial state
    expect(cryptoReducer(undefined, { type: 'unknown' })).toEqual({
      cryptos: expect.any(Array),
      status: 'idle',
      dataSource: 'mock',
      error: null,
    });
  });

  it('should handle updateRealTimeData', () => {
    const mockData = [
      { id: 1, name: 'Bitcoin', price: 60000 },
      { id: 2, name: 'Ethereum', price: 4000 }
    ];
    
    const newState = cryptoReducer(initialState, updateRealTimeData(mockData));
    
    expect(newState.cryptos).toEqual(mockData);
    expect(newState.dataSource).toBe('live');
    expect(newState.status).toBe('succeeded');
  });

  it('should handle updateMockData', () => {
    // First, let's modify the initial state to simulate it was using live data
    const modifiedState = {
      ...initialState,
      dataSource: 'live',
    };
    
    const newState = cryptoReducer(modifiedState, updateMockData());
    
    expect(newState.dataSource).toBe('mock');
    expect(newState.cryptos.length).toBe(initialState.cryptos.length);
    
    // Verify that price and other values have been updated
    newState.cryptos.forEach((crypto, index) => {
      expect(crypto).toHaveProperty('price');
      expect(crypto).toHaveProperty('change1h');
      expect(crypto).toHaveProperty('change24h');
      expect(crypto).toHaveProperty('change7d');
      expect(crypto).toHaveProperty('volume24h');
      expect(crypto).toHaveProperty('priceHistory');
    });
  });

  it('should handle setConnectionStatus', () => {
    const newState = cryptoReducer(initialState, setConnectionStatus('loading'));
    expect(newState.status).toBe('loading');
    
    const failedState = cryptoReducer(newState, setConnectionStatus('failed'));
    expect(failedState.status).toBe('failed');
    
    const succeededState = cryptoReducer(failedState, setConnectionStatus('succeeded'));
    expect(succeededState.status).toBe('succeeded');
  });
});

describe('crypto selectors', () => {
  const state = {
    crypto: {
      cryptos: [
        { id: 1, name: 'Bitcoin', price: 50000 },
        { id: 2, name: 'Ethereum', price: 3000 }
      ],
      status: 'succeeded',
      dataSource: 'live',
      error: null
    }
  };

  it('should select all cryptos', () => {
    const result = selectAllCryptos(state);
    expect(result).toEqual(state.crypto.cryptos);
    expect(result.length).toBe(2);
  });

  it('should select crypto by id', () => {
    const bitcoin = selectCryptoById(state, 1);
    expect(bitcoin).toEqual({ id: 1, name: 'Bitcoin', price: 50000 });
    
    const ethereum = selectCryptoById(state, 2);
    expect(ethereum).toEqual({ id: 2, name: 'Ethereum', price: 3000 });
    
    const nonExistent = selectCryptoById(state, 999);
    expect(nonExistent).toBeUndefined();
  });

  it('should select data source', () => {
    const dataSource = selectDataSource(state);
    expect(dataSource).toBe('live');
  });

  it('should select status', () => {
    const status = selectStatus(state);
    expect(status).toBe('succeeded');
  });
});
