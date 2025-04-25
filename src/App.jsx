import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import Header from './components/Header';
import CryptoTable from './components/CryptoTable';
import ConnectionStatus from './components/ConnectionStatus';
import FilterSort from './components/FilterSort';
import ThemeToggle from './components/ThemeToggle';
import {
  updateRealTimeData,
  updateMockData,
  setConnectionStatus,
  fetchInitialData,
  selectDataSource
} from './features/crypto/cryptoSlice';
import BinanceService from './services/binanceService';
import {
  loadFilterPreference,
  loadSortPreference,
  loadDataSourcePreference,
  saveFilterPreference,
  saveSortPreference,
  saveDataSourcePreference,
  updateLastVisit,
  getLastVisit
} from './services/localStorageService';

function App() {
  const dispatch = useDispatch();
  const dataSource = useSelector(selectDataSource);

  // Load preferences from localStorage
  const [useLiveData, setUseLiveData] = useState(() => loadDataSourcePreference());
  const [binanceService, setBinanceService] = useState(null);

  // Filter and sort state with localStorage persistence
  const [activeFilter, setActiveFilter] = useState(() => loadFilterPreference());
  const [sortConfig, setSortConfig] = useState(() => loadSortPreference());

  // Last visit information
  const [lastVisit] = useState(() => getLastVisit());

  // Update last visit timestamp
  useEffect(() => {
    updateLastVisit();

    // Show welcome back message if returning user
    if (lastVisit) {
      const lastVisitDate = new Date(lastVisit);
      const formattedDate = lastVisitDate.toLocaleDateString();
      const formattedTime = lastVisitDate.toLocaleTimeString();
      console.log(`Welcome back! Your last visit was on ${formattedDate} at ${formattedTime}`);
    }
  }, [lastVisit]);

  // Initialize and fetch initial data
  useEffect(() => {
    dispatch(fetchInitialData());
  }, [dispatch]);

  // Setup WebSocket connection or fallback to mock data
  useEffect(() => {
    let intervalId;

    if (useLiveData) {
      try {
        dispatch(setConnectionStatus('loading'));

        // Create Binance WebSocket service
        const service = new BinanceService((data) => {
          dispatch(updateRealTimeData(data));
        });

        // Connect to Binance WebSocket
        service.connect();

        // Fetch additional data (market cap, circulating supply) every 2 minutes
        service.fetchAdditionalData();
        const additionalDataInterval = setInterval(() => {
          service.fetchAdditionalData();
        }, 120000);

        setBinanceService(service);

        // Clean up
        return () => {
          service.disconnect();
          clearInterval(additionalDataInterval);
        };
      } catch (error) {
        console.error('Failed to connect to Binance:', error);
        dispatch(setConnectionStatus('failed'));
        setUseLiveData(false);
      }
    } else {
      // Fallback to mock data
      dispatch(updateMockData());
      intervalId = setInterval(() => {
        dispatch(updateMockData());
      }, 2000);

      // Clean up
      return () => {
        clearInterval(intervalId);
      };
    }
  }, [dispatch, useLiveData]);

  // Custom setters that also update localStorage
  const handleSetActiveFilter = (filter) => {
    setActiveFilter(filter);
    saveFilterPreference(filter);
  };

  const handleSetSortConfig = (config) => {
    setSortConfig(config);
    saveSortPreference(config);
  };

  // Toggle between live and mock data
  const toggleDataSource = () => {
    if (binanceService) {
      binanceService.disconnect();
    }
    const newValue = !useLiveData;
    setUseLiveData(newValue);
    saveDataSourcePreference(newValue);
  };

  return (
    <AppContainer>
      <Header />
      <MainContent>
        <TopSection>
          <SectionTitle>Cryptocurrency Prices by Market Cap</SectionTitle>
          <Controls>
            <ConnectionStatus />
            <ToggleButton onClick={toggleDataSource}>
              {useLiveData ? 'Switch to Mock Data' : 'Connect to Binance'}
            </ToggleButton>
            <ThemeToggle />
          </Controls>
        </TopSection>

        <FilterSort
          activeFilter={activeFilter}
          setActiveFilter={handleSetActiveFilter}
          sortConfig={sortConfig}
          setSortConfig={handleSetSortConfig}
          dataSource={dataSource}
          lastVisit={lastVisit}
        />

        <CryptoTable
          activeFilter={activeFilter}
          sortConfig={sortConfig}
        />
      </MainContent>
      <Footer>
        <FooterText>
          © 2025 CryptoTracker. {useLiveData
            ? 'Data provided by Binance WebSocket API.'
            : 'Using simulated data for demonstration purposes.'}
        </FooterText>
      </Footer>
    </AppContainer>
  );
}

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--color-background);
  font-family: 'Inter', sans-serif;
`;

const MainContent = styled.main`
  flex: 1;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 0 1rem 2rem;
`;

const TopSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  @media (max-width: 768px) {
    width: 100%;
    flex-direction: column;
    align-items: flex-start;
  }
`;

const ToggleButton = styled.button`
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #2d4fd0;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0;
`;

const Footer = styled.footer`
  background-color: var(--color-card);
  padding: 1.5rem;
  text-align: center;
  border-top: 1px solid var(--color-border);
  margin-top: 2rem;
`;

const FooterText = styled.p`
  color: var(--color-text-tertiary);
  font-size: 0.875rem;
  margin: 0;
`;

export default App
