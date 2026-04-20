import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../theme/colors';

type Props = {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
  rightElement?: React.ReactNode;
};

export const Header: React.FC<Props> = ({ title, showBack, onBack, rightElement }) => (
  <View style={styles.container}>
    {showBack ? (
      <TouchableOpacity style={styles.backBtn} onPress={onBack}>
        <Text style={styles.backText}>←</Text>
      </TouchableOpacity>
    ) : (
      <View style={styles.placeholder} />
    )}
    <Text style={styles.title} numberOfLines={1}>{title}</Text>
    {rightElement || <View style={styles.placeholder} />}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 4,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: COLORS.card,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  backText: {
    fontSize: 22,
    color: COLORS.text,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 12,
  },
  placeholder: {
    width: 40,
  },
});
