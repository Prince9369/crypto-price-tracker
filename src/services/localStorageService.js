// Constants for localStorage keys
const STORAGE_KEYS = {
  FILTER: 'crypto_tracker_filter',
  SORT: 'crypto_tracker_sort',
  DATA_SOURCE: 'crypto_tracker_data_source',
  THEME: 'crypto_tracker_theme',
  STARRED_CRYPTOS: 'crypto_tracker_starred',
  LAST_VISIT: 'crypto_tracker_last_visit'
};

/**
 * Save user preferences to localStorage
 * @param {string} key - The key to store the value under
 * @param {any} value - The value to store
 */
export const saveToLocalStorage = (key, value) => {
  try {
    const serializedValue = JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

/**
 * Load user preferences from localStorage
 * @param {string} key - The key to retrieve the value from
 * @param {any} defaultValue - The default value to return if the key doesn't exist
 * @returns {any} The stored value or defaultValue if not found
 */
export const loadFromLocalStorage = (key, defaultValue = null) => {
  try {
    const serializedValue = localStorage.getItem(key);
    if (serializedValue === null) {
      return defaultValue;
    }
    return JSON.parse(serializedValue);
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return defaultValue;
  }
};

/**
 * Remove a specific item from localStorage
 * @param {string} key - The key to remove
 */
export const removeFromLocalStorage = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing from localStorage:', error);
  }
};

/**
 * Clear all app-related data from localStorage
 */
export const clearLocalStorage = () => {
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
};

/**
 * Save user filter preference
 * @param {string} filter - The active filter
 */
export const saveFilterPreference = (filter) => {
  saveToLocalStorage(STORAGE_KEYS.FILTER, filter);
};

/**
 * Load user filter preference
 * @returns {string} The stored filter preference or 'all' if not found
 */
export const loadFilterPreference = () => {
  return loadFromLocalStorage(STORAGE_KEYS.FILTER, 'all');
};

/**
 * Save user sort preference
 * @param {Object} sortConfig - The sort configuration { field, direction }
 */
export const saveSortPreference = (sortConfig) => {
  saveToLocalStorage(STORAGE_KEYS.SORT, sortConfig);
};

/**
 * Load user sort preference
 * @returns {Object} The stored sort configuration or default if not found
 */
export const loadSortPreference = () => {
  return loadFromLocalStorage(STORAGE_KEYS.SORT, { field: 'marketCap', direction: 'desc' });
};

/**
 * Save data source preference (live or mock)
 * @param {boolean} useLiveData - Whether to use live data
 */
export const saveDataSourcePreference = (useLiveData) => {
  saveToLocalStorage(STORAGE_KEYS.DATA_SOURCE, useLiveData);
};

/**
 * Load data source preference
 * @returns {boolean} Whether to use live data
 */
export const loadDataSourcePreference = () => {
  return loadFromLocalStorage(STORAGE_KEYS.DATA_SOURCE, true);
};

/**
 * Save starred cryptocurrencies
 * @param {Array} starredCryptos - Array of cryptocurrency IDs that are starred
 */
export const saveStarredCryptos = (starredCryptos) => {
  saveToLocalStorage(STORAGE_KEYS.STARRED_CRYPTOS, starredCryptos);
};

/**
 * Load starred cryptocurrencies
 * @returns {Array} Array of cryptocurrency IDs that are starred
 */
export const loadStarredCryptos = () => {
  return loadFromLocalStorage(STORAGE_KEYS.STARRED_CRYPTOS, []);
};

/**
 * Update last visit timestamp
 */
export const updateLastVisit = () => {
  saveToLocalStorage(STORAGE_KEYS.LAST_VISIT, new Date().toISOString());
};

/**
 * Get last visit timestamp
 * @returns {string} ISO string of last visit date
 */
export const getLastVisit = () => {
  return loadFromLocalStorage(STORAGE_KEYS.LAST_VISIT, null);
};

export default {
  STORAGE_KEYS,
  saveToLocalStorage,
  loadFromLocalStorage,
  removeFromLocalStorage,
  clearLocalStorage,
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
};
