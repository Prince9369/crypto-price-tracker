import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import {
  saveToLocalStorage,
  loadFromLocalStorage,
  removeFromLocalStorage,
  saveFilterPreference,
  loadFilterPreference,
  saveSortPreference,
  loadSortPreference,
  saveDataSourcePreference,
  loadDataSourcePreference,
  saveStarredCryptos,
  loadStarredCryptos,
  updateLastVisit,
  getLastVisit
} from './localStorageService';

describe('localStorage service', () => {
  // Mock localStorage
  const localStorageMock = (() => {
    let store = {};
    return {
      getItem: vi.fn(key => store[key] || null),
      setItem: vi.fn((key, value) => {
        store[key] = value.toString();
      }),
      removeItem: vi.fn(key => {
        delete store[key];
      }),
      clear: vi.fn(() => {
        store = {};
      })
    };
  })();

  // Replace the global localStorage with our mock
  beforeEach(() => {
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true
    });
    
    // Clear the mock localStorage before each test
    localStorageMock.clear();
  });

  afterEach(() => {
    // Reset all mocks after each test
    vi.clearAllMocks();
  });

  describe('basic localStorage operations', () => {
    it('should save data to localStorage', () => {
      const key = 'testKey';
      const value = { test: 'data' };
      
      saveToLocalStorage(key, value);
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith(key, JSON.stringify(value));
    });

    it('should load data from localStorage', () => {
      const key = 'testKey';
      const value = { test: 'data' };
      const stringifiedValue = JSON.stringify(value);
      
      localStorageMock.getItem.mockReturnValueOnce(stringifiedValue);
      
      const result = loadFromLocalStorage(key);
      
      expect(localStorageMock.getItem).toHaveBeenCalledWith(key);
      expect(result).toEqual(value);
    });

    it('should return default value when key does not exist', () => {
      const key = 'nonExistentKey';
      const defaultValue = 'default';
      
      localStorageMock.getItem.mockReturnValueOnce(null);
      
      const result = loadFromLocalStorage(key, defaultValue);
      
      expect(localStorageMock.getItem).toHaveBeenCalledWith(key);
      expect(result).toBe(defaultValue);
    });

    it('should remove data from localStorage', () => {
      const key = 'testKey';
      
      removeFromLocalStorage(key);
      
      expect(localStorageMock.removeItem).toHaveBeenCalledWith(key);
    });

    it('should handle errors when saving to localStorage', () => {
      const key = 'testKey';
      const value = { test: 'data' };
      
      // Mock setItem to throw an error
      localStorageMock.setItem.mockImplementationOnce(() => {
        throw new Error('Storage error');
      });
      
      // Mock console.error to prevent actual logging during tests
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      // This should not throw an error
      saveToLocalStorage(key, value);
      
      expect(consoleSpy).toHaveBeenCalled();
      
      consoleSpy.mockRestore();
    });
  });

  describe('specific preference operations', () => {
    it('should save and load filter preference', () => {
      const filter = 'gainers';
      
      saveFilterPreference(filter);
      
      // Mock the return value for getItem
      localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(filter));
      
      const result = loadFilterPreference();
      
      expect(result).toBe(filter);
    });

    it('should save and load sort preference', () => {
      const sortConfig = { field: 'price', direction: 'desc' };
      
      saveSortPreference(sortConfig);
      
      // Mock the return value for getItem
      localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(sortConfig));
      
      const result = loadSortPreference();
      
      expect(result).toEqual(sortConfig);
    });

    it('should save and load data source preference', () => {
      const useLiveData = true;
      
      saveDataSourcePreference(useLiveData);
      
      // Mock the return value for getItem
      localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(useLiveData));
      
      const result = loadDataSourcePreference();
      
      expect(result).toBe(useLiveData);
    });

    it('should save and load starred cryptos', () => {
      const starredCryptos = [1, 3, 5];
      
      saveStarredCryptos(starredCryptos);
      
      // Mock the return value for getItem
      localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(starredCryptos));
      
      const result = loadStarredCryptos();
      
      expect(result).toEqual(starredCryptos);
    });

    it('should update and get last visit timestamp', () => {
      // Save current date for comparison
      const now = new Date();
      const isoString = now.toISOString();
      
      // Mock Date.now to return a fixed timestamp
      const originalDate = global.Date;
      global.Date = class extends Date {
        constructor() {
          super();
        }
        toISOString() {
          return isoString;
        }
      };
      
      updateLastVisit();
      
      // Mock the return value for getItem
      localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(isoString));
      
      const result = getLastVisit();
      
      expect(result).toBe(isoString);
      
      // Restore original Date
      global.Date = originalDate;
    });
  });
});
