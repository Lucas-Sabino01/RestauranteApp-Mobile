import React, { useState, useCallback, useMemo } from 'react';
import {
  StyleSheet, Text, View, Platform, StatusBar,
  FlatList, ScrollView, Image, TouchableOpacity, RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import type { ThemeColors } from '../theme/colors';
import { FONTS } from '../theme/fonts';
import { SPACING } from '../theme/spacing';
import { useAuth } from '../contexts/AuthContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { useEstabelecimentos, useDestaques } from '../hooks/useEstabelecimentos';
import { useCategories } from '../hooks/useCategories';
import { CategoryButton } from '../components/CategoryButton';
import { EstablishmentCard } from '../components/EstablishmentCard';
import { RestaurantOfWeek } from '../components/RestaurantOfWeek';
import { EventCard } from '../components/EventCard';
import { ErrorState } from '../components/ui/ErrorState';
import { EstablishmentCardSkeleton, EstablishmentCardVerticalSkeleton } from '../components/ui/SkeletonLoader';
import { EVENTOS_MOCK } from '../data/mock';
import { useLocation } from '../contexts/LocationContext';
import { calcularDistancia } from '../utils';
import type { HomeScreenProps } from '../navigation/types';
import type { RootTabNavigationProp } from '../navigation/types';
import type { Estabelecimento } from '../types';

export const HomeScreen = ({ navigation }: HomeScreenProps) => {
  const { colors, isDark } = useTheme();
  const styles = getStyles(colors);

  const [categoriaAtiva, setCategoriaAtiva] = useState('Tudo');
  const { user } = useAuth();
  const { isFavorite, toggleFavorite, favorites } = useFavorites();
  const { userLocation } = useLocation();
  const { data: categories } = useCategories();
  const { data: estabelecimentos, loading: listLoading, error: listError, refetch } = useEstabelecimentos(categoriaAtiva);
  const { data: destaques, loading: destaquesLoading } = useDestaques();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const nomeUsuario = user?.nome || 'Visitante';
  const hora = new Date().getHours();
  const saudacao = hora < 12 ? 'Bom dia' : hora < 18 ? 'Boa tarde' : 'Boa noite';

  const restauranteDaSemana = useMemo(
    () => destaques.find((e) => e.avaliacao >= 4.8) || destaques[0],
    [destaques]
  );

  const pertoDeVoce = useMemo(() => {
    if (!userLocation || !estabelecimentos) return [];
    return [...estabelecimentos]
      .map(e => ({ ...e, dist: calcularDistancia(userLocation.coords.latitude, userLocation.coords.longitude, e.coordenadas.latitude, e.coordenadas.longitude) }))
      .sort((a, b) => a.dist - b.dist)
      .slice(0, 5);
  }, [estabelecimentos, userLocation]);

  const sugestoes = useMemo(() => {
    if (!estabelecimentos || favorites.length === 0) return [];
    const favEstabs = estabelecimentos.filter(e => isFavorite(e.id));
    if (favEstabs.length === 0) return [];
    
    // Pega a categoria mais frequente dos favoritos
    const catCounts = favEstabs.reduce((acc, e) => {
      acc[e.categoria] = (acc[e.categoria] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const favCat = Object.keys(catCounts).sort((a, b) => catCounts[b] - catCounts[a])[0];
    
    return estabelecimentos
      .filter(e => e.categoria === favCat && !isFavorite(e.id))
      .slice(0, 5);
  }, [estabelecimentos, favorites, isFavorite]);

  const renderEstabelecimento = useCallback(({ item, index }: { item: Estabelecimento; index: number }) => (
    <EstablishmentCard
      estabelecimento={item}
      variant="horizontal"
      isFavorito={isFavorite(item.id)}
      onToggleFavorito={() => toggleFavorite(item.id)}
      onPress={() => navigation.navigate('Detail', { estabelecimento: item })}
      index={index}
    />
  ), [isFavorite, toggleFavorite, navigation]);

  const ListHeader = useCallback(() => (
    <>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.locationRow}>
            <Ionicons name="location" size={14} color={colors.accent} />
            <Text style={styles.headerLocal}>Curitiba, PR</Text>
          </View>
          <Text style={styles.saudacao}>{saudacao}, {nomeUsuario}!</Text>
          <Text style={styles.titulo}>Descubra os{'\n'}melhores lugares 🏙️</Text>
        </View>
        <TouchableOpacity
          style={styles.avatarContainer}
          onPress={() => navigation.getParent<RootTabNavigationProp>()?.navigate('ProfileTab')}
        >
          <Image
            source={{ uri: user?.avatar || 'https://randomuser.me/api/portraits/men/32.jpg' }}
            style={styles.avatar}
          />
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.searchContainer}
        activeOpacity={0.7}
        onPress={() => navigation.getParent<RootTabNavigationProp>()?.navigate('SearchTab')}
      >
        <Ionicons name="search" size={18} color={colors.textMuted} />
        <Text style={styles.searchPlaceholder}>Buscar restaurante, café, bairro...</Text>
        <View style={styles.filterButton}>
          <Ionicons name="options-outline" size={18} color={colors.primary} />
        </View>
      </TouchableOpacity>
      <View style={styles.bannerContainer}>
        <View style={styles.bannerGradient}>
          <View style={styles.bannerContent}>
            <View style={styles.bannerBadge}>
              <Text style={styles.bannerBadgeText}>GUIA CURITIBA</Text>
            </View>
            <Text style={styles.bannerTitulo}>Explore os{'\n'}sabores da cidade</Text>
            <Text style={styles.bannerDesc}>Cafeterias, restaurantes{'\n'}e muito mais para você</Text>
          </View>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=300&q=80' }}
            style={styles.bannerImagem}
          />
        </View>
      </View>
      {!destaquesLoading && restauranteDaSemana && (
        <>
          <View style={styles.secaoHeader}>
            <View style={styles.secaoTituloRow}>
              <Ionicons name="trophy" size={20} color={colors.star} />
              <Text style={styles.secaoTitulo}>Destaque da Semana</Text>
            </View>
          </View>
          <RestaurantOfWeek
            estabelecimento={restauranteDaSemana}
            onPress={() => navigation.navigate('Detail', { estabelecimento: restauranteDaSemana })}
          />
        </>
      )}

      <View style={styles.categoriasContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categories.map((cat) => (
            <CategoryButton
              key={cat.id}
              categoria={cat}
              isAtivo={cat.nome === categoriaAtiva}
              onPress={() => setCategoriaAtiva(cat.nome)}
            />
          ))}
        </ScrollView>
      </View>
      <View style={styles.secaoHeader}>
        <View style={styles.secaoTituloRow}>
          <Ionicons name="flame" size={20} color={colors.accent} />
          <Text style={styles.secaoTitulo}>Em Destaque</Text>
        </View>
      </View>

      {destaquesLoading ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.destaquesScroll}>
          {[1, 2, 3].map((i) => <EstablishmentCardVerticalSkeleton key={i} />)}
        </ScrollView>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.destaquesScroll}
        >
          {destaques.map((item) => (
            <EstablishmentCard
              key={item.id}
              estabelecimento={item}
              variant="vertical"
              isFavorito={isFavorite(item.id)}
              onToggleFavorito={() => toggleFavorite(item.id)}
              onPress={() => navigation.navigate('Detail', { estabelecimento: item })}
            />
          ))}
        </ScrollView>
      )}
      {EVENTOS_MOCK.length > 0 && (
        <>
          <View style={styles.secaoHeader}>
            <View style={styles.secaoTituloRow}>
              <Ionicons name="calendar" size={20} color={colors.accent} />
              <Text style={styles.secaoTitulo}>Acontecendo</Text>
            </View>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.destaquesScroll}
          >
            {EVENTOS_MOCK.map((evento) => (
              <EventCard
                key={evento.id}
                evento={evento}
                onPress={() => {
                  const estab = estabelecimentos.find((e) => e.id === evento.estabelecimentoId);
                  if (estab) navigation.navigate('Detail', { estabelecimento: estab });
                }}
              />
            ))}
          </ScrollView>
        </>
      )}

      {userLocation && pertoDeVoce.length > 0 && (
        <>
          <View style={styles.secaoHeader}>
            <View style={styles.secaoTituloRow}>
              <Ionicons name="location" size={20} color={colors.accent} />
              <Text style={styles.secaoTitulo}>Perto de Você</Text>
            </View>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.destaquesScroll}>
            {pertoDeVoce.map((item) => (
              <EstablishmentCard
                key={item.id}
                estabelecimento={item}
                variant="vertical"
                isFavorito={isFavorite(item.id)}
                onToggleFavorito={() => toggleFavorite(item.id)}
                onPress={() => navigation.navigate('Detail', { estabelecimento: item })}
              />
            ))}
          </ScrollView>
        </>
      )}

      {sugestoes.length > 0 && (
        <>
          <View style={styles.secaoHeader}>
            <View style={styles.secaoTituloRow}>
              <Ionicons name="sparkles" size={20} color={colors.accent} />
              <Text style={styles.secaoTitulo}>Sugestões para Você</Text>
            </View>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.destaquesScroll}>
            {sugestoes.map((item) => (
              <EstablishmentCard
                key={item.id}
                estabelecimento={item}
                variant="vertical"
                isFavorito={isFavorite(item.id)}
                onToggleFavorito={() => toggleFavorite(item.id)}
                onPress={() => navigation.navigate('Detail', { estabelecimento: item })}
              />
            ))}
          </ScrollView>
        </>
      )}

      <View style={styles.secaoHeader}>
        <View style={styles.secaoTituloRow}>
          <Ionicons name="compass" size={20} color={colors.accent} />
          <Text style={styles.secaoTitulo}>Explorar</Text>
        </View>
      </View>
      {listLoading && (
        <View>
          {[1, 2, 3].map((i) => <EstablishmentCardSkeleton key={i} />)}
        </View>
      )}
    </>
  ), [
    colors, styles, saudacao, nomeUsuario, user, navigation, categories, categoriaAtiva,
    destaquesLoading, restauranteDaSemana, destaques, isFavorite, toggleFavorite,
    estabelecimentos, listLoading,
  ]);

  if (listError && !listLoading && estabelecimentos.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.primary} />
        <ErrorState message={listError} onRetry={refetch} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.primary} />

      <FlatList
        data={listLoading ? [] : estabelecimentos}
        renderItem={renderEstabelecimento}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={<View style={{ height: SPACING.lg }} />}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.accent}
            colors={[colors.accent]}
          />
        }
      />
    </SafeAreaView>
  );
};

const getStyles = (colors: ThemeColors) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  scrollContainer: {
    paddingHorizontal: SPACING.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  headerLeft: { flex: 1 },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginBottom: 6,
  },
  headerLocal: {
    fontSize: 12,
    color: colors.accent,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  saudacao: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: SPACING.xs,
    fontFamily: FONTS.regular,
  },
  titulo: {
    fontSize: 26,
    fontWeight: 'bold',
    color: colors.text,
    lineHeight: 34,
    fontFamily: FONTS.bold,
  },
  avatarContainer: { position: 'relative' },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    borderColor: colors.accent,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: SPACING.base,
    paddingHorizontal: SPACING.base,
    height: 52,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 10,
  },
  searchPlaceholder: { flex: 1, fontSize: 15, color: colors.textMuted },
  filterButton: {
    width: 36,
    height: 36,
    borderRadius: SPACING.md,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerContainer: {
    borderRadius: SPACING.lg,
    overflow: 'hidden',
    marginBottom: SPACING.xl,
  },
  bannerGradient: {
    flexDirection: 'row',
    backgroundColor: colors.brown,
    padding: SPACING.lg,
    borderRadius: SPACING.lg,
    minHeight: 160,
  },
  bannerContent: { flex: 1, justifyContent: 'center' },
  bannerBadge: {
    backgroundColor: colors.accentLight,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: SPACING.xs,
    borderRadius: SPACING.lg,
    marginBottom: 10,
  },
  bannerBadgeText: {
    color: colors.accent,
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  bannerTitulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    lineHeight: 30,
    marginBottom: 6,
  },
  bannerDesc: {
    fontSize: 13,
    color: colors.textWarm,
    lineHeight: 18,
    marginBottom: SPACING.md,
  },
  bannerImagem: {
    width: 110,
    height: 140,
    borderRadius: SPACING.base,
    marginLeft: 10,
  },
  categoriasContainer: { marginBottom: SPACING.xl },
  secaoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.base,
  },
  secaoTituloRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  secaoTitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    fontFamily: FONTS.semiBold,
  },
  destaquesScroll: {
    paddingBottom: SPACING.xs,
    marginBottom: SPACING.xl,
  },
});
