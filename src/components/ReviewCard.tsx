import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import type { ThemeColors } from '../theme/colors';
import { FONTS } from '../theme/fonts';
import { StarRating } from './ui/StarRating';
import type { Review } from '../types';

type ReviewCardProps = {
  review: Review;
};

export const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  const { colors } = useTheme();
  const styles = getStyles(colors);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const dia = date.getDate().toString().padStart(2, '0');
    const mes = (date.getMonth() + 1).toString().padStart(2, '0');
    const ano = date.getFullYear();
    return `${dia}/${mes}/${ano}`;
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Image source={{ uri: review.usuario.avatar }} style={styles.avatar} />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{review.usuario.nome}</Text>
          <Text style={styles.date}>{formatDate(review.data)}</Text>
        </View>
        <StarRating rating={review.nota} size={14} />
      </View>
      <Text style={styles.comentario}>{review.comentario}</Text>
    </View>
  );
};

const getStyles = (colors: ThemeColors) => StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    fontFamily: FONTS.semiBold,
    marginBottom: 2,
  },
  date: {
    fontSize: 12,
    color: colors.textMuted,
  },
  comentario: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
    fontFamily: FONTS.regular,
  },
});
