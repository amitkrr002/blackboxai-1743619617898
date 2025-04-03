import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import '@testing-library/jest-native/extend-expect';
import AISearchModal from './AISearchModal';

describe('AISearchModal Component', () => {
  const mockOnClose = jest.fn();
  const mockOnGenerate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders when visible', () => {
    render(
      <AISearchModal 
        isVisible={true} 
        onClose={mockOnClose} 
        onGenerate={mockOnGenerate} 
      />
    );
    expect(screen.getByText('AI Wallpaper Generator')).toBeTruthy();
  });

  test('does not render when not visible', () => {
    render(
      <AISearchModal 
        isVisible={false} 
        onClose={mockOnClose} 
        onGenerate={mockOnGenerate} 
      />
    );
    expect(screen.queryByText('AI Wallpaper Generator')).toBeNull();
  });

  test('calls onClose when close button pressed', () => {
    render(
      <AISearchModal 
        isVisible={true} 
        onClose={mockOnClose} 
        onGenerate={mockOnGenerate} 
      />
    );
    fireEvent.press(screen.getByTestId('close-button'));
    expect(mockOnClose).toHaveBeenCalled();
  });

  test('handles prompt input', () => {
    render(
      <AISearchModal 
        isVisible={true} 
        onClose={mockOnClose} 
        onGenerate={mockOnGenerate} 
      />
    );
    const input = screen.getByPlaceholderText('Type your prompt here...');
    fireEvent.changeText(input, 'test prompt');
    expect(input.props.value).toBe('test prompt');
  });

  test('sets prompt when keyword pressed', () => {
    render(
      <AISearchModal 
        isVisible={true} 
        onClose={mockOnClose} 
        onGenerate={mockOnGenerate} 
      />
    );
    fireEvent.press(screen.getByText('Nature'));
    expect(screen.getByPlaceholderText('Type your prompt here...').props.value).toBe('Nature');
  });

  test('calls onGenerate with prompt when generate pressed', () => {
    render(
      <AISearchModal 
        isVisible={true} 
        onClose={mockOnClose} 
        onGenerate={mockOnGenerate} 
      />
    );
    const input = screen.getByPlaceholderText('Type your prompt here...');
    fireEvent.changeText(input, 'test prompt');
    fireEvent.press(screen.getByText('Generate Wallpaper'));
    expect(mockOnGenerate).toHaveBeenCalledWith('test prompt');
  });

  test('shows loading state when generating', () => {
    render(
      <AISearchModal 
        isVisible={true} 
        onClose={mockOnClose} 
        onGenerate={mockOnGenerate} 
      />
    );
    fireEvent.changeText(
      screen.getByPlaceholderText('Type your prompt here...'), 
      'test prompt'
    );
    fireEvent.press(screen.getByText('Generate Wallpaper'));
    expect(screen.getByTestId('loading-indicator')).toBeTruthy();
  });

  test('disables generate button when prompt is empty', () => {
    render(
      <AISearchModal 
        isVisible={true} 
        onClose={mockOnClose} 
        onGenerate={mockOnGenerate} 
      />
    );
    const button = screen.getByTestId('generate-button');
    expect(button).toHaveStyle({ opacity: 0.7 });
  });

  test('applies dark mode styles', () => {
    render(
      <AISearchModal 
        isVisible={true} 
        onClose={mockOnClose} 
        onGenerate={mockOnGenerate} 
      />
    );
    const container = screen.getByTestId('modal-container');
    expect(container).toHaveStyle({ backgroundColor: '#111827' });
  });
});