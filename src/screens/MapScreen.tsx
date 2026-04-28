import React, { useState, useRef } from 'react';
import {
  StyleSheet, Text, View, SafeAreaView, Platform, StatusBar,
  TouchableOpacity, Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import type { ThemeColors } from '../theme/colors';
import { FONTS } from '../theme/fonts';
import { ESTABELECIMENTOS } from '../data/mock';
import type { Estabelecimento } from '../types';
import type { MapScreenProps } from '../navigation/types';

// O react-native-maps pode não funcionar corretamente na web sem config adicional
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

export const MapScreen = ({ navigation }: MapScreenProps) => {
  const { colors } = useTheme();
  const styles = getStyles(colors);

  const [selected, setSelected] = useState<Estabelecimento | null>(null);
  const mapRef = useRef<any>(null);

  const initialRegion = {
    latitude: -25.4284,
    longitude: -49.2733,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  if (Platform.OS === 'web') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
        <View style={styles.header}>
          <Text style={styles.titulo}>Mapa</Text>
        </View>
        <View style={styles.content}>
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
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

      <View style={styles.header}>
        <Text style={styles.titulo}>Explorar Mapa</Text>
      </View>

      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={initialRegion}
          showsUserLocation={true}
          showsMyLocationButton={true}
          customMapStyle={mapStyle}
        >
          {ESTABELECIMENTOS.map((estab: Estabelecimento) => (
            <Marker
              key={estab.id}
              coordinate={estab.coordenadas}
              onPress={() => setSelected(estab)}
            >
              <View style={styles.markerContainer}>
                <View style={styles.markerBadge}>
                  <Ionicons name="restaurant" size={12} color={colors.primary} />
                </View>
                <View style={styles.markerTriangle} />
              </View>

              <Callout tooltip onPress={() => (navigation as any).navigate('Detail', { estabelecimento: estab })}>
                <View style={styles.calloutContainer}>
                  <Image source={{ uri: estab.imagem }} style={styles.calloutImage} />
                  <View style={styles.calloutInfo}>
                    <Text style={styles.calloutTitle} numberOfLines={1}>{estab.nome}</Text>
                    <Text style={styles.calloutCategory}>{estab.categoria} • {estab.faixaPreco}</Text>
                    <Text style={styles.calloutLink}>Ver detalhes</Text>
                  </View>
                </View>
              </Callout>
            </Marker>
          ))}
        </MapView>
      </View>
    </SafeAreaView>
  );
};

const getStyles = (colors: ThemeColors) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
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
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  iconContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: colors.accentUltraLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 28,
  },
  comingSoonTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    fontFamily: FONTS.bold,
    marginBottom: 12,
  },
  comingSoonDesc: {
    fontSize: 15,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 24,
  },
  mapContainer: {
    flex: 1,
    borderRadius: 24,
    overflow: 'hidden',
    margin: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  markerContainer: {
    alignItems: 'center',
  },
  markerBadge: {
    backgroundColor: colors.accent,
    padding: 6,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  markerTriangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderBottomWidth: 6,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: colors.primary,
    transform: [{ rotate: '180deg' }],
    marginTop: -1,
  },
  calloutContainer: {
    width: 200,
    backgroundColor: colors.card,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  calloutImage: {
    width: '100%',
    height: 100,
  },
  calloutInfo: {
    padding: 10,
  },
  calloutTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.text,
    fontFamily: FONTS.semiBold,
  },
  calloutCategory: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
  },
  calloutLink: {
    fontSize: 12,
    color: colors.accent,
    fontWeight: '600',
    marginTop: 6,
  },
});

// Estilo de mapa escuro para combinar com o tema do app
const mapStyle = [
  { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#d59563' }],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#d59563' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [{ color: '#263c3f' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#6b9a76' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#38414e' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#212a37' }],
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#9ca5b3' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{ color: '#746855' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#1f2835' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#f3d19c' }],
  },
  {
    featureType: 'transit',
    elementType: 'geometry',
    stylers: [{ color: '#2f3948' }],
  },
  {
    featureType: 'transit.station',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#d59563' }],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#17263c' }],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#515c6d' }],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.stroke',
    stylers: [{ color: '#17263c' }],
  },
];
