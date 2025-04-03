import React from 'react';
import { render, screen } from '@testing-library/react-native';
import '@testing-library/jest-native/extend-expect';
import LoadingSkeleton from './LoadingSkeleton';

describe('LoadingSkeleton Component', () => {
  test('renders 6 skeleton items', () => {
    render(<LoadingSkeleton />);
    const skeletons = screen.getAllByTestId('skeleton-item');
    expect(skeletons).toHaveLength(6);
  });

  test('applies pulse animation class', () => {
    render(<LoadingSkeleton />);
    const firstSkeleton = screen.getAllByTestId('skeleton-item')[0];
    expect(firstSkeleton).toHaveStyle({ animationName: 'pulse' });
  });

  test('applies dark mode styles', () => {
    render(<LoadingSkeleton />);
    const firstSkeleton = screen.getAllByTestId('skeleton-item')[0];
    expect(firstSkeleton).toHaveStyle({ backgroundColor: '#374151' });
  });

  test('has correct layout structure', () => {
    render(<LoadingSkeleton />);
    const grid = screen.getByTestId('skeleton-grid');
    expect(grid).toBeTruthy();
    expect(grid.props.className).toContain('grid-cols-3');
  });
});