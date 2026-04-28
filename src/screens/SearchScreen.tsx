import React, { useState, useCallback, useEffect } from 'react';
import {
  StyleSheet, Text, View, SafeAreaView, Platform, StatusBar,
  FlatList, TextInput, TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import type { ThemeColors } from '../theme/colors';
import { FONTS } from '../theme/fonts';
import { useFavorites } from '../contexts/FavoritesContext';
import { useSearchEstabelecimentos } from '../hooks/useEstabelecimentos';
import { EstablishmentCard } from '../components/EstablishmentCard';
import { FilterModal, EMPTY_FILTERS } from '../components/FilterModal';
import type { Filters } from '../components/FilterModal';
import { EstablishmentCardSkeleton } from '../components/ui/SkeletonLoader';
import { isOpenNow, calcularDistancia } from '../utils';
import { useLocation } from '../contexts/LocationContext';
import type { SearchScreenProps } from '../navigation/types';
import type { Estabelecimento } from '../types';
import { CATEGORIAS } from '../data/mock';

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

  const handleSearch = useCallback((text: string) => {
    setSearchTerm(text);
    if (text.length >= 2) {
      search(text);
    }
  }, [search]);

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
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

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
      {searchTerm.length === 0 && recentSearches.length > 0 && (
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
      {searchTerm.length === 0 && recentSearches.length === 0 && (
        <View style={styles.emptyState}>
          <View style={styles.emptyIcon}>
            <Ionicons name="compass-outline" size={64} color={colors.textMuted} />
          </View>
          <Text style={styles.emptyTitle}>Explore Curitiba</Text>
          <Text style={styles.emptyDesc}>
            Busque por nome de restaurante,{'\n'}cafeteria, bairro ou tipo de comida
          </Text>
        </View>
      )}
      {searchTerm.length >= 2 && (
        <>
          {loading ? (
            <View style={styles.listContainer}>
              {[1, 2, 3].map((i) => <EstablishmentCardSkeleton key={i} />)}
            </View>
          ) : filteredResults.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="search-outline" size={48} color={colors.textMuted} />
              <Text style={styles.emptyTitle}>Nenhum resultado</Text>
              <Text style={styles.emptyDesc}>
                Não encontramos nada para "{searchTerm}".{'\n'}Tente outro termo ou ajuste os filtros.
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
                >
                  {filteredResults.map((estab: Estabelecimento) => (
                    <Marker
                      key={estab.id}
                      coordinate={estab.coordenadas}
                    >
                      <View style={{ alignItems: 'center' }}>
                        <View style={{ backgroundColor: colors.accent, padding: 6, borderRadius: 16, borderWidth: 2, borderColor: colors.primary }}>
                          <Ionicons name="restaurant" size={12} color={colors.primary} />
                        </View>
                        <View style={{
                          width: 0, height: 0, backgroundColor: 'transparent', borderStyle: 'solid',
                          borderLeftWidth: 5, borderRightWidth: 5, borderBottomWidth: 6,
                          borderLeftColor: 'transparent', borderRightColor: 'transparent', borderBottomColor: colors.primary,
                          transform: [{ rotate: '180deg' }], marginTop: -1
                        }} />
                      </View>
                      <Callout tooltip onPress={() => navigation.navigate('SearchDetail', { estabelecimento: estab })}>
                        <View style={{ width: 200, backgroundColor: colors.card, borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: colors.border }}>
                          <Image source={{ uri: estab.imagem }} style={{ width: '100%', height: 100 }} />
                          <View style={{ padding: 10 }}>
                            <Text style={{ fontSize: 14, fontWeight: 'bold', color: colors.text }} numberOfLines={1}>{estab.nome}</Text>
                            <Text style={{ fontSize: 11, color: colors.textMuted, marginTop: 2 }}>{estab.categoria} • {estab.faixaPreco}</Text>
                          </View>
                        </View>
                      </Callout>
                    </Marker>
                  ))}
                </MapView>
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
        </>
      )}
      {searchTerm.length >= 2 && filteredResults.length > 0 && Platform.OS !== 'web' && (
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
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
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
  },
  emptyIcon: {
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 12,
    marginBottom: 8,
  },
  emptyDesc: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 22,
    marginTop: 8,
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
