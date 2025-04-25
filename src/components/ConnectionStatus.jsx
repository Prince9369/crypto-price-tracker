import React from 'react';
import styled, { keyframes } from 'styled-components';
import { useSelector } from 'react-redux';
import { selectStatus, selectDataSource } from '../features/crypto/cryptoSlice';

const ConnectionStatus = () => {
  const status = useSelector(selectStatus);
  const dataSource = useSelector(selectDataSource);

  const getStatusColor = () => {
    switch (status) {
      case 'succeeded':
        return '#16c784';
      case 'loading':
        return '#f7931a';
      case 'failed':
        return '#ea3943';
      default:
        return '#808a9d';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'succeeded':
        return dataSource === 'live'
          ? 'Connected to Binance WebSocket'
          : 'Using simulated data';
      case 'loading':
        return 'Connecting...';
      case 'failed':
        return 'Connection failed';
      default:
        return 'Initializing...';
    }
  };

  return (
    <StatusContainer>
      <StatusIndicator $color={getStatusColor()} $status={status} />
      <StatusText>{getStatusText()}</StatusText>
      {dataSource === 'live' && (
        <LiveBadge>LIVE</LiveBadge>
      )}
    </StatusContainer>
  );
};

const pulse = keyframes`
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.1); opacity: 0.8; }
  100% { transform: scale(1); opacity: 1; }
`;

const StatusContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  margin-bottom: 1rem;
`;

const StatusIndicator = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${props => props.$color};
  animation: ${props => props.$status === 'loading' ? pulse : 'none'} 1.5s infinite;
`;

const StatusText = styled.span`
  font-size: 14px;
  color: #fff;
`;

const LiveBadge = styled.span`
  background-color: #ea3943;
  color: white;
  font-size: 10px;
  font-weight: bold;
  padding: 2px 6px;
  border-radius: 4px;
  margin-left: 8px;
`;

export default ConnectionStatus;
