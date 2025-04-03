import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import WallpaperGrid from './WallpaperGrid';
import * as unsplash from '../services/unsplash';

// Mock data
const mockWallpapers = [
  {
    id: '1',
    imageUrl: 'https://example.com/image1.jpg',
    title: 'Wallpaper 1',
    isFavorite: false
  },
  {
    id: '2',
    imageUrl: 'https://example.com/image2.jpg',
    title: 'Wallpaper 2',
    isFavorite: true
  }
];

// Mock the unsplash service
jest.mock('../services/unsplash', () => ({
  getRandomPhotos: jest.fn(),
  getPhotosByCategory: jest.fn()
}));

describe('WallpaperGrid Component', () => {
  beforeEach(() => {
    (unsplash.getRandomPhotos as jest.Mock).mockResolvedValue(mockWallpapers);
    (unsplash.getPhotosByCategory as jest.Mock).mockResolvedValue(mockWallpapers);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders loading skeleton initially', () => {
    render(<WallpaperGrid isLoading={true} />);
    expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument();
  });

  test('displays wallpapers after loading', async () => {
    render(<WallpaperGrid />);
    await waitFor(() => {
      expect(screen.getAllByRole('img')).toHaveLength(2);
    });
  });

  test('handles error state', async () => {
    (unsplash.getRandomPhotos as jest.Mock).mockRejectedValue(new Error('API Error'));
    render(<WallpaperGrid />);
    await waitFor(() => {
      expect(screen.getByText(/Failed to load wallpapers/)).toBeInTheDocument();
    });
  });

  test('triggers onEndReached when scrolling', async () => {
    const mockEndReached = jest.fn();
    render(<WallpaperGrid onEndReached={mockEndReached} />);
    
    await waitFor(() => {
      fireEvent.scroll(window, { target: { scrollY: 1000 } });
      expect(mockEndReached).toHaveBeenCalled();
    });
  });

  test('filters by category when provided', async () => {
    render(<WallpaperGrid category="nature" />);
    await waitFor(() => {
      expect(unsplash.getPhotosByCategory).toHaveBeenCalledWith('nature');
    });
  });

  test('propagates favorite toggle events', async () => {
    const mockToggle = jest.fn();
    render(<WallpaperGrid onFavoriteToggle={mockToggle} />);
    
    await waitFor(() => {
      const favoriteButtons = screen.getAllByLabelText('Toggle favorite');
      fireEvent.click(favoriteButtons[0]);
      expect(mockToggle).toHaveBeenCalledWith('1');
    });
  });
});