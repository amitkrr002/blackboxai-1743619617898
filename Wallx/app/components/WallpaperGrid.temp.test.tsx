import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import WallpaperGrid from './WallpaperGrid';
import * as unsplash from '../services/unsplash';

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

jest.mock('../services/unsplash', () => ({
  getRandomPhotos: jest.fn(),
  getPhotosByCategory: jest.fn()
}));

describe('WallpaperGrid Component', () => {
  beforeEach(() => {
    (unsplash.getRandomPhotos as jest.Mock).mockResolvedValue(mockWallpapers);
    (unsplash.getPhotosByCategory as jest.Mock).mockResolvedValue(mockWallpapers);
  });

  test('renders loading state', () => {
    render(<WallpaperGrid wallpapers={[]} isLoading={true} />);
    expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument();
  });

  test('displays wallpapers', () => {
    render(<WallpaperGrid wallpapers={mockWallpapers} />);
    expect(screen.getAllByRole('img')).toHaveLength(2);
  });

  test('shows error message', async () => {
    (unsplash.getRandomPhotos as jest.Mock).mockRejectedValue(new Error('API Error'));
    render(<WallpaperGrid wallpapers={[]} />);
    await waitFor(() => {
      expect(screen.getByText(/Failed to load wallpapers/)).toBeInTheDocument();
    });
  });

  test('handles infinite scroll', () => {
    const mockEndReached = jest.fn();
    render(<WallpaperGrid wallpapers={mockWallpapers} onEndReached={mockEndReached} />);
    fireEvent.scroll(window, { target: { scrollY: 1000 } });
    expect(mockEndReached).toHaveBeenCalled();
  });

  test('filters by category',
