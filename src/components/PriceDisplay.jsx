import React from 'react';
import styled from 'styled-components';

// Internal formatting functions to avoid conflicts with global formatters
const PriceDisplay = ({ price, priceChange, percentChange, symbol = '$', showSymbol = true }) => {
  // Format price with appropriate precision
  const formatPriceInternal = (value) => {
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

    return `${showSymbol ? symbol : ''}${value.toFixed(decimals)}`;
  };

  // Format price change with + or - sign
  const formatPriceChangeInternal = (value) => {
    if (value === null || value === undefined) return 'N/A';

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

  // Format percentage change
  const formatPercentChangeInternal = (value) => {
    if (value === null || value === undefined) return 'N/A';
    return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  const isPositive = priceChange >= 0;

  return (
    <Container>
      <MainPrice>{formatPriceInternal(price)}</MainPrice>
      <ChangeContainer $isPositive={isPositive}>
        <PriceChange>{formatPriceChangeInternal(priceChange)}</PriceChange>
        <Separator>|</Separator>
        <PercentChange>{formatPercentChangeInternal(percentChange)}</PercentChange>
      </ChangeContainer>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const MainPrice = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-text-primary);
`;

const ChangeContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: ${props => props.$isPositive ? 'var(--color-success)' : 'var(--color-danger)'};
  font-size: 0.9rem;
`;

const PriceChange = styled.span`
  font-weight: 500;
`;

const Separator = styled.span`
  opacity: 0.5;
  font-size: 0.8rem;
`;

const PercentChange = styled.span`
  font-weight: 500;
`;

export default PriceDisplay;
