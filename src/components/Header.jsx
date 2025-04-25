import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import PriceDisplay from './PriceDisplay';

const Header = () => {
  const [animateValue, setAnimateValue] = useState(false);
  const [currentValue, setCurrentValue] = useState(50000);

  // Simulate price changes for the header animation
  useEffect(() => {
    const interval = setInterval(() => {
      const change = Math.random() > 0.5 ? 1 : -1;
      const amount = Math.random() * 500;
      setCurrentValue(prev => prev + (change * amount));
      setAnimateValue(prev => !prev);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <HeaderContainer>
      <HeaderContent>
        <LeftSection>
          <Logo>
            <LogoIcon>
              <CryptoIcon>₿</CryptoIcon>
            </LogoIcon>
            <LogoText>CryptoTracker</LogoText>
          </Logo>
          <Subtitle>Real-time cryptocurrency price tracker</Subtitle>
          <HeaderStats>
            <StatItem>
              <StatLabel>Cryptos</StatLabel>
              <StatValue>13,432</StatValue>
            </StatItem>
            <StatItem>
              <StatLabel>Exchanges</StatLabel>
              <StatValue>430</StatValue>
            </StatItem>
            <StatItem>
              <StatLabel>Market Cap</StatLabel>
              <StatValue>$2.11T</StatValue>
            </StatItem>
          </HeaderStats>
        </LeftSection>

        <RightSection>
          <PriceWidget $animate={animateValue}>
            <WidgetTitle>Bitcoin Price</WidgetTitle>
            <div className="price-container">
              <PriceDisplay
                price={currentValue}
                priceChange={currentValue - 50000}
                percentChange={((currentValue - 50000) / 50000) * 100}
                symbol="$"
                showSymbol={true}
              />
            </div>
          </PriceWidget>
        </RightSection>
      </HeaderContent>
    </HeaderContainer>
  );
};

// Animations
const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const valueChange = keyframes`
  0% { transform: translateY(0); opacity: 1; }
  50% { transform: translateY(-10px); opacity: 0; }
  51% { transform: translateY(10px); opacity: 0; }
  100% { transform: translateY(0); opacity: 1; }
`;

const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

// Styled Components
const HeaderContainer = styled.header`
  padding: 2rem 0;
  background: linear-gradient(135deg, var(--color-header-gradient-start), var(--color-header-gradient-end));
  color: white;
  border-radius: 0 0 20px 20px;
  margin-bottom: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  position: relative;
  overflow: hidden;

  &:before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 70%);
    opacity: 0.5;
    z-index: 0;
  }
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 2rem;
  }
`;

const LeftSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${fadeIn} 1s ease-out;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const LogoIcon = styled.div`
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const CryptoIcon = styled.span`
  font-size: 1.8rem;
  color: #f7931a;
  animation: ${rotate} 10s linear infinite;
`;

const LogoText = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0;
  background: linear-gradient(to right, #fff, #ddd);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  opacity: 0.9;
  margin: 0;
`;

const HeaderStats = styled.div`
  display: flex;
  gap: 2rem;
  margin-top: 1rem;

  @media (max-width: 768px) {
    gap: 1rem;
    flex-wrap: wrap;
  }
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const StatLabel = styled.span`
  font-size: 0.875rem;
  opacity: 0.8;
`;

const StatValue = styled.span`
  font-size: 1.25rem;
  font-weight: 600;
`;

const PriceWidget = styled.div`
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(5px);
  padding: 1.5rem;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 240px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    animation: ${pulse} 2s infinite;
  }

  .price-container {
    width: 100%;
    animation: ${props => props.$animate ? valueChange : 'none'} 0.5s ease;
  }
`;

const WidgetTitle = styled.h3`
  font-size: 1rem;
  margin: 0 0 0.5rem 0;
  opacity: 0.9;
  text-align: center;
`;

export default Header;
