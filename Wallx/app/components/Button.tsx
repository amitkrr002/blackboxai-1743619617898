import React from 'react';
import { View, TouchableOpacity, Text, ActivityIndicator } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  textClassName?: string;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  className = '',
  textClassName = '',
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={{
        ...(variant === 'primary' ? { backgroundColor: '#2563eb' } : {}),
        ...(variant === 'secondary' ? { backgroundColor: '#4b5563' } : {}),
        ...(variant === 'outline' ? { 
          borderWidth: 1,
          borderColor: '#2563eb',
          backgroundColor: 'transparent'
        } : {}),
        ...(disabled ? { opacity: 0.5 } : {}),
        padding: size === 'sm' ? 8 : size === 'lg' ? 16 : 12,
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 100
      }}
    >
      {loading ? (
        <ActivityIndicator 
          color={variant === 'primary' || variant === 'secondary' ? 'white' : 'blue'}
          testID="activity-indicator"
        />
      ) : (
        <Text
          style={{
            color: variant === 'primary' || variant === 'secondary' ? 'white' : '#2563eb',
            fontSize: size === 'sm' ? 14 : size === 'lg' ? 18 : 16,
            fontWeight: '500',
            textAlign: 'center'
          }}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default Button;