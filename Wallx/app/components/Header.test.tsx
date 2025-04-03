import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import '@testing-library/jest-native/extend-expect';
import Header from './Header';
import { useRouter } from 'expo-router';

jest.mock('expo-router', () => ({
  useRouter: jest.fn(() => ({
    back: jest.fn(),
  })),
}));

describe('Header Component', () => {
  const mockSearchPress = jest.fn();
  const mockNotificationPress = jest.fn();

  test('renders title correctly', () => {
    render(<Header title="Test Header" />);
    expect(screen.getByText('Test Header')).toBeTruthy();
  });

  test('shows back button when showBackButton is true', () => {
    render(<Header title="Test" showBackButton />);
    expect(screen.getByTestId('back-button')).toBeTruthy();
  });

  test('does not show back button by default', () => {
    render(<Header title="Test" />);
    expect(screen.queryByTestId('back-button')).toBeNull();
  });

  test('calls router.back when back button is pressed', () => {
    const { back } = useRouter();
    render(<Header title="Test" showBackButton />);
    fireEvent.press(screen.getByTestId('back-button'));
    expect(back).toHaveBeenCalled();
  });

  test('shows search icon when showSearch is true', () => {
    render(<Header title="Test" showSearch />);
    expect(screen.getByTestId('search-icon')).toBeTruthy();
  });

  test('calls onSearchPress when search icon is pressed', () => {
    render(
      <Header 
        title="Test" 
        showSearch 
        onSearchPress={mockSearchPress} 
      />
    );
    fireEvent.press(screen.getByTestId('search-icon'));
    expect(mockSearchPress).toHaveBeenCalled();
  });

  test('shows notification icon when showNotification is true', () => {
    render(<Header title="Test" showNotification />);
    expect(screen.getByTestId('notification-icon')).toBeTruthy();
  });

  test('calls onNotificationPress when notification icon is pressed', () => {
    render(
      <Header 
        title="Test" 
        showNotification 
        onNotificationPress={mockNotificationPress} 
      />
    );
    fireEvent.press(screen.getByTestId('notification-icon'));
    expect(mockNotificationPress).toHaveBeenCalled();
  });

  test('applies dark mode styles', () => {
    render(<Header title="Test" />);
    const container = screen.getByTestId('header-container');
    expect(container).toHaveStyle({ backgroundColor: '#1f2937' });
  });
});