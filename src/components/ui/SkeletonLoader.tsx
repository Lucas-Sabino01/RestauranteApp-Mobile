import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import type { ThemeColors } from '../../theme/colors';

type Props = {
  width: number | string;
  height: number;
  borderRadius?: number;
  style?: ViewStyle;
};

export const SkeletonLoader: React.FC<Props> = ({
  width,
  height,
  borderRadius = 8,
  style,
}) => {
  const { colors } = useTheme();

  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.7,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        {
          width: width as any,
          height,
          borderRadius,
          backgroundColor: colors.cardLight,
          opacity,
        },
        style,
      ]}
    />
  );
};

export const EstablishmentCardSkeleton: React.FC = () => {
  const { colors } = useTheme();
  const styles = getSkeletonStyles(colors);
  return (
    <View style={styles.horizontalCard}>
      <SkeletonLoader width={110} height={130} borderRadius={0} />
      <View style={styles.info}>
        <SkeletonLoader width="80%" height={16} borderRadius={4} />
        <SkeletonLoader width="50%" height={12} borderRadius={4} style={{ marginTop: 6 }} />
        <View style={[styles.row, { marginTop: 8 }]}>
          <SkeletonLoader width={70} height={14} borderRadius={4} />
          <SkeletonLoader width={80} height={14} borderRadius={4} />
        </View>
        <View style={[styles.row, { marginTop: 8 }]}>
          <SkeletonLoader width={55} height={20} borderRadius={8} />
          <SkeletonLoader width={55} height={20} borderRadius={8} />
          <SkeletonLoader width={55} height={20} borderRadius={8} />
        </View>
      </View>
    </View>
  );
};

export const EstablishmentCardVerticalSkeleton: React.FC = () => {
  const { colors } = useTheme();
  const styles = getSkeletonStyles(colors);
  return (
    <View style={styles.verticalCard}>
      <SkeletonLoader width={180} height={120} borderRadius={0} />
      <View style={{ padding: 12 }}>
        <SkeletonLoader width="80%" height={14} borderRadius={4} />
        <SkeletonLoader width="50%" height={11} borderRadius={4} style={{ marginTop: 6 }} />
        <View style={[styles.row, { marginTop: 8 }]}>
          <SkeletonLoader width={50} height={13} borderRadius={4} />
          <SkeletonLoader width={70} height={13} borderRadius={4} />
        </View>
      </View>
    </View>
  );
};

const getSkeletonStyles = (colors: ThemeColors) => StyleSheet.create({
  horizontalCard: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 16,
    marginBottom: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  info: {
    flex: 1,
    padding: 14,
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  verticalCard: {
    width: 180,
    backgroundColor: colors.card,
    borderRadius: 16,
    marginRight: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
});
