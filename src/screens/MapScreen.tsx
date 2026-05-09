import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  StyleSheet, Text, View, Platform, StatusBar,
  TouchableOpacity, Image, ScrollView, Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useTheme } from '../contexts/ThemeContext';
import type { ThemeColors } from '../theme/colors';
import { FONTS } from '../theme/fonts';
import { CATEGORIAS } from '../data/mock';
import { useLocation } from '../contexts/LocationContext';
import { useEstabelecimentos } from '../hooks/useEstabelecimentos';
import { calcularDistancia, formatarDistancia, CATEGORY_EMOJI } from '../utils';
import type { Estabelecimento } from '../types';
import type { MapScreenProps } from '../navigation/types';

let MapView: any;
let Marker: any;
let PROVIDER_GOOGLE: any;

if (Platform.OS !== 'web') {
  const Maps = require('react-native-maps');
  MapView = Maps.default;
  Marker = Maps.Marker;
  PROVIDER_GOOGLE = Maps.PROVIDER_GOOGLE;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Re-exported for backward compatibility — prefer importing from '../utils' directly
export { CATEGORY_EMOJI };

export const MapScreen = ({ navigation }: MapScreenProps) => {
  const { colors, isDark } = useTheme();
  const styles = getStyles(colors);

  const [selected, setSelected] = useState<Estabelecimento | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const mapRef = useRef<any>(null);
  const { userLocation } = useLocation();
  const { data: estabelecimentos } = useEstabelecimentos();

  const initialRegion = {
    latitude: -25.4284,
    longitude: -49.2733,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  useEffect(() => {
    if (userLocation) {
      (async () => {
        try {
          const [addr] = await Location.reverseGeocodeAsync({
            latitude: userLocation.coords.latitude,
            longitude: userLocation.coords.longitude,
          });
          if (addr) {
            const parts = [addr.street, addr.name, addr.district].filter(Boolean);
            setUserAddress(parts.join(', ') || 'Localização obtida');
          }
        } catch { setUserAddress('Curitiba, PR'); }
      })();
    }
  }, [userLocation]);

  const filteredEstabelecimentos = selectedCategory
    ? estabelecimentos.filter((e) => e.categoria === selectedCategory)
    : estabelecimentos;

  const getDistanceStr = useCallback((estab: Estabelecimento) => {
    if (!userLocation) return null;
    const dist = calcularDistancia(
      userLocation.coords.latitude, userLocation.coords.longitude,
      estab.coordenadas.latitude, estab.coordenadas.longitude
    );
    return formatarDistancia(dist);
  }, [userLocation]);

  const handleCenterUser = () => {
    if (userLocation && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: userLocation.coords.latitude,
        longitude: userLocation.coords.longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      }, 600);
    }
  };

  const categoriasFiltro = CATEGORIAS.filter((c) => c.nome !== 'Tudo');

  if (Platform.OS === 'web') {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.primary} />
        <View style={styles.header}>
          <Text style={styles.titulo}>Mapa</Text>
        </View>
        <View style={styles.webContent}>
          <View style={styles.iconContainer}>
            <Ionicons name="map" size={80} color={colors.accent} />
          </View>
          <Text style={styles.comingSoonTitle}>Mapa no Celular!</Text>
          <Text style={styles.comingSoonDesc}>
            Para ver o mapa interativo com os estabelecimentos de Curitiba, abra o aplicativo no seu celular Android ou iOS.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.primary} />

      <View style={styles.header}>
        <Text style={styles.titulo}>Explorar Mapa</Text>
        {userAddress && (
          <View style={styles.locationRow}>
            <Ionicons name="location" size={14} color={colors.accent} />
            <Text style={styles.locationText} numberOfLines={1}>{userAddress}</Text>
          </View>
        )}
      </View>

      <View style={styles.categoriesRow}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}>
          {categoriasFiltro.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[styles.catChip, selectedCategory === cat.nome && styles.catChipActive]}
              onPress={() => setSelectedCategory(selectedCategory === cat.nome ? null : cat.nome)}
              activeOpacity={0.7}
            >
              <Text style={styles.catEmoji}>{cat.icone}</Text>
              <Text style={[styles.catText, selectedCategory === cat.nome && styles.catTextActive]}>{cat.nome}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={initialRegion}
          showsUserLocation={true}
          showsMyLocationButton={false}
          customMapStyle={isDark ? darkMapStyle : []}
          onPress={() => setSelected(null)}
        >
          {filteredEstabelecimentos.map((estab: Estabelecimento) => (
            <Marker
              key={estab.id}
              coordinate={estab.coordenadas}
              onPress={() => setSelected(estab)}
            >
              <View style={styles.markerOuter}>
                <View style={[styles.markerBadge, selected?.id === estab.id && styles.markerBadgeSelected]}>
                  <Text style={styles.markerEmoji}>{CATEGORY_EMOJI[estab.categoria] || '📍'}</Text>
                </View>
                <View style={styles.markerPointer} />
              </View>
            </Marker>
          ))}
        </MapView>

        <TouchableOpacity style={styles.centerBtn} onPress={handleCenterUser} activeOpacity={0.8}>
          <Ionicons name="locate" size={22} color={colors.accent} />
        </TouchableOpacity>
      </View>

      {selected && (
        <View style={styles.bottomCard}>
          <TouchableOpacity
            style={styles.bottomCardInner}
            activeOpacity={0.9}
            onPress={() => navigation.navigate('MapDetail', { estabelecimento: selected })}
          >
            <Image source={{ uri: selected.imagem }} style={styles.bottomCardImage} />
            <View style={styles.bottomCardInfo}>
              <Text style={styles.bottomCardName} numberOfLines={1}>{selected.nome}</Text>
              <Text style={styles.bottomCardSub}>
                {selected.subcategoria || selected.categoria} · {selected.faixaPreco}
              </Text>
              {selected.especialidades && selected.especialidades.length > 0 && (
                <Text style={styles.bottomCardSpec} numberOfLines={1}>
                  {selected.especialidades[0]}
                </Text>
              )}
              <View style={styles.bottomCardMeta}>
                <View style={styles.bottomCardRating}>
                  <Ionicons name="star" size={14} color={colors.star} />
                  <Text style={styles.bottomCardRatingText}>{selected.avaliacao}</Text>
                </View>
                {getDistanceStr(selected) && (
                  <View style={styles.bottomCardDist}>
                    <Ionicons name="navigate-outline" size={13} color={colors.textMuted} />
                    <Text style={styles.bottomCardDistText}>{getDistanceStr(selected)}</Text>
                  </View>
                )}
              </View>
            </View>
            <View style={styles.bottomCardArrow}>
              <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
            </View>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const getStyles = (colors: ThemeColors) => StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.primary },
  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8 },
  titulo: { fontSize: 28, fontWeight: 'bold', color: colors.text, fontFamily: FONTS.bold },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  locationText: { fontSize: 13, color: colors.accent, fontWeight: '500', flex: 1 },
  categoriesRow: { marginBottom: 8 },
  catChip: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.card,
    paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20,
    borderWidth: 1, borderColor: colors.border, gap: 5,
  },
  catChipActive: { backgroundColor: colors.accentLight, borderColor: colors.accent },
  catEmoji: { fontSize: 14 },
  catText: { fontSize: 13, color: colors.textMuted, fontWeight: '600' },
  catTextActive: { color: colors.accent },
  mapContainer: {
    flex: 1, borderRadius: 24, overflow: 'hidden', margin: 16, marginTop: 8,
    marginBottom: 16, borderWidth: 1, borderColor: colors.border,
  },
  map: { ...StyleSheet.absoluteFillObject },
  markerOuter: { alignItems: 'center' },
  markerBadge: {
    backgroundColor: colors.card, width: 44, height: 44, borderRadius: 22,
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 2.5, borderColor: colors.border,
    shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.35, shadowRadius: 5, elevation: 6,
  },
  markerBadgeSelected: { borderColor: colors.accent, backgroundColor: colors.accentLight, transform: [{ scale: 1.15 }] },
  markerEmoji: { fontSize: 20 },
  markerPointer: {
    width: 0, height: 0, backgroundColor: 'transparent',
    borderLeftWidth: 6, borderRightWidth: 6, borderTopWidth: 8,
    borderLeftColor: 'transparent', borderRightColor: 'transparent',
    borderTopColor: colors.border, marginTop: -1,
  },
  centerBtn: {
    position: 'absolute', bottom: 16, right: 16, width: 48, height: 48,
    borderRadius: 24, backgroundColor: colors.card, justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: colors.border,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 6, elevation: 6,
  },
  bottomCard: {
    position: 'absolute', bottom: 20, left: 16, right: 16,
    backgroundColor: colors.card, borderRadius: 20, overflow: 'hidden',
    borderWidth: 1, borderColor: colors.border,
    shadowColor: '#000', shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 10,
  },
  bottomCardInner: { flexDirection: 'row', alignItems: 'center', padding: 12 },
  bottomCardImage: { width: 72, height: 72, borderRadius: 14 },
  bottomCardInfo: { flex: 1, marginLeft: 12 },
  bottomCardName: { fontSize: 16, fontWeight: 'bold', color: colors.text, fontFamily: FONTS.semiBold },
  bottomCardSub: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  bottomCardSpec: { fontSize: 12, color: colors.textMuted, marginTop: 3 },
  bottomCardMeta: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 6 },
  bottomCardRating: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  bottomCardRatingText: { fontSize: 13, fontWeight: 'bold', color: colors.text },
  bottomCardDist: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  bottomCardDistText: { fontSize: 12, color: colors.textMuted },
  bottomCardArrow: { paddingLeft: 8 },
  webContent: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 },
  iconContainer: {
    width: 140, height: 140, borderRadius: 70, backgroundColor: colors.accentUltraLight,
    justifyContent: 'center', alignItems: 'center', marginBottom: 28,
  },
  comingSoonTitle: { fontSize: 24, fontWeight: 'bold', color: colors.text, fontFamily: FONTS.bold, marginBottom: 12 },
  comingSoonDesc: { fontSize: 15, color: colors.textMuted, textAlign: 'center', lineHeight: 24 },
});

const darkMapStyle = [
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
  { featureType: 'water', elementType: 'labels.text.stroke', stylers: [{ color: '#17263c' }] },
];
