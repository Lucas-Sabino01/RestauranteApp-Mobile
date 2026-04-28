import React, { useState, useMemo } from 'react';
import {
  StyleSheet, Text, View, SafeAreaView, Platform, StatusBar,
  ScrollView, Image, TouchableOpacity, Linking, Dimensions, Share,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Toast from 'react-native-toast-message';
import { useTheme } from '../contexts/ThemeContext';
import type { ThemeColors } from '../theme/colors';
import { FONTS } from '../theme/fonts';
import { useFavorites } from '../contexts/FavoritesContext';
import { OpenBadge } from '../components/ui/OpenBadge';
import { PhotoViewer } from '../components/PhotoViewer';
import { ReviewCard } from '../components/ReviewCard';
import { WriteReviewModal } from '../components/WriteReviewModal';
import { useLocation } from '../contexts/LocationContext';
import { getOpenStatus, formatShareText, calcularDistancia, formatarDistancia } from '../utils';
import { REVIEWS_MOCK } from '../data/mock';
import type { AnyDetailScreenProps } from '../navigation/types';
import type { Estabelecimento, Review } from '../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const DetailScreen = ({ route, navigation }: AnyDetailScreenProps) => {
  const { colors } = useTheme();
  const styles = getStyles(colors);

  const { estabelecimento } = route.params as { estabelecimento: Estabelecimento };
  const { isFavorite, toggleFavorite } = useFavorites();
  const [activePhoto, setActivePhoto] = useState(0);
  const [photoViewerVisible, setPhotoViewerVisible] = useState(false);
  const [photoViewerIndex, setPhotoViewerIndex] = useState(0);
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [userReviews, setUserReviews] = useState<Review[]>([]);
  const isFav = isFavorite(estabelecimento.id);
  const status = getOpenStatus(estabelecimento.horario);
  const { userLocation } = useLocation();

  const distanciaStr = useMemo(() => {
    if (!userLocation) return null;
    const distKm = calcularDistancia(
      userLocation.coords.latitude,
      userLocation.coords.longitude,
      estabelecimento.coordenadas.latitude,
      estabelecimento.coordenadas.longitude
    );
    return formatarDistancia(distKm);
  }, [userLocation, estabelecimento.coordenadas]);

  const reviews = useMemo(() => {
    const mockReviews = REVIEWS_MOCK.filter((r) => r.estabelecimentoId === estabelecimento.id);
    return [...userReviews, ...mockReviews];
  }, [estabelecimento.id, userReviews]);

  const handleWriteReview = (nota: number, comentario: string) => {
    const newReview: Review = {
      id: `user-${Date.now()}`,
      estabelecimentoId: estabelecimento.id,
      usuario: { nome: 'Você', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
      nota,
      comentario,
      data: new Date().toISOString().split('T')[0],
    };
    setUserReviews((prev) => [newReview, ...prev]);
    setReviewModalVisible(false);
  };

  const handleToggleFavorite = () => {
    toggleFavorite(estabelecimento.id);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Toast.show({
      type: isFav ? 'info' : 'success',
      text1: isFav ? 'Removido dos favoritos' : 'Adicionado aos favoritos',
      text2: estabelecimento.nome,
      visibilityTime: 2000,
    });
  };

  const handleCall = () => {
    const phoneNumber = estabelecimento.telefone.replace(/[^0-9]/g, '');
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const handleOpenMaps = () => {
    const { latitude, longitude } = estabelecimento.coordenadas;
    const url = Platform.select({
      ios: `maps:0,0?q=${estabelecimento.nome}@${latitude},${longitude}`,
      android: `geo:0,0?q=${latitude},${longitude}(${estabelecimento.nome})`,
      default: `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`,
    });
    if (url) Linking.openURL(url);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: formatShareText(estabelecimento),
      });
    } catch (err) {
      console.warn('Erro ao compartilhar:', err);
    }
  };

  const openPhotoViewer = (index: number) => {
    setPhotoViewerIndex(index);
    setPhotoViewerVisible(true);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      <View style={styles.fixedHeader}>
        <TouchableOpacity style={styles.headerButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerButton} onPress={handleShare}>
            <Ionicons name="share-outline" size={22} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton} onPress={handleToggleFavorite}>
            <Ionicons
              name={isFav ? 'heart' : 'heart-outline'}
              size={22}
              color={isFav ? colors.danger : colors.text}
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(e) => {
            const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
            setActivePhoto(index);
          }}
        >
          {estabelecimento.fotos.map((foto, index) => (
            <TouchableOpacity key={index} onPress={() => openPhotoViewer(index)} activeOpacity={0.9}>
              <Image source={{ uri: foto }} style={styles.heroImage} />
            </TouchableOpacity>
          ))}
        </ScrollView>
        {estabelecimento.fotos.length > 1 && (
          <View style={styles.dotsContainer}>
            {estabelecimento.fotos.map((_, index) => (
              <View
                key={index}
                style={[styles.dot, index === activePhoto && styles.dotActive]}
              />
            ))}
          </View>
        )}

        <View style={styles.content}>
          <View style={styles.titleRow}>
            <View style={styles.titleLeft}>
              <Text style={styles.nome}>{estabelecimento.nome}</Text>
              <View style={styles.categoriaRow}>
                <Text style={styles.categoriaText}>{estabelecimento.categoria}</Text>
                <Text style={styles.dotSeparator}>·</Text>
                <Text style={styles.faixaPreco}>{estabelecimento.faixaPreco}</Text>
                <OpenBadge isOpen={status.isOpen} label={status.label} />
              </View>
            </View>
          </View>
          <View style={styles.avaliacaoContainer}>
            <View style={styles.avaliacaoStars}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Ionicons
                  key={star}
                  name={star <= Math.floor(estabelecimento.avaliacao) ? 'star' : star - 0.5 <= estabelecimento.avaliacao ? 'star-half' : 'star-outline'}
                  size={18}
                  color={colors.star}
                />
              ))}
              <Text style={styles.avaliacaoNumber}>{estabelecimento.avaliacao}</Text>
            </View>
            <Text style={styles.avaliacaoCount}>{estabelecimento.totalAvaliacoes} avaliações</Text>
          </View>
          {estabelecimento.tags.length > 0 && (
            <View style={styles.tagsContainer}>
              {estabelecimento.tags.map((tag) => (
                <View key={tag} style={styles.tagBadge}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          )}
          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Informações</Text>

            <TouchableOpacity style={styles.infoItem} onPress={handleOpenMaps} activeOpacity={0.7}>
              <View style={styles.infoIcon}>
                <Ionicons name="location" size={20} color={colors.accent} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Endereço {distanciaStr ? `· a ${distanciaStr} de você` : ''}</Text>
                <Text style={styles.infoValue}>{estabelecimento.endereco}</Text>
                <Text style={styles.infoBairro}>{estabelecimento.bairro}</Text>
              </View>
              <Ionicons name="open-outline" size={16} color={colors.textMuted} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.infoItem} onPress={handleCall} activeOpacity={0.7}>
              <View style={styles.infoIcon}>
                <Ionicons name="call" size={20} color={colors.accent} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Telefone</Text>
                <Text style={styles.infoValue}>{estabelecimento.telefone}</Text>
              </View>
              <Ionicons name="open-outline" size={16} color={colors.textMuted} />
            </TouchableOpacity>

            <View style={styles.infoItem}>
              <View style={styles.infoIcon}>
                <Ionicons name="time" size={20} color={colors.accent} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Horário</Text>
                <Text style={styles.infoValue}>{estabelecimento.horario}</Text>
              </View>
            </View>
          </View>
          <View style={styles.aboutSection}>
            <Text style={styles.sectionTitle}>Sobre</Text>
            <Text style={styles.descricao}>{estabelecimento.descricao}</Text>
          </View>
          <View style={styles.reviewsSection}>
            <View style={styles.reviewsHeader}>
              <Text style={styles.sectionTitle}>Avaliações ({reviews.length})</Text>
              <TouchableOpacity
                style={styles.writeReviewBtn}
                onPress={() => setReviewModalVisible(true)}
                activeOpacity={0.7}
              >
                <Ionicons name="create-outline" size={16} color={colors.accent} />
                <Text style={styles.writeReviewText}>Avaliar</Text>
              </TouchableOpacity>
            </View>
            {reviews.length === 0 ? (
              <View style={styles.noReviews}>
                <Ionicons name="chatbubble-outline" size={32} color={colors.textMuted} />
                <Text style={styles.noReviewsText}>Nenhuma avaliação ainda</Text>
                <Text style={styles.noReviewsDesc}>Seja o primeiro a avaliar!</Text>
              </View>
            ) : (
              reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))
            )}
          </View>
          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.actionButton} onPress={handleCall} activeOpacity={0.8}>
              <Ionicons name="call" size={20} color={colors.primary} />
              <Text style={styles.actionButtonText}>Ligar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButtonOutline} onPress={handleOpenMaps} activeOpacity={0.8}>
              <Ionicons name="navigate" size={20} color={colors.accent} />
              <Text style={styles.actionButtonOutlineText}>Como chegar</Text>
            </TouchableOpacity>
          </View>

          <View style={{ height: 40 }} />
        </View>
      </ScrollView>

      <PhotoViewer
        photos={estabelecimento.fotos}
        initialIndex={photoViewerIndex}
        visible={photoViewerVisible}
        onClose={() => setPhotoViewerVisible(false)}
      />

      <WriteReviewModal
        visible={reviewModalVisible}
        estabelecimentoNome={estabelecimento.nome}
        onSubmit={handleWriteReview}
        onClose={() => setReviewModalVisible(false)}
      />
    </SafeAreaView>
  );
};

const getStyles = (colors: ThemeColors) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  fixedHeader: {
    position: 'absolute',
    top: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 10 : 50,
    left: 16,
    right: 16,
    zIndex: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerRight: {
    flexDirection: 'row',
    gap: 10,
  },
  headerButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(27, 16, 21, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  heroImage: {
    width: SCREEN_WIDTH,
    height: 280,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -20,
    marginBottom: 8,
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  dotActive: {
    backgroundColor: colors.accent,
    width: 20,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleLeft: { flex: 1 },
  nome: {
    fontSize: 26,
    fontWeight: 'bold',
    color: colors.text,
    fontFamily: FONTS.bold,
    marginBottom: 6,
  },
  categoriaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoriaText: {
    fontSize: 14,
    color: colors.accent,
    fontWeight: '600',
  },
  dotSeparator: {
    color: colors.textMuted,
  },
  faixaPreco: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  avaliacaoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    padding: 14,
    borderRadius: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  avaliacaoStars: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  avaliacaoNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginLeft: 6,
  },
  avaliacaoCount: {
    fontSize: 13,
    color: colors.textMuted,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  tagBadge: {
    backgroundColor: colors.accentUltraLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  tagText: {
    fontSize: 12,
    color: colors.accent,
    fontWeight: '600',
  },
  infoSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
    fontFamily: FONTS.semiBold,
    marginBottom: 14,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.accentUltraLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  infoBairro: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  aboutSection: {
    marginBottom: 24,
  },
  descricao: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 24,
    fontFamily: FONTS.regular,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accent,
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
  },
  actionButtonOutline: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.accent,
    gap: 8,
  },
  actionButtonOutlineText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.accent,
  },
  reviewsSection: {
    marginBottom: 24,
  },
  reviewsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  writeReviewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.accentUltraLight,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 6,
  },
  writeReviewText: {
    fontSize: 13,
    color: colors.accent,
    fontWeight: '600',
  },
  noReviews: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  noReviewsText: {
    fontSize: 15,
    color: colors.text,
    fontWeight: '600',
    marginTop: 10,
  },
  noReviewsDesc: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 4,
  },
});
