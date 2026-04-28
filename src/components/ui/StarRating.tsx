import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import type { ThemeColors } from '../../theme/colors';

type StarRatingProps = {
  rating: number;
  size?: number;
  interactive?: boolean;
  onChange?: (rating: number) => void;
};

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  size = 18,
  interactive = false,
  onChange,
}) => {
  const { colors } = useTheme();
  const styles = getStyles(colors);

  const stars = [1, 2, 3, 4, 5];

  return (
    <View style={styles.container}>
      {stars.map((star) => {
        const iconName =
          star <= Math.floor(rating)
            ? 'star'
            : star - 0.5 <= rating
            ? 'star-half'
            : 'star-outline';

        if (interactive) {
          return (
            <TouchableOpacity
              key={star}
              onPress={() => onChange?.(star)}
              activeOpacity={0.6}
              hitSlop={{ top: 6, bottom: 6, left: 2, right: 2 }}
            >
              <Ionicons name={iconName} size={size} color={colors.star} />
            </TouchableOpacity>
          );
        }

        return <Ionicons key={star} name={iconName} size={size} color={colors.star} />;
      })}
    </View>
  );
};

const getStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
});
