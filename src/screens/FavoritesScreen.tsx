import React, { useMemo, useCallback } from 'react';
import {
  StyleSheet, Text, View, SafeAreaView, Platform, StatusBar,
  FlatList, TouchableOpacity,
} from 'react-native';
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
  const { colors } = useTheme();
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
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

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
          <View style={styles.emptyIcon}>
            <Ionicons name="heart-outline" size={64} color={colors.textMuted} />
          </View>
          <Text style={styles.emptyTitle}>Nenhum favorito</Text>
          <Text style={styles.emptyDesc}>
            Toque no ❤️ nos estabelecimentos{'\n'}para salvá-los aqui
          </Text>
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
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
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
  emptyIcon: {
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  emptyDesc: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: 22,
  },
});
