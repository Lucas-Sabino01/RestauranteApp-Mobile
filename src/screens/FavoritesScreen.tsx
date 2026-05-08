import React, { useMemo, useCallback } from 'react';
import {
  StyleSheet, Text, View, Platform, StatusBar,
  FlatList, TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import type { ThemeColors } from '../theme/colors';
import { FONTS } from '../theme/fonts';
import { useFavorites } from '../contexts/FavoritesContext';
import { ESTABELECIMENTOS } from '../data/mock';
import { EstablishmentCard } from '../components/EstablishmentCard';
import type { FavoritesScreenProps } from '../navigation/types';
import type { Estabelecimento } from '../types';

export const FavoritesScreen = ({ navigation }: FavoritesScreenProps) => {
  const { colors, isDark } = useTheme();
  const styles = getStyles(colors);

  const { favorites, isFavorite, toggleFavorite, clearFavorites } = useFavorites();

  const favEstabelecimentos = useMemo(
    () => ESTABELECIMENTOS.filter((e) => favorites.includes(e.id)),
    [favorites]
  );

  const renderItem = useCallback(({ item }: { item: Estabelecimento }) => (
    <EstablishmentCard
      estabelecimento={item}
      variant="horizontal"
      isFavorito={isFavorite(item.id)}
      onToggleFavorito={() => toggleFavorite(item.id)}
      onPress={() => navigation.navigate('FavoritesDetail', { estabelecimento: item })}
    />
  ), [isFavorite, toggleFavorite, navigation]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.primary} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.titulo}>Favoritos</Text>
        {favorites.length > 0 && (
          <TouchableOpacity onPress={clearFavorites} activeOpacity={0.7}>
            <Text style={styles.clearText}>Limpar</Text>
          </TouchableOpacity>
        )}
      </View>

      {favEstabelecimentos.length === 0 ? (
        <View style={styles.emptyState}>
          <View style={styles.emptyIllustration}>
            <View style={[styles.emptyBubble, styles.bubble1]}>
              <Ionicons name="restaurant" size={24} color={colors.accent} />
            </View>
            <View style={[styles.emptyBubble, styles.bubble2]}>
              <Ionicons name="cafe" size={20} color={colors.accent} />
            </View>
            <View style={[styles.emptyBubble, styles.bubble3]}>
              <Ionicons name="pizza" size={28} color={colors.accent} />
            </View>
            <View style={styles.emptyHeartContainer}>
              <Ionicons name="heart" size={64} color={colors.danger} />
            </View>
          </View>
          <Text style={styles.emptyTitle}>Nenhum favorito</Text>
          <Text style={styles.emptyDesc}>
            Toque no ❤️ nos estabelecimentos{'\n'}para salvá-los aqui
          </Text>
          <TouchableOpacity 
            style={styles.emptyBtn} 
            onPress={() => navigation.getParent<any>()?.navigate('HomeTab')}
            activeOpacity={0.8}
          >
            <Text style={styles.emptyBtnText}>Explorar locais</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={favEstabelecimentos}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <Text style={styles.countText}>
              {favEstabelecimentos.length} {favEstabelecimentos.length === 1 ? 'lugar salvo' : 'lugares salvos'}
            </Text>
          }
        />
      )}
    </SafeAreaView>
  );
};

const getStyles = (colors: ThemeColors) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  backBtn: {
    marginRight: 14,
  },
  titulo: {
    flex: 1,
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
    fontFamily: FONTS.bold,
  },
  clearText: {
    fontSize: 14,
    color: colors.danger,
    fontWeight: '600',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  countText: {
    fontSize: 13,
    color: colors.textMuted,
    marginBottom: 14,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIllustration: {
    width: 160,
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyHeartContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.danger + '15',
    justifyContent: 'center',
    alignItems: 'center',
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
  },
  bubble1: {
    top: 0,
    left: 10,
    transform: [{ rotate: '-15deg' }],
  },
  bubble2: {
    top: 30,
    right: 0,
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
  },
  emptyDesc: {
    fontSize: 15,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 22,
    fontFamily: FONTS.regular,
    marginBottom: 32,
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
});
