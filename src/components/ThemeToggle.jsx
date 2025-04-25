import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { loadFromLocalStorage, saveToLocalStorage } from '../services/localStorageService';

const THEME_KEY = 'crypto_tracker_theme';

const ThemeToggle = () => {
  // Load theme preference from localStorage
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = loadFromLocalStorage(THEME_KEY, 'dark');
    return savedTheme === 'dark';
  });

  // Apply theme when component mounts or theme changes
  useEffect(() => {
    const theme = isDarkMode ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
    saveToLocalStorage(THEME_KEY, theme);
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  return (
    <ToggleContainer>
      <ToggleLabel>
        <LightIcon>☀️</LightIcon>
        <ToggleSwitch>
          <ToggleInput 
            type="checkbox" 
            checked={isDarkMode}
            onChange={toggleTheme}
          />
          <Slider />
        </ToggleSwitch>
        <DarkIcon>🌙</DarkIcon>
      </ToggleLabel>
    </ToggleContainer>
  );
};

const ToggleContainer = styled.div`
  margin-left: 1rem;
`;

const ToggleLabel = styled.label`
  display: flex;
  align-items: center;
  cursor: pointer;
  gap: 0.5rem;
`;

const LightIcon = styled.span`
  font-size: 1rem;
`;

const DarkIcon = styled.span`
  font-size: 1rem;
`;

const ToggleSwitch = styled.div`
  position: relative;
  display: inline-block;
  width: 40px;
  height: 20px;
`;

const ToggleInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;
  
  &:checked + span {
    background-color: var(--color-primary);
  }
  
  &:checked + span:before {
    transform: translateX(20px);
  }
`;

const Slider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.4s;
  border-radius: 34px;
  
  &:before {
    position: absolute;
    content: "";
    height: 16px;
    width: 16px;
    left: 2px;
    bottom: 2px;
    background-color: white;
    transition: 0.4s;
    border-radius: 50%;
  }
`;

export default ThemeToggle;
