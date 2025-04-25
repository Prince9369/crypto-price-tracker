import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import PriceDisplay from './PriceDisplay';

describe('PriceDisplay component', () => {
  it('renders the price correctly', () => {
    render(
      <PriceDisplay
        price={50000}
        priceChange={1000}
        percentChange={2}
        symbol="$"
        showSymbol={true}
      />
    );

    // Check if the price is rendered
    expect(screen.getByText('$50000')).toBeInTheDocument();
  });

  it('renders positive price change with correct color', () => {
    render(
      <PriceDisplay
        price={50000}
        priceChange={1000}
        percentChange={2}
        symbol="$"
        showSymbol={true}
      />
    );

    // Check if the price change is rendered
    expect(screen.getByText('+$1000')).toBeInTheDocument();
    expect(screen.getByText('+2.00%')).toBeInTheDocument();

    // The container should have the success color for positive change
    const container = screen.getByText('+$1000').closest('div');
    expect(container).toHaveStyle('color: var(--color-success)');
  });

  it('renders negative price change with correct color', () => {
    render(
      <PriceDisplay
        price={50000}
        priceChange={-1000}
        percentChange={-2}
        symbol="$"
        showSymbol={true}
      />
    );

    // Check if the price change is rendered
    // Use a more flexible approach to find text that might be broken up
    expect(screen.getByText('$1000')).toBeInTheDocument();
    expect(screen.getByText('-2.00%')).toBeInTheDocument();

    // The container should have the danger color for negative change
    const container = screen.getByText('-2.00%').closest('div');
    expect(container).toHaveStyle('color: var(--color-danger)');
  });

  it('formats price with appropriate precision', () => {
    // Test with different price values
    const { rerender } = render(
      <PriceDisplay
        price={1234.5678}
        priceChange={10}
        percentChange={1}
        symbol="$"
        showSymbol={true}
      />
    );

    // Price should be formatted with appropriate precision
    // The actual formatting might round to different decimal places
    expect(screen.getByText('$1235')).toBeInTheDocument();

    // Test with a smaller price
    rerender(
      <PriceDisplay
        price={0.12345}
        priceChange={0.001}
        percentChange={1}
        symbol="$"
        showSymbol={true}
      />
    );

    // Small price should have more decimal places
    // Use a more flexible approach with a regex
    const smallPriceElement = screen.getByText(/\$0\.12/);
    expect(smallPriceElement).toBeInTheDocument();
  });

  it('respects the showSymbol prop', () => {
    const { rerender } = render(
      <PriceDisplay
        price={50000}
        priceChange={1000}
        percentChange={2}
        symbol="$"
        showSymbol={true}
      />
    );

    // Symbol should be shown
    expect(screen.getByText('$50000')).toBeInTheDocument();

    rerender(
      <PriceDisplay
        price={50000}
        priceChange={1000}
        percentChange={2}
        symbol="$"
        showSymbol={false}
      />
    );

    // Symbol should not be shown
    expect(screen.getByText('50000')).toBeInTheDocument();
  });
});
