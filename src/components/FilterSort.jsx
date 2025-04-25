import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { selectAllCryptos } from '../features/crypto/cryptoSlice';
import { loadStarredCryptos } from '../services/localStorageService';

const FilterSort = ({
  activeFilter,
  setActiveFilter,
  sortConfig,
  setSortConfig,
  dataSource,
  lastVisit
}) => {
  // Get all cryptos to calculate counts
  const allCryptos = useSelector(selectAllCryptos);

  // Get starred cryptos from localStorage
  const starredCryptos = loadStarredCryptos();

  // Calculate counts for each filter
  const counts = {
    all: allCryptos.length,
    starred: starredCryptos.length,
    gainers: allCryptos.filter(crypto => crypto.change24h > 0).length,
    losers: allCryptos.filter(crypto => crypto.change24h < 0).length,
    volume: allCryptos.length,
    marketCap: allCryptos.length
  };
  // Filter options
  const filterOptions = [
    { id: 'all', label: 'All Cryptocurrencies' },
    { id: 'starred', label: 'Starred', icon: '★' },
    { id: 'gainers', label: 'Top Gainers (24h)' },
    { id: 'losers', label: 'Top Losers (24h)' },
    { id: 'volume', label: 'Highest Volume' },
    { id: 'marketCap', label: 'Highest Market Cap' },
  ];

  // Sort options
  const sortOptions = [
    { id: 'rank', label: 'Rank', field: 'id' },
    { id: 'name', label: 'Name', field: 'name' },
    { id: 'price', label: 'Price', field: 'price' },
    { id: 'change1h', label: '1h %', field: 'change1h' },
    { id: 'change24h', label: '24h %', field: 'change24h' },
    { id: 'change7d', label: '7d %', field: 'change7d' },
    { id: 'marketCap', label: 'Market Cap', field: 'marketCap' },
    { id: 'volume', label: 'Volume', field: 'volume24h' },
  ];

  // Handle filter change
  const handleFilterChange = (filterId) => {
    setActiveFilter(filterId);
  };

  // Handle sort change
  const handleSortChange = (sortId) => {
    const field = sortOptions.find(option => option.id === sortId)?.field;

    if (field) {
      // If clicking the same field, toggle direction
      if (sortConfig.field === field) {
        setSortConfig({
          field,
          direction: sortConfig.direction === 'asc' ? 'desc' : 'asc'
        });
      } else {
        // Default to descending for most fields, ascending for name
        const defaultDirection = field === 'name' ? 'asc' : 'desc';
        setSortConfig({ field, direction: defaultDirection });
      }
    }
  };

  // Format last visit date for welcome message
  const getWelcomeMessage = () => {
    if (!lastVisit) return null;

    const lastVisitDate = new Date(lastVisit);
    const now = new Date();
    const diffDays = Math.floor((now - lastVisitDate) / (1000 * 60 * 60 * 24));

    let timeDescription;
    if (diffDays === 0) {
      timeDescription = 'today';
    } else if (diffDays === 1) {
      timeDescription = 'yesterday';
    } else if (diffDays < 7) {
      timeDescription = `${diffDays} days ago`;
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      timeDescription = `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
    } else {
      const formattedDate = lastVisitDate.toLocaleDateString();
      timeDescription = `on ${formattedDate}`;
    }

    return `Welcome back! Your last visit was ${timeDescription}.`;
  };

  return (
    <Container>
      {lastVisit && (
        <WelcomeMessage>
          <WelcomeIcon>👋</WelcomeIcon>
          {getWelcomeMessage()}
        </WelcomeMessage>
      )}

      <FilterSection>
        <SectionTitle>Filter</SectionTitle>
        <ButtonGroup>
          {filterOptions.map(option => (
            <FilterButton
              key={option.id}
              $active={activeFilter === option.id}
              onClick={() => handleFilterChange(option.id)}
            >
              {option.icon && <FilterIcon>{option.icon}</FilterIcon>}
              {option.label}
              <CountBadge $active={activeFilter === option.id}>{counts[option.id]}</CountBadge>
            </FilterButton>
          ))}
        </ButtonGroup>
      </FilterSection>

      <SortSection>
        <SectionTitle>Sort By</SectionTitle>
        <ButtonGroup>
          {sortOptions.map(option => (
            <SortButton
              key={option.id}
              $active={sortConfig.field === option.field}
              $direction={sortConfig.field === option.field ? sortConfig.direction : null}
              onClick={() => handleSortChange(option.id)}
            >
              {option.label}
              {sortConfig.field === option.field && (
                <SortIcon $direction={sortConfig.direction}>
                  {sortConfig.direction === 'asc' ? '↑' : '↓'}
                </SortIcon>
              )}
            </SortButton>
          ))}
        </ButtonGroup>
      </SortSection>

      <DataSourceBadge $isLive={dataSource === 'live'}>
        {dataSource === 'live' ? 'LIVE DATA' : 'SIMULATED DATA'}
      </DataSourceBadge>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
  background-color: var(--color-card);
  border-radius: 10px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  position: relative;
`;

const FilterSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const SortSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const SectionTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text-secondary);
  margin: 0;
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const BaseButton = styled.button`
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid var(--color-border);
  background-color: ${props => props.$active ? 'var(--color-primary)' : 'transparent'};
  color: ${props => props.$active ? 'white' : 'var(--color-text-primary)'};

  &:hover {
    background-color: ${props => props.$active ? 'var(--color-primary)' : 'rgba(56, 97, 251, 0.1)'};
  }
`;

const FilterButton = styled(BaseButton)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  position: relative;
`;

const FilterIcon = styled.span`
  color: inherit;
  font-size: 1rem;
  margin-right: 0.25rem;
`;

const CountBadge = styled.span`
  background-color: ${props => props.$active ? 'rgba(255, 255, 255, 0.2)' : 'rgba(56, 97, 251, 0.2)'};
  color: ${props => props.$active ? 'white' : 'var(--color-primary)'};
  border-radius: 12px;
  padding: 0.1rem 0.4rem;
  font-size: 0.7rem;
  font-weight: 600;
`;

const SortButton = styled(BaseButton)`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const SortIcon = styled.span`
  font-size: 0.75rem;
  margin-left: 0.25rem;
`;

const WelcomeMessage = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  margin-bottom: 1rem;
  background-color: rgba(56, 97, 251, 0.1);
  border-left: 4px solid var(--color-primary);
  border-radius: 4px;
  color: var(--color-text-primary);
  font-size: 0.9rem;
`;

const WelcomeIcon = styled.span`
  font-size: 1.2rem;
`;

const DataSourceBadge = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  background-color: ${props => props.$isLive ? 'var(--color-success)' : 'var(--color-warning)'};
  color: white;
`;

export default FilterSort;
