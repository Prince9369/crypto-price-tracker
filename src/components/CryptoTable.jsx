import React, { useState, useMemo, useEffect } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { selectAllCryptos } from '../features/crypto/cryptoSlice';
import MiniChart from './MiniChart';
import PriceDisplay from './PriceDisplay';
import { formatCurrency, formatPercentage, formatNumber } from '../utils/formatters';
import { loadStarredCryptos, saveStarredCryptos } from '../services/localStorageService';
import { getCryptoIcon } from '../utils/cryptoIcons';

const CryptoTable = ({ activeFilter, sortConfig }) => {
  const allCryptos = useSelector(selectAllCryptos);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [starredCryptos, setStarredCryptos] = useState(() => loadStarredCryptos());

  // Save starred cryptos to localStorage when they change
  useEffect(() => {
    saveStarredCryptos(starredCryptos);
  }, [starredCryptos]);

  // Toggle star status for a cryptocurrency
  const toggleStar = (id) => {
    setStarredCryptos(prev => {
      if (prev.includes(id)) {
        return prev.filter(cryptoId => cryptoId !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  // Apply filtering and sorting
  const cryptos = useMemo(() => {
    let filteredData = [...allCryptos];

    // Apply filters
    switch (activeFilter) {
      case 'gainers':
        filteredData = filteredData.filter(crypto => crypto.change24h > 0)
          .sort((a, b) => b.change24h - a.change24h);
        break;
      case 'losers':
        filteredData = filteredData.filter(crypto => crypto.change24h < 0)
          .sort((a, b) => a.change24h - b.change24h);
        break;
      case 'volume':
        filteredData = filteredData.sort((a, b) => b.volume24h - a.volume24h);
        break;
      case 'marketCap':
        filteredData = filteredData.sort((a, b) => b.marketCap - a.marketCap);
        break;
      case 'starred':
        filteredData = filteredData.filter(crypto => starredCryptos.includes(crypto.id));
        break;
      default:
        // 'all' - no filtering needed
        break;
    }

    // Apply sorting (if not already sorted by filter)
    if (activeFilter === 'all' ||
        (activeFilter !== 'gainers' && activeFilter !== 'losers' &&
         sortConfig.field !== 'volume24h' && sortConfig.field !== 'marketCap')) {

      filteredData.sort((a, b) => {
        // Handle string fields differently
        if (sortConfig.field === 'name') {
          return sortConfig.direction === 'asc'
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name);
        }

        // Handle numeric fields
        if (sortConfig.direction === 'asc') {
          return a[sortConfig.field] - b[sortConfig.field];
        } else {
          return b[sortConfig.field] - a[sortConfig.field];
        }
      });
    }

    return filteredData;
  }, [allCryptos, activeFilter, sortConfig]);

  return (
    <TableContainer>
      <StyledTable>
        <TableHead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Price</th>
            <th>1h %</th>
            <th>24h %</th>
            <th>7d %</th>
            <th>Market Cap <InfoIcon>ⓘ</InfoIcon></th>
            <th>Volume(24h) <InfoIcon>ⓘ</InfoIcon></th>
            <th>Circulating Supply <InfoIcon>ⓘ</InfoIcon></th>
            <th>Last 7 Days</th>
          </tr>
        </TableHead>
        <TableBody>
          {cryptos.length === 0 ? (
            <NoResultsRow>
              <td colSpan="10">
                <NoResultsMessage>
                  No cryptocurrencies found matching the current filter.
                </NoResultsMessage>
              </td>
            </NoResultsRow>
          ) : (
            cryptos.map((crypto) => (
              <TableRow
                key={crypto.id}
                onMouseEnter={() => setHoveredRow(crypto.id)}
                onMouseLeave={() => setHoveredRow(null)}
                $isHovered={hoveredRow === crypto.id}
              >
              <StarCell>
                <StarIcon
                  $isStarred={starredCryptos.includes(crypto.id)}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleStar(crypto.id);
                  }}
                >
                  {starredCryptos.includes(crypto.id) ? '★' : '☆'}
                </StarIcon>
                {crypto.id}
              </StarCell>
              <NameCell>
                {/* Use CryptoLogoContainer with fallback */}
                <CryptoLogoContainer bgColor={crypto.color}>
                  {getCryptoIcon(crypto.symbol) ? (
                    <CryptoSvgLogo dangerouslySetInnerHTML={{ __html: getCryptoIcon(crypto.symbol) }} />
                  ) : (
                    <>
                      <CryptoLogo
                        src={crypto.logo}
                        alt={crypto.name}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      <LogoFallback>{crypto.logoFallback}</LogoFallback>
                    </>
                  )}
                </CryptoLogoContainer>
                <div>
                  <CryptoName>{crypto.name}</CryptoName>
                  <CryptoSymbol>{crypto.symbol}</CryptoSymbol>
                </div>
              </NameCell>
              <td>
                <PriceDisplay
                  price={crypto.price}
                  priceChange={crypto.price * crypto.change24h / 100}
                  percentChange={crypto.change24h}
                  symbol="$"
                />
              </td>
              <PercentageCell $change={crypto.change1h}>
                <ChangeIndicator $change={crypto.change1h}>
                  {crypto.change1h >= 0 ? '▲' : '▼'}
                </ChangeIndicator>
                {formatPercentage(crypto.change1h)}
              </PercentageCell>
              <PercentageCell $change={crypto.change24h}>
                <ChangeIndicator $change={crypto.change24h}>
                  {crypto.change24h >= 0 ? '▲' : '▼'}
                </ChangeIndicator>
                {formatPercentage(crypto.change24h)}
              </PercentageCell>
              <PercentageCell $change={crypto.change7d}>
                <ChangeIndicator $change={crypto.change7d}>
                  {crypto.change7d >= 0 ? '▲' : '▼'}
                </ChangeIndicator>
                {formatPercentage(crypto.change7d)}
              </PercentageCell>
              <td>{formatCurrency(crypto.marketCap)}</td>
              <VolumeCell>
                <div>{formatCurrency(crypto.volume24h)}</div>
                <VolumeSymbol>{crypto.symbol}</VolumeSymbol>
              </VolumeCell>
              <SupplyCell>
                <SupplyBar
                  $percent={crypto.maxSupply ? (crypto.circulatingSupply / crypto.maxSupply) * 100 : 100}
                />
                <div>
                  {formatNumber(crypto.circulatingSupply)} {crypto.symbol}
                </div>
              </SupplyCell>
              <td>
                <MiniChart data={crypto.priceHistory} change7d={crypto.change7d} />
              </td>
            </TableRow>
            ))
          )}
        </TableBody>
      </StyledTable>
    </TableContainer>
  );
};

// Styled Components
const TableContainer = styled.div`
  width: 100%;
  overflow-x: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  background: var(--color-card);
  color: var(--color-text-primary);
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-family: 'Inter', sans-serif;
  min-width: 1000px;
`;

const TableHead = styled.thead`
  background-color: var(--color-table-header);

  th {
    padding: 16px;
    text-align: left;
    font-weight: 600;
    color: var(--color-text-tertiary);
    font-size: 14px;
    border-bottom: 1px solid var(--color-table-border);
    white-space: nowrap;
  }
`;

const InfoIcon = styled.span`
  font-size: 12px;
  color: var(--color-text-tertiary);
  cursor: help;
  margin-left: 4px;
`;

const TableBody = styled.tbody`
  tr:hover {
    background-color: var(--color-table-row-hover);
  }
`;

const TableRow = styled.tr`
  border-bottom: 1px solid var(--color-table-border);
  background-color: ${props => props.$isHovered ? 'var(--color-table-row-hover)' : 'transparent'};
  transition: background-color 0.2s ease;

  td {
    padding: 16px;
    font-size: 14px;
    color: var(--color-text-primary);
    white-space: nowrap;
  }
`;

const StarCell = styled.td`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const StarIcon = styled.span`
  color: ${props => props.$isStarred ? 'var(--color-warning)' : 'var(--color-text-tertiary)'};
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    color: var(--color-warning);
    transform: scale(1.2);
  }
`;

const NameCell = styled.td`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const CryptoLogoContainer = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-color: ${props => props.bgColor || '#f0f0f0'};
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
`;

const CryptoLogo = styled.img`
  width: 28px;
  height: 28px;
  object-fit: cover;
`;

const CryptoSvgLogo = styled.div`
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LogoFallback = styled.div`
  width: 100%;
  height: 100%;
  display: none;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: white;
  font-size: 14px;
  position: absolute;
  top: 0;
  left: 0;
`;

const CryptoName = styled.div`
  font-weight: 600;
  color: var(--color-text-primary);
`;

const CryptoSymbol = styled.div`
  color: var(--color-text-tertiary);
  font-size: 12px;
`;

const PriceCell = styled.td`
  font-weight: 500;
`;

const PercentageCell = styled.td`
  color: ${(props) => (props.$change >= 0 ? 'var(--color-success)' : 'var(--color-danger)')};
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const ChangeIndicator = styled.span`
  font-size: 10px;
  color: ${(props) => (props.$change >= 0 ? 'var(--color-success)' : 'var(--color-danger)')};
`;

const VolumeCell = styled.td`
  display: flex;
  flex-direction: column;
`;

const VolumeSymbol = styled.span`
  font-size: 12px;
  color: #808a9d;
`;

const SupplyCell = styled.td`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const SupplyBar = styled.div`
  width: 120px;
  height: 6px;
  background-color: var(--color-supply-bar-bg);
  border-radius: 3px;
  overflow: hidden;
  position: relative;

  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: ${props => props.$percent}%;
    background-color: var(--color-primary);
    border-radius: 3px;
  }
`;

const NoResultsRow = styled.tr`
  height: 200px;
`;

const NoResultsMessage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: var(--color-text-tertiary);
  font-size: 1rem;
  text-align: center;
  padding: 2rem;
`;

export default CryptoTable;
