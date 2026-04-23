import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, ViewStyle } from 'react-native';
import { COLORS } from '../../theme/colors';

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
          backgroundColor: COLORS.cardLight,
          opacity,
        },
        style,
      ]}
    />
  );
};

export const ProductCardSkeleton: React.FC = () => (
  <View style={skeletonStyles.horizontalCard}>
    <SkeletonLoader width={100} height={100} borderRadius={14} />
    <View style={skeletonStyles.info}>
      <SkeletonLoader width="70%" height={16} borderRadius={4} />
      <SkeletonLoader width="100%" height={12} borderRadius={4} style={{ marginTop: 8 }} />
      <SkeletonLoader width="40%" height={12} borderRadius={4} style={{ marginTop: 6 }} />
      <View style={skeletonStyles.row}>
        <SkeletonLoader width={80} height={18} borderRadius={4} />
        <SkeletonLoader width={34} height={34} borderRadius={12} />
      </View>
    </View>
  </View>
);

export const ProductCardVerticalSkeleton: React.FC = () => (
  <View style={skeletonStyles.verticalCard}>
    <SkeletonLoader width={170} height={140} borderRadius={0} />
    <View style={{ padding: 14 }}>
      <SkeletonLoader width="80%" height={14} borderRadius={4} />
      <View style={[skeletonStyles.row, { marginTop: 10 }]}>
        <SkeletonLoader width={70} height={16} borderRadius={4} />
        <SkeletonLoader width={40} height={14} borderRadius={4} />
      </View>
    </View>
  </View>
);

const skeletonStyles = StyleSheet.create({
  horizontalCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    borderRadius: 18,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  info: {
    flex: 1,
    marginLeft: 14,
    justifyContent: 'space-between',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  verticalCard: {
    width: 170,
    backgroundColor: COLORS.card,
    borderRadius: 20,
    marginRight: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
});
