import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ThemeToggle from './ThemeToggle';

describe('ThemeToggle component', () => {
  // Mock localStorage
  const localStorageMock = (() => {
    let store = {};
    return {
      getItem: vi.fn(key => store[key] || null),
      setItem: vi.fn((key, value) => {
        store[key] = value.toString();
      }),
      removeItem: vi.fn(key => {
        delete store[key];
      }),
      clear: vi.fn(() => {
        store = {};
      })
    };
  })();

  // Mock document.documentElement
  const documentElementMock = {
    setAttribute: vi.fn()
  };

  beforeEach(() => {
    // Replace the global localStorage with our mock
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true
    });
    
    // Replace document.documentElement with our mock
    Object.defineProperty(document, 'documentElement', {
      value: documentElementMock,
      writable: true
    });
    
    // Clear the mock localStorage before each test
    localStorageMock.clear();
    
    // Reset all mocks
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders the theme toggle switch', () => {
    render(<ThemeToggle />);
    
    // Check if the light and dark icons are rendered
    expect(screen.getByText('☀️')).toBeInTheDocument();
    expect(screen.getByText('🌙')).toBeInTheDocument();
    
    // Check if the toggle switch is rendered
    const toggleSwitch = screen.getByRole('checkbox');
    expect(toggleSwitch).toBeInTheDocument();
  });

  it('loads theme preference from localStorage', () => {
    // Mock localStorage to return 'light' theme
    localStorageMock.getItem.mockReturnValueOnce(JSON.stringify('light'));
    
    render(<ThemeToggle />);
    
    // Check if localStorage was called with the correct key
    expect(localStorageMock.getItem).toHaveBeenCalled();
    
    // Check if the toggle is unchecked for light theme
    const toggleSwitch = screen.getByRole('checkbox');
    expect(toggleSwitch).not.toBeChecked();
    
    // Check if document.documentElement.setAttribute was called with the correct theme
    expect(documentElementMock.setAttribute).toHaveBeenCalledWith('data-theme', 'light');
  });

  it('toggles theme when clicked', () => {
    // Start with light theme
    localStorageMock.getItem.mockReturnValueOnce(JSON.stringify('light'));
    
    render(<ThemeToggle />);
    
    // Initially, it should be light theme
    expect(documentElementMock.setAttribute).toHaveBeenCalledWith('data-theme', 'light');
    
    // Click the toggle switch
    const toggleSwitch = screen.getByRole('checkbox');
    fireEvent.click(toggleSwitch);
    
    // After clicking, it should switch to dark theme
    expect(documentElementMock.setAttribute).toHaveBeenCalledWith('data-theme', 'dark');
    expect(localStorageMock.setItem).toHaveBeenCalledWith('crypto_tracker_theme', JSON.stringify('dark'));
    
    // Click again to switch back to light theme
    fireEvent.click(toggleSwitch);
    
    // After clicking again, it should switch back to light theme
    expect(documentElementMock.setAttribute).toHaveBeenCalledWith('data-theme', 'light');
    expect(localStorageMock.setItem).toHaveBeenCalledWith('crypto_tracker_theme', JSON.stringify('light'));
  });

  it('defaults to dark theme if no preference is stored', () => {
    // Mock localStorage to return null (no stored preference)
    localStorageMock.getItem.mockReturnValueOnce(null);
    
    render(<ThemeToggle />);
    
    // Check if the toggle is checked for dark theme
    const toggleSwitch = screen.getByRole('checkbox');
    expect(toggleSwitch).toBeChecked();
    
    // Check if document.documentElement.setAttribute was called with dark theme
    expect(documentElementMock.setAttribute).toHaveBeenCalledWith('data-theme', 'dark');
  });
});
