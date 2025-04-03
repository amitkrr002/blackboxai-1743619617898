import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import '@testing-library/jest-native/extend-expect';
import WallpaperCard from './WallpaperCard';
import { useRouter } from 'expo-router';
import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';

jest.mock('expo-router', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
  })),
}));

jest.mock('expo-file-system', () => ({
  documentDirectory: 'file:///test/',
}));

describe('WallpaperCard Component', () => {
  const mockFavoriteToggle = jest.fn();
  const mockRouterPush = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockRouterPush,
    });
    jest.clearAllMocks();
  });

  test('renders with default props', () => {
    render(<WallpaperCard />);
    expect(screen.getByTestId('wallpaper-card')).toBeTruthy();
    expect(screen.getByText('Abstract Wave')).toBeTruthy();
  });

  test('shows loading indicator while image loads', () => {
    render(<WallpaperCard />);
    expect(screen.getByTestId('loading-indicator')).toBeTruthy();
  });

  test('hides loading indicator after image loads', () => {
    render(<WallpaperCard />);
    fireEvent(screen.getByTestId('wallpaper-image'), 'load');
    expect(screen.queryByTestId('loading-indicator')).toBeNull();
  });

  test('shows error state when image fails to load', () => {
    render(<WallpaperCard />);
    fireEvent(screen.getByTestId('wallpaper-image'), 'error');
    expect(screen.getByTestId('error-state')).toBeTruthy();
  });

  test('calls onFavoriteToggle when favorite button pressed', () => {
    render(<WallpaperCard onFavoriteToggle={mockFavoriteToggle} />);
    fireEvent.press(screen.getByTestId('favorite-button'));
    expect(mockFavoriteToggle).toHaveBeenCalledWith('wallpaper-1');
  });

  test('navigates to wallpaper detail when pressed', () => {
    render(<WallpaperCard id="test-id" />);
    fireEvent.press(screen.getByTestId('wallpaper-card'));
    expect(mockRouterPush).toHaveBeenCalledWith('/wallpaper/test-id');
  });

  test('does not navigate when in error state', () => {
    render(<WallpaperCard />);
    fireEvent(screen.getByTestId('wallpaper-image'), 'error');
    fireEvent.press(screen.getByTestId('wallpaper-card'));
    expect(mockRouterPush).not.toHaveBeenCalled();
  });

  test('processes image URL correctly for mobile', () => {
    Platform.OS = 'ios';
    render(
      <WallpaperCard imageUrl="http://example.com/image.jpg" />
    );
    const image = screen.getByTestId('wallpaper-image');
    expect(image.props.source.uri).toContain('https://example.com/image.jpg?q=80&w=400');
  });

  test('applies platform-specific shadow styles', () => {
    Platform.OS = 'ios';
    const { rerender } = render(<WallpaperCard />);
    expect(screen.getByTestId('wallpaper-card')).toHaveStyle({
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
    });

    Platform.OS = 'android';
    rerender(<WallpaperCard />);
    expect(screen.getByTestId('wallpaper-card')).toHaveStyle({
      elevation: 3,
    });
  });

  test('applies dark mode styles', () => {
    render(<WallpaperCard />);
    expect(screen.getByTestId('wallpaper-card')).toHaveStyle({
      backgroundColor: '#1f2937',
    });
  });
});