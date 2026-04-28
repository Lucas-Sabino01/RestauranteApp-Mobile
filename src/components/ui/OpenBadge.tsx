import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import type { ThemeColors } from '../../theme/colors';

type OpenBadgeProps = {
  isOpen: boolean;
  label: string;
  size?: 'small' | 'normal';
};

export const OpenBadge: React.FC<OpenBadgeProps> = ({ isOpen, label, size = 'normal' }) => {
  const { colors } = useTheme();
  const styles = getStyles(colors);

  const isSmall = size === 'small';
  return (
    <View style={[
      styles.badge,
      isOpen ? styles.badgeOpen : styles.badgeClosed,
      isSmall && styles.badgeSmall,
    ]}>
      <View style={[styles.dot, isOpen ? styles.dotOpen : styles.dotClosed]} />
      <Text style={[
        styles.text,
        isOpen ? styles.textOpen : styles.textClosed,
        isSmall && styles.textSmall,
      ]}>
        {label}
      </Text>
    </View>
  );
};

const getStyles = (colors: ThemeColors) => StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 5,
  },
  badgeSmall: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    gap: 4,
  },
  badgeOpen: {
    backgroundColor: colors.successLight,
  },
  badgeClosed: {
    backgroundColor: 'rgba(231, 76, 60, 0.15)',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  dotOpen: {
    backgroundColor: colors.success,
  },
  dotClosed: {
    backgroundColor: colors.danger,
  },
  text: {
    fontSize: 11,
    fontWeight: '700',
  },
  textSmall: {
    fontSize: 9,
  },
  textOpen: {
    color: colors.success,
  },
  textClosed: {
    color: colors.danger,
  },
});
