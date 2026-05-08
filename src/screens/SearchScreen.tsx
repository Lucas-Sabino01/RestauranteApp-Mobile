import React, { useState, useCallback, useEffect } from 'react';
import {
  StyleSheet, Text, View, Platform, StatusBar,
  FlatList, TextInput, TouchableOpacity, Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import type { ThemeColors } from '../theme/colors';
import { FONTS } from '../theme/fonts';
import { SPACING } from '../theme/spacing';
import { useFavorites } from '../contexts/FavoritesContext';
import { useSearchEstabelecimentos } from '../hooks/useEstabelecimentos';
import { useDebounce } from '../hooks/useDebounce';
import { EstablishmentCard } from '../components/EstablishmentCard';
import { CATEGORY_EMOJI } from './MapScreen';
import { FilterModal, EMPTY_FILTERS } from '../components/FilterModal';
import type { Filters } from '../components/FilterModal';
import { EstablishmentCardSkeleton } from '../components/ui/SkeletonLoader';
import { isOpenNow, calcularDistancia } from '../utils';
import { useLocation } from '../contexts/LocationContext';
import type { SearchScreenProps } from '../navigation/types';
import type { Estabelecimento } from '../types';
import { CATEGORIAS } from '../data/mock';

// react-native-maps uses dynamic require for web compatibility — typed as any intentionally
let MapView: any;
let Marker: any;
let Callout: any;
let PROVIDER_GOOGLE: any;

if (Platform.OS !== 'web') {
  const Maps = require('react-native-maps');
  MapView = Maps.default;
  Marker = Maps.Marker;
  Callout = Maps.Callout;
  PROVIDER_GOOGLE = Maps.PROVIDER_GOOGLE;
}

const RECENT_SEARCHES_KEY = '@GuiaCuritiba:recentSearches';
const MAX_RECENT = 5;

export const SearchScreen = ({ navigation }: SearchScreenProps) => {
  const { colors, isDark } = useTheme();
  const styles = getStyles(colors);

  const [searchTerm, setSearchTerm] = useState('');
  const { results, loading, search } = useSearchEstabelecimentos();
  const { userLocation: location } = useLocation();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isMapView, setIsMapView] = useState(false);
  const [selectedMapEstab, setSelectedMapEstab] = useState<Estabelecimento | null>(null);
  const mapRef = React.useRef<any>(null);

  useEffect(() => {
    loadRecentSearches();
  }, []);

  const loadRecentSearches = async () => {
    try {
      const stored = await AsyncStorage.getItem(RECENT_SEARCHES_KEY);
      if (stored) setRecentSearches(JSON.parse(stored));
    } catch { /* ignore */ }
  };

  const saveRecentSearch = async (term: string) => {
    const trimmed = term.trim();
    if (!trimmed || trimmed.length < 2) return;
    try {
      const updated = [trimmed, ...recentSearches.filter((s) => s !== trimmed)].slice(0, MAX_RECENT);
      setRecentSearches(updated);
      await AsyncStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
    } catch { /* ignore */ }
  };

  const clearRecentSearches = async () => {
    setRecentSearches([]);
    await AsyncStorage.removeItem(RECENT_SEARCHES_KEY);
  };

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    if (debouncedSearchTerm.length >= 2) {
      search(debouncedSearchTerm);
    } else if (debouncedSearchTerm.length === 0) {
      search('');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchTerm]);

  const handleSearch = useCallback((text: string) => {
    setSearchTerm(text);
  }, []);

  const handleSubmitSearch = () => {
    if (searchTerm.trim().length >= 2) {
      saveRecentSearch(searchTerm);
    }
  };

  const handleRecentPress = (term: string) => {
    setSearchTerm(term);
    search(term);
  };

  const handleClear = useCallback(() => {
    setSearchTerm('');
    search('');
    setSelectedFilter(null);
  }, [search]);

  const activeFilterCount =
    filters.faixaPreco.length +
    (filters.avaliacaoMinima ? 1 : 0) +
    (filters.bairro ? 1 : 0) +
    (filters.distanciaMaxima ? 1 : 0) +
    (filters.abertoAgora ? 1 : 0);

  // Apply all filters
  const filteredResults = results.filter((e) => {
    if (selectedFilter && e.categoria !== selectedFilter) return false;
    if (filters.faixaPreco.length > 0 && !filters.faixaPreco.includes(e.faixaPreco)) return false;
    if (filters.avaliacaoMinima && e.avaliacao < filters.avaliacaoMinima) return false;
    if (filters.bairro && e.bairro !== filters.bairro) return false;
    if (filters.abertoAgora && !isOpenNow(e.horario)) return false;
    if (filters.distanciaMaxima && location) {
      const distance = calcularDistancia(
        location.coords.latitude,
        location.coords.longitude,
        e.coordenadas.latitude,
        e.coordenadas.longitude
      );
      if (distance > filters.distanciaMaxima) return false;
    }
    return true;
  });

  useEffect(() => {
    if (isMapView && mapRef.current && filteredResults.length > 0) {
      setTimeout(() => {
        mapRef.current?.fitToCoordinates(
          filteredResults.map((r: Estabelecimento) => r.coordenadas),
          {
            edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
            animated: true,
          }
        );
      }, 300);
    }
  }, [isMapView, filteredResults]);

  const renderItem = useCallback(({ item, index }: { item: Estabelecimento; index: number }) => (
    <EstablishmentCard
      estabelecimento={item}
      variant="horizontal"
      isFavorito={isFavorite(item.id)}
      onToggleFavorito={() => toggleFavorite(item.id)}
      onPress={() => navigation.navigate('SearchDetail', { estabelecimento: item })}
      index={index}
    />
  ), [isFavorite, toggleFavorite, navigation]);

  const categoriasFiltro = CATEGORIAS.filter((c) => c.nome !== 'Tudo');

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.primary} />

      <View style={styles.header}>
        <Text style={styles.titulo}>Buscar</Text>
      </View>

      <View style={styles.searchRow}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={18} color={colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Restaurante, café, bairro..."
            placeholderTextColor={colors.textMuted}
            value={searchTerm}
            onChangeText={handleSearch}
            onSubmitEditing={handleSubmitSearch}
            returnKeyType="search"
            autoCorrect={false}
          />
          {searchTerm.length > 0 && (
            <TouchableOpacity onPress={handleClear} activeOpacity={0.7}>
              <Ionicons name="close-circle" size={20} color={colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          style={[styles.filterBtn, activeFilterCount > 0 && styles.filterBtnActive]}
          onPress={() => setFilterModalVisible(true)}
          activeOpacity={0.7}
        >
          <Ionicons name="options-outline" size={20} color={activeFilterCount > 0 ? colors.primary : colors.accent} />
          {activeFilterCount > 0 && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>{activeFilterCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
      {results.length > 0 && (
        <View style={styles.filtersRow}>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={categoriasFiltro}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingHorizontal: 20 }}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.filterChip,
                  selectedFilter === item.nome && styles.filterChipActive,
                ]}
                onPress={() =>
                  setSelectedFilter(selectedFilter === item.nome ? null : item.nome)
                }
                activeOpacity={0.7}
              >
                <Text style={styles.filterEmoji}>{item.icone}</Text>
                <Text
                  style={[
                    styles.filterText,
                    selectedFilter === item.nome && styles.filterTextActive,
                  ]}
                >
                  {item.nome}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
      {searchTerm.length === 0 && recentSearches.length > 0 && results.length > 0 && (
        <View style={styles.recentContainer}>
          <View style={styles.recentHeader}>
            <Text style={styles.recentTitle}>Buscas recentes</Text>
            <TouchableOpacity onPress={clearRecentSearches}>
              <Text style={styles.recentClearText}>Limpar</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.recentChips}>
            {recentSearches.map((term) => (
              <TouchableOpacity
                key={term}
                style={styles.recentChip}
                onPress={() => handleRecentPress(term)}
                activeOpacity={0.7}
              >
                <Ionicons name="time-outline" size={14} color={colors.textMuted} />
                <Text style={styles.recentChipText}>{term}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
      {loading && results.length === 0 ? (
        <View style={styles.listContainer}>
          {[1, 2, 3].map((i) => <EstablishmentCardSkeleton key={i} />)}
        </View>
      ) : filteredResults.length === 0 && searchTerm.length >= 2 ? (
        <View style={styles.emptyState}>
          <View style={styles.emptyIllustration}>
            <View style={[styles.emptyBubble, styles.bubble1]}>
              <Text style={{fontSize: 24}}>🤔</Text>
            </View>
            <View style={styles.emptySearchContainer}>
              <Ionicons name="search" size={56} color={colors.accent} />
            </View>
          </View>
          <Text style={styles.emptyTitle}>Nenhum resultado</Text>
          <Text style={styles.emptyDesc}>
            Não encontramos nada para "{searchTerm}".{'\n'}Tente outro termo ou ajuste os filtros.
          </Text>
          <TouchableOpacity 
            style={styles.emptyBtn} 
            onPress={handleClear}
            activeOpacity={0.8}
          >
            <Text style={styles.emptyBtnText}>Limpar busca</Text>
          </TouchableOpacity>
        </View>
      ) : filteredResults.length === 0 && searchTerm.length === 0 ? (
        <View style={styles.emptyState}>
          <View style={styles.emptyIllustration}>
            <View style={[styles.emptyBubble, styles.bubble1]}>
              <Text style={{fontSize: 24}}>🗺️</Text>
            </View>
            <View style={[styles.emptyBubble, styles.bubble2]}>
              <Text style={{fontSize: 20}}>🌮</Text>
            </View>
            <View style={[styles.emptyBubble, styles.bubble3]}>
              <Text style={{fontSize: 28}}>☕</Text>
            </View>
            <View style={styles.emptyCompassContainer}>
              <Ionicons name="compass" size={64} color={colors.primary} />
            </View>
          </View>
          <Text style={styles.emptyTitle}>Explore Curitiba</Text>
          <Text style={styles.emptyDesc}>
            Busque por nome de restaurante,{'\n'}cafeteria, bairro ou tipo de comida
          </Text>
        </View>
      ) : isMapView && Platform.OS !== 'web' ? (
            <View style={styles.mapWrapper}>
              <MapView
                ref={mapRef}
                style={styles.map}
                provider={PROVIDER_GOOGLE}
                initialRegion={{
                  latitude: location ? location.coords.latitude : -25.4284,
                  longitude: location ? location.coords.longitude : -49.2733,
                  latitudeDelta: 0.05,
                  longitudeDelta: 0.05,
                }}
                showsUserLocation={true}
                customMapStyle={isDark ? mapStyle : []}
                onPress={() => setSelectedMapEstab(null)}
              >
                {filteredResults.map((estab: Estabelecimento) => (
                  <Marker
                    key={estab.id}
                    coordinate={estab.coordenadas}
                    onPress={() => setSelectedMapEstab(estab)}
                  >
                    <View style={styles.markerOuter}>
                      <View style={[styles.markerBadge, selectedMapEstab?.id === estab.id && styles.markerBadgeSelected]}>
                        <Text style={styles.markerEmoji}>{CATEGORY_EMOJI[estab.categoria] || '📍'}</Text>
                      </View>
                      <View style={styles.markerPointer} />
                    </View>
                  </Marker>
                ))}
              </MapView>
              {selectedMapEstab && (
                <TouchableOpacity
                  style={styles.searchBottomCard}
                  activeOpacity={0.9}
                  onPress={() => navigation.navigate('SearchDetail', { estabelecimento: selectedMapEstab })}
                >
                  <Image source={{ uri: selectedMapEstab.imagem }} style={styles.searchBottomImg} />
                  <View style={styles.searchBottomInfo}>
                    <Text style={styles.searchBottomNome} numberOfLines={1}>{selectedMapEstab.nome}</Text>
                    <Text style={styles.searchBottomCat}>{selectedMapEstab.subcategoria || selectedMapEstab.categoria} · {selectedMapEstab.faixaPreco}</Text>
                    <View style={styles.searchBottomRow}>
                      <Ionicons name="star" size={14} color={colors.star} />
                      <Text style={styles.searchBottomRating}>{selectedMapEstab.avaliacao}</Text>
                      <Text style={styles.searchBottomCount}>({selectedMapEstab.totalAvaliacoes})</Text>
                    </View>
                    {selectedMapEstab.especialidades && selectedMapEstab.especialidades.length > 0 && (
                      <Text style={styles.searchBottomEsp} numberOfLines={1}>{selectedMapEstab.especialidades[0]}</Text>
                    )}
                  </View>
                  <Ionicons name="chevron-forward" size={22} color={colors.textMuted} />
                </TouchableOpacity>
              )}
            </View>
      ) : (
        <FlatList
          data={filteredResults}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <Text style={styles.resultCount}>
              {filteredResults.length} {filteredResults.length === 1 ? 'resultado' : 'resultados'}
            </Text>
          }
        />
      )}
      {filteredResults.length > 0 && Platform.OS !== 'web' && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => setIsMapView(!isMapView)}
          activeOpacity={0.8}
        >
          <Ionicons name={isMapView ? "list" : "map"} size={22} color={colors.primary} />
          <Text style={styles.fabText}>{isMapView ? "Ver Lista" : "Ver Mapa"}</Text>
        </TouchableOpacity>
      )}

      <FilterModal
        visible={filterModalVisible}
        filters={filters}
        onApply={setFilters}
        onClose={() => setFilterModalVisible(false)}
      />
    </SafeAreaView>
  );
};

const getStyles = (colors: ThemeColors) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  mapWrapper: {
    flex: 1,
    borderRadius: 24,
    overflow: 'hidden',
    marginHorizontal: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    fontFamily: FONTS.bold,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
    gap: 10,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 52,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
    fontFamily: FONTS.regular,
  },
  filterBtn: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    position: 'relative',
  },
  filterBtnActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  filterBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.danger,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterBadgeText: {
    fontSize: 10,
    color: colors.white,
    fontWeight: 'bold',
  },
  filtersRow: {
    marginBottom: 16,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 6,
  },
  filterChipActive: {
    backgroundColor: colors.accentLight,
    borderColor: colors.accent,
  },
  filterEmoji: {
    fontSize: 14,
  },
  filterText: {
    fontSize: 13,
    color: colors.textMuted,
    fontWeight: '600',
  },
  filterTextActive: {
    color: colors.accent,
  },
  listContainer: {
    paddingHorizontal: 20,
  },
  resultCount: {
    fontSize: 13,
    color: colors.textMuted,
    marginBottom: 14,
  },
  recentContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  recentTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  recentClearText: {
    fontSize: 13,
    color: colors.danger,
    fontWeight: '600',
  },
  recentChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  recentChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  recentChipText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    marginTop: 40,
  },
  emptyIllustration: {
    width: 160,
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptySearchContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.accent + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyCompassContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  emptyBubble: {
    position: 'absolute',
    backgroundColor: colors.card,
    borderRadius: 30,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 10,
  },
  bubble1: {
    top: 0,
    left: 10,
    transform: [{ rotate: '-15deg' }],
  },
  bubble2: {
    top: 30,
    right: -10,
    transform: [{ rotate: '15deg' }],
  },
  bubble3: {
    bottom: 10,
    left: 20,
    transform: [{ rotate: '-5deg' }],
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
    fontFamily: FONTS.bold,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyDesc: {
    fontSize: 15,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 22,
    fontFamily: FONTS.regular,
    marginBottom: 24,
  },
  emptyBtn: {
    backgroundColor: colors.accent,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 16,
  },
  emptyBtnText: {
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily: FONTS.bold,
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: colors.accent,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 30,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabText: {
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: 15,
  },
  markerOuter: { alignItems: 'center' },
  markerBadge: {
    backgroundColor: colors.card, width: 44, height: 44, borderRadius: 22,
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: colors.border,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4, elevation: 5,
  },
  markerBadgeSelected: { borderColor: colors.accent, backgroundColor: colors.accentLight, transform: [{ scale: 1.15 }] },
  markerEmoji: { fontSize: 20 },
  markerPointer: {
    width: 0, height: 0, backgroundColor: 'transparent',
    borderLeftWidth: 6, borderRightWidth: 6, borderTopWidth: 8,
    borderLeftColor: 'transparent', borderRightColor: 'transparent',
    borderTopColor: colors.border, marginTop: -1,
  },
  searchBottomCard: {
    position: 'absolute', bottom: 12, left: 12, right: 12,
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.card, borderRadius: 16, padding: 12,
    borderWidth: 1, borderColor: colors.border,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 8,
  },
  searchBottomImg: { width: 64, height: 64, borderRadius: 12 },
  searchBottomInfo: { flex: 1, marginLeft: 12 },
  searchBottomNome: { fontSize: 16, fontWeight: 'bold', color: colors.text, fontFamily: FONTS.semiBold },
  searchBottomCat: { fontSize: 12, color: colors.accent, fontWeight: '600', marginTop: 2 },
  searchBottomRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  searchBottomRating: { fontSize: 13, fontWeight: '600', color: colors.text },
  searchBottomCount: { fontSize: 12, color: colors.textMuted },
  searchBottomEsp: { fontSize: 11, color: colors.textMuted, marginTop: 4 },
});

const mapStyle = [
  { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
  { featureType: 'administrative.locality', elementType: 'labels.text.fill', stylers: [{ color: '#d59563' }] },
  { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#d59563' }] },
  { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#263c3f' }] },
  { featureType: 'poi.park', elementType: 'labels.text.fill', stylers: [{ color: '#6b9a76' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#38414e' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#212a37' }] },
  { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#9ca5b3' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#746855' }] },
  { featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{ color: '#1f2835' }] },
  { featureType: 'road.highway', elementType: 'labels.text.fill', stylers: [{ color: '#f3d19c' }] },
  { featureType: 'transit', elementType: 'geometry', stylers: [{ color: '#2f3948' }] },
  { featureType: 'transit.station', elementType: 'labels.text.fill', stylers: [{ color: '#d59563' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#17263c' }] },
  { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#515c6d' }] },
  { featureType: 'water', elementType: 'labels.text.stroke', stylers: [{ color: '#17263c' }] }
];
