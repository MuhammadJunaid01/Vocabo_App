import React from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableOpacityProps,
} from 'react-native';

interface ButtonProps  extends TouchableOpacityProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  activeOpacity = 0.8,
  ...props
}) => {
  const backgroundColor = {
    primary: '#007AFF',
    secondary: '#E5E5EA',
    danger: '#FF3B30',
  }[variant];

  const textColor = variant === 'primary' || variant === 'danger' ? '#fff' : '#000';

  return (
    <TouchableOpacity
    {...props}
      onPress={onPress}
      disabled={disabled || loading}
      style={[styles.button, { backgroundColor }, (disabled || loading) && styles.disabled]}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <Text style={[styles.text, { color: textColor }]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    minHeight: 48,
    marginVertical: 6,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
  disabled: {
    opacity: 0.5,
  },
});