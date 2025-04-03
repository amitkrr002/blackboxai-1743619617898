import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import '@testing-library/jest-native/extend-expect';
import BottomNavBar from './BottomNavBar';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

jest.mock('expo-router', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    back: jest.fn(),
  })),
}));

jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(),
  ImpactFeedbackStyle: {
    Light: 'LIGHT',
  },
}));

describe('BottomNavBar Component', () => {
  const mockSearchPress = jest.fn();
  const mockRouterPush = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockRouterPush,
    });
    jest.clearAllMocks();
  });

  test('renders all navigation buttons', () => {
    render(<BottomNavBar />);
    expect(screen.getByTestId('home-button')).toBeTruthy();
    expect(screen.getByTestId('categories-button')).toBeTruthy();
    expect(screen.getByTestId('ai-search-button')).toBeTruthy();
    expect(screen.getByTestId('favorites-button')).toBeTruthy();
    expect(screen.getByTestId('settings-button')).toBeTruthy();
  });

  test('highlights active route button', () => {
    render(<BottomNavBar currentRoute="categories" />);
    const categoriesButton = screen.getByTestId('categories-button');
    expect(categoriesButton).toHaveStyle({ color: '#3b82f6' });
  });

  test('calls router.push when navigation button pressed', () => {
    render(<BottomNavBar />);
    fireEvent.press(screen.getByTestId('home-button'));
    expect(mockRouterPush).toHaveBeenCalledWith('/');
  });

  test('opens search modal when AI search button pressed', () => {
    render(<BottomNavBar />);
    fireEvent.press(screen.getByTestId('ai-search-button'));
    expect(screen.getByText('AI Wallpaper Generator')).toBeTruthy();
  });

  test('calls onSearchPress when provided', () => {
    render(<BottomNavBar onSearchPress={mockSearchPress} />);
    fireEvent.press(screen.getByTestId('ai-search-button'));
    expect(mockSearchPress).toHaveBeenCalled();
    expect(screen.queryByText('AI Wallpaper Generator')).toBeNull();
  });

  test('handles search prompt input', () => {
    render(<BottomNavBar />);
    fireEvent.press(screen.getByTestId('ai-search-button'));
    const input = screen.getByPlaceholderText('Type your prompt here...');
    fireEvent.changeText(input, 'test prompt');
    expect(input.props.value).toBe('test prompt');
  });

  test('triggers haptics on native platforms', () => {
    Platform.OS = 'ios';
    render(<BottomNavBar />);
    fireEvent.press(screen.getByTestId('home-button'));
    expect(Haptics.impactAsync).toHaveBeenCalledWith('LIGHT');
  });

  test('does not trigger haptics on web', () => {
    Platform.OS = 'web';
    render(<BottomNavBar />);
    fireEvent.press(screen.getByTestId('home-button'));
    expect(Haptics.impactAsync).not.toHaveBeenCalled();
  });

  test('applies dark mode styles', () => {
    render(<BottomNavBar />);
    const container = screen.getByTestId('bottom-nav-container');
    expect(container).toHaveStyle({ backgroundColor: '#111827' });
  });

  test('generates wallpaper with prompt', () => {
    render(<BottomNavBar />);
    fireEvent.press(screen.getByTestId('ai-search-button'));
    const input = screen.getByPlaceholderText('Type your prompt here...');
    fireEvent.changeText(input, 'test prompt');
    fireEvent.press(screen.getByText('Generate Wallpaper'));
    expect(mockRouterPush).toHaveBeenCalledWith('/wallpaper/search-test-prompt');
  });
});