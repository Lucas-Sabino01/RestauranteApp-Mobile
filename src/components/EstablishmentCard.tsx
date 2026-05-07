import React, { useRef, useEffect, useMemo } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import type { ThemeColors } from '../theme/colors';
import { FONTS } from '../theme/fonts';
import { OpenBadge } from './ui/OpenBadge';
import { getOpenStatus, calcularDistancia, formatarDistancia } from '../utils';
import { useLocation } from '../contexts/LocationContext';
import type { Estabelecimento } from '../types';

type EstablishmentCardProps = {
  estabelecimento: Estabelecimento;
  variant: 'horizontal' | 'vertical';
  isFavorito: boolean;
  onToggleFavorito: () => void;
  onPress: () => void;
  index?: number;
};

const EstablishmentCardInner: React.FC<EstablishmentCardProps> = ({
  estabelecimento,
  variant,
  isFavorito,
  onToggleFavorito,
  onPress,
  index = 0,
}) => {
  const { colors } = useTheme();
  const styles = useMemo(() => getStyles(colors), [colors]);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const status = getOpenStatus(estabelecimento.horario);
  const { userLocation } = useLocation();

  const distanciaStr = React.useMemo(() => {
    if (!userLocation) return null;
    const distKm = calcularDistancia(
      userLocation.coords.latitude,
      userLocation.coords.longitude,
      estabelecimento.coordenadas.latitude,
      estabelecimento.coordenadas.longitude
    );
    return formatarDistancia(distKm);
  }, [userLocation, estabelecimento.coordenadas]);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        delay: index * 80,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        delay: index * 80,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim, index]);

  const handleFavorite = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.3,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
    onToggleFavorito();
  };

  if (variant === 'vertical') {
    return (
      <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
        <TouchableOpacity style={styles.verticalCard} activeOpacity={0.8} onPress={onPress}
          accessibilityLabel={`Restaurante ${estabelecimento.nome}, ${estabelecimento.categoria}, avaliação ${estabelecimento.avaliacao}`}
          accessibilityRole="button"
        >
          <Image source={{ uri: estabelecimento.imagem }} style={styles.verticalImage} />
          <Animated.View style={[styles.favButton, { transform: [{ scale: scaleAnim }] }]}>
            <TouchableOpacity onPress={handleFavorite} activeOpacity={0.7}
              accessibilityLabel={isFavorito ? `Remover ${estabelecimento.nome} dos favoritos` : `Adicionar ${estabelecimento.nome} aos favoritos`}
              accessibilityRole="button"
            >
              <Ionicons
                name={isFavorito ? 'heart' : 'heart-outline'}
                size={18}
                color={isFavorito ? colors.danger : colors.white}
              />
            </TouchableOpacity>
          </Animated.View>
          <View style={styles.statusBadgeVertical}>
            <OpenBadge isOpen={status.isOpen} label={status.label} size="small" />
          </View>
          <View style={styles.verticalContent}>
            <Text style={styles.verticalNome} numberOfLines={1}>{estabelecimento.nome}</Text>
            <View style={styles.categoriaRow}>
              <Text style={styles.categoriaText}>{estabelecimento.categoria}</Text>
              <Text style={styles.faixaPrecoText}>{estabelecimento.faixaPreco}</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="star" size={13} color={colors.star} />
              <Text style={styles.avaliacaoText}>{estabelecimento.avaliacao}</Text>
              <Text style={styles.dotSeparator}>·</Text>
              {distanciaStr ? (
                <>
                  <Ionicons name="navigate-outline" size={13} color={colors.textMuted} />
                  <Text style={styles.bairroText} numberOfLines={1}>{distanciaStr}</Text>
                </>
              ) : (
                <>
                  <Ionicons name="location-outline" size={13} color={colors.textMuted} />
                  <Text style={styles.bairroText} numberOfLines={1}>{estabelecimento.bairro}</Text>
                </>
              )}
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  return (
    <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
      <TouchableOpacity style={styles.horizontalCard} activeOpacity={0.8} onPress={onPress}
        accessibilityLabel={`Restaurante ${estabelecimento.nome}, ${estabelecimento.categoria}, avaliação ${estabelecimento.avaliacao}`}
        accessibilityRole="button"
      >
        <Image source={{ uri: estabelecimento.imagem }} style={styles.horizontalImage} />
        <View style={styles.horizontalContent}>
          <View style={styles.horizontalHeader}>
            <Text style={styles.horizontalNome} numberOfLines={1}>{estabelecimento.nome}</Text>
            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
              <TouchableOpacity onPress={handleFavorite} activeOpacity={0.7} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                accessibilityLabel={isFavorito ? `Remover ${estabelecimento.nome} dos favoritos` : `Adicionar ${estabelecimento.nome} aos favoritos`}
                accessibilityRole="button"
              >
                <Ionicons
                  name={isFavorito ? 'heart' : 'heart-outline'}
                  size={20}
                  color={isFavorito ? colors.danger : colors.textMuted}
                />
              </TouchableOpacity>
            </Animated.View>
          </View>
          <View style={styles.categoriaRow}>
            <Text style={styles.categoriaText}>{estabelecimento.categoria}</Text>
            <Text style={styles.faixaPrecoText}>{estabelecimento.faixaPreco}</Text>
            <OpenBadge isOpen={status.isOpen} label={status.label} size="small" />
          </View>
          <View style={styles.horizontalBottom}>
            <View style={styles.infoRow}>
              <Ionicons name="star" size={14} color={colors.star} />
              <Text style={styles.avaliacaoText}>{estabelecimento.avaliacao}</Text>
              <Text style={styles.avaliacaoCount}>({estabelecimento.totalAvaliacoes})</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="location-outline" size={14} color={colors.accent} />
              <Text style={styles.bairroTextH} numberOfLines={1}>
                {estabelecimento.bairro} {distanciaStr ? `· ${distanciaStr}` : ''}
              </Text>
            </View>
          </View>
          {estabelecimento.tags.length > 0 && (
            <View style={styles.tagsRow}>
              {estabelecimento.tags.slice(0, 3).map((tag) => (
                <View key={tag} style={styles.tagBadge}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export const EstablishmentCard = React.memo(EstablishmentCardInner);
const getStyles = (colors: ThemeColors) => StyleSheet.create({
  verticalCard: {
    width: 180,
    backgroundColor: colors.card,
    borderRadius: 16,
    marginRight: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  verticalImage: { width: '100%', height: 120 },
  favButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusBadgeVertical: {
    position: 'absolute',
    top: 8,
    left: 8,
  },
  verticalContent: { padding: 12 },
  verticalNome: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.text,
    fontFamily: FONTS.semiBold,
    marginBottom: 4,
  },
  categoriaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  categoriaText: { fontSize: 12, color: colors.accent, fontWeight: '600' },
  faixaPrecoText: { fontSize: 12, color: colors.textMuted },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  avaliacaoText: { fontSize: 13, color: colors.text, fontWeight: '600' },
  avaliacaoCount: { fontSize: 12, color: colors.textMuted },
  dotSeparator: { fontSize: 12, color: colors.textMuted, marginHorizontal: 2 },
  bairroText: { fontSize: 12, color: colors.textMuted, flex: 1 },
  horizontalCard: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 16,
    marginBottom: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  horizontalImage: { width: 110, height: '100%', minHeight: 140 },
  horizontalContent: { flex: 1, padding: 14, justifyContent: 'center' },
  horizontalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  horizontalNome: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    fontFamily: FONTS.semiBold,
    flex: 1,
    marginRight: 8,
  },
  horizontalBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  bairroTextH: { fontSize: 13, color: colors.accent, fontWeight: '500' },
  tagsRow: { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
  tagBadge: {
    backgroundColor: colors.accentUltraLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  tagText: { fontSize: 10, color: colors.accent, fontWeight: '600' },
});
