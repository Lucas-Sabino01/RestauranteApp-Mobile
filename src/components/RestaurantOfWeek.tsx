import React, { useRef, useEffect, useMemo } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import type { ThemeColors } from '../theme/colors';
import { FONTS } from '../theme/fonts';
import { OpenBadge } from './ui/OpenBadge';
import { getOpenStatus } from '../utils';
import type { Estabelecimento } from '../types';

type Props = {
  estabelecimento: Estabelecimento;
  onPress: () => void;
};

const RestaurantOfWeekInner: React.FC<Props> = ({ estabelecimento, onPress }) => {
  const { colors, isDark } = useTheme();
  const styles = useMemo(() => getStyles(colors, isDark), [colors, isDark]);

  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const status = getOpenStatus(estabelecimento.horario);

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, [scaleAnim, fadeAnim]);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
      <TouchableOpacity activeOpacity={0.85} onPress={onPress}
        accessibilityLabel={`Destaque da semana: ${estabelecimento.nome}, avaliação ${estabelecimento.avaliacao}`}
        accessibilityRole="button"
      >
        <Image source={{ uri: estabelecimento.imagem }} style={styles.image} />
        <View style={styles.overlay} />

        <View style={styles.badgeRow}>
          <View style={styles.weekBadge}>
            <Ionicons name="trophy" size={12} color={colors.star} />
            <Text style={styles.weekBadgeText}>DESTAQUE DA SEMANA</Text>
          </View>
          <OpenBadge isOpen={status.isOpen} label={status.label} size="small" />
        </View>

        <View style={styles.content}>
          <Text style={styles.nome}>{estabelecimento.nome}</Text>
          <Text style={styles.descricao} numberOfLines={2}>{estabelecimento.descricao}</Text>

          <View style={styles.infoRow}>
            <View style={styles.infoPill}>
              <Ionicons name="star" size={14} color={colors.star} />
              <Text style={styles.infoText}>{estabelecimento.avaliacao}</Text>
            </View>
            <View style={styles.infoPill}>
              <Ionicons name="location-outline" size={14} color={colors.accent} />
              <Text style={styles.infoText}>{estabelecimento.bairro}</Text>
            </View>
            <View style={styles.infoPill}>
              <Text style={styles.infoText}>{estabelecimento.faixaPreco}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export const RestaurantOfWeek = React.memo(RestaurantOfWeekInner);
const getStyles = (colors: ThemeColors, isDark: boolean) => StyleSheet.create({
  container: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.accent,
  },
  image: {
    width: '100%',
    height: 200,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: isDark ? 'rgba(27, 16, 21, 0.45)' : 'rgba(0, 0, 0, 0.3)',
  },
  badgeRow: {
    position: 'absolute',
    top: 14,
    left: 14,
    right: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  weekBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: isDark ? 'rgba(27, 16, 21, 0.8)' : 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 5,
    borderWidth: 1,
    borderColor: colors.star,
  },
  weekBadgeText: {
    color: colors.star,
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  content: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
  },
  nome: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.white,
    fontFamily: FONTS.bold,
    marginBottom: 4,
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  descricao: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 18,
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    gap: 8,
  },
  infoPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: isDark ? 'rgba(27, 16, 21, 0.7)' : 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 4,
  },
  infoText: {
    fontSize: 12,
    color: colors.white,
    fontWeight: '600',
  },
});
