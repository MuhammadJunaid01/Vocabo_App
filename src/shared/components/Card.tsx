// src/shared/components/Card.tsx
import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const Card: React.FC<CardProps> = ({ children, style }) => {
  return <View style={[styles.card, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 8 },
    // shadowOpacity: 0.08,
    // shadowRadius: 16,
    // elevation: 5,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
  },
});