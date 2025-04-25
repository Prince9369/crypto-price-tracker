// Format currency with appropriate symbol and decimal places
export const formatCurrency = (value, symbol = '$', decimals = 2) => {
  if (value === null || value === undefined) return 'N/A';

  // For large numbers, use abbreviations
  if (value >= 1e9) {
    return `${symbol}${(value / 1e9).toFixed(decimals)}B`;
  } else if (value >= 1e6) {
    return `${symbol}${(value / 1e6).toFixed(decimals)}M`;
  } else if (value >= 1e3) {
    return `${symbol}${(value / 1e3).toFixed(decimals)}K`;
  }

  // For regular numbers
  return `${symbol}${value.toFixed(decimals)}`;
};

// Format price with appropriate precision based on value
export const formatPrice = (value, symbol = '$') => {
  if (value === null || value === undefined) return 'N/A';

  // Determine decimal places based on price range
  let decimals = 2;
  if (value >= 1000) {
    decimals = 0;
  } else if (value >= 100) {
    decimals = 1;
  } else if (value >= 1) {
    decimals = 2;
  } else if (value >= 0.1) {
    decimals = 3;
  } else if (value >= 0.01) {
    decimals = 4;
  } else {
    decimals = 6;
  }

  return formatCurrency(value, symbol, decimals);
};

// Format percentage with + or - sign
export const formatPercentage = (value) => {
  if (value === null || value === undefined) return 'N/A';
  return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`;
};

// Format price change with + or - sign and appropriate precision
export const formatPriceChange = (value, symbol = '$') => {
  if (value === null || value === undefined) return 'N/A';

  // Determine decimal places based on absolute value
  const absValue = Math.abs(value);
  let decimals = 2;

  if (absValue >= 1000) {
    decimals = 0;
  } else if (absValue >= 100) {
    decimals = 1;
  } else if (absValue >= 1) {
    decimals = 2;
  } else if (absValue >= 0.1) {
    decimals = 3;
  } else if (absValue >= 0.01) {
    decimals = 4;
  } else {
    decimals = 6;
  }

  return `${value > 0 ? '+' : ''}${symbol}${absValue.toFixed(decimals)}`;
};

// Format large numbers with commas
export const formatNumber = (value) => {
  if (value === null || value === undefined) return 'N/A';
  return value.toLocaleString();
};
