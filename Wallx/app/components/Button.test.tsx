import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import '@testing-library/jest-native/extend-expect';
import Button from './Button';

describe('Button Component', () => {
  const mockPress = jest.fn();

  test('renders primary button with correct styling', () => {
    render(<Button title="Click me" onPress={mockPress} variant="primary" />);
    const button = screen.getByText('Click me');
    expect(button.parent).toHaveStyle({ backgroundColor: '#2563eb' });
  });

  test('renders secondary button with correct styling', () => {
    render(<Button title="Cancel" onPress={mockPress} variant="secondary" />);
    const button = screen.getByText('Cancel');
    expect(button.parent).toHaveStyle({ backgroundColor: '#4b5563' });
  });

  test('renders outline variant correctly', () => {
    render(<Button title="Outline" onPress={mockPress} variant="outline" />);
    const button = screen.getByText('Outline');
    expect(button.parent).toHaveStyle({ borderWidth: 1, borderColor: '#2563eb' });
  });

  test('disables button when disabled prop is true', () => {
    render(<Button title="Disabled" onPress={mockPress} disabled />);
    const button = screen.getByText('Disabled').parent;
    expect(button).toBeDisabled();
    expect(button).toHaveStyle({ opacity: 0.5 });
  });

  test('shows loading indicator when loading', () => {
    render(<Button title="Loading" onPress={mockPress} loading />);
    expect(screen.getByTestId('activity-indicator')).toBeTruthy();
    expect(screen.getByText('Loading')).not.toBeTruthy();
  });

  test('triggers onPress callback when clicked', () => {
    render(<Button title="Click me" onPress={mockPress} />);
    fireEvent.press(screen.getByText('Click me').parent);
    expect(mockPress).toHaveBeenCalled();
  });

  test('does not trigger onPress when disabled', () => {
    render(<Button title="Disabled" onPress={mockPress} disabled />);
    fireEvent.press(screen.getByText('Disabled').parent);
    expect(mockPress).not.toHaveBeenCalled();
  });

  test('applies custom class names', () => {
    render(
      <Button 
        title="Custom" 
        onPress={mockPress} 
        className="custom-class" 
        textClassName="custom-text-class" 
      />
    );
    expect(screen.getByText('Custom')).toBeTruthy();
  });

  test('renders different sizes correctly', () => {
    render(<Button title="Small" onPress={mockPress} size="sm" />);
    const smallButton = screen.getByText('Small');
    expect(smallButton).toHaveStyle({ fontSize: 14 });

    render(<Button title="Large" onPress={mockPress} size="lg" />);
    const largeButton = screen.getByText('Large');
    expect(largeButton).toHaveStyle({ fontSize: 18 });
  });
});
