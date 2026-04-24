import React, { useState, useMemo, useCallback } from 'react';
import {
  StyleSheet, Text, View, SafeAreaView, Platform, StatusBar,
  FlatList, TextInput, TouchableOpacity, RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Toast from 'react-native-toast-message';
import { COLORS } from '../theme/colors';
import { useSearchProducts, useProducts } from '../hooks/useProducts';
import { useCart } from '../contexts/CartContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { ProductCard } from '../components/ProductCard';
import { ProductCardSkeleton } from '../components/ui/SkeletonLoader';
import type { SearchScreenProps } from '../navigation/types';
import type { Produto } from '../types';

const PESQUISAS_POPULARES = ['Cappuccino', 'Brownie', 'Iced Latte', 'Croissant', 'Cold Brew'];

export const SearchScreen = ({ navigation }: SearchScreenProps) => {
  const [termo, setTermo] = useState('');
  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { results, loading, search } = useSearchProducts();
  const { products: allProducts } = useProducts();

  const sugestoes = useMemo(() => allProducts.slice(0, 4), [allProducts]);

  const handleSearch = useCallback((text: string) => {
    setTermo(text);
    search(text);
  }, [search]);

  const handleAddToCart = useCallback((produto: Produto) => {
    addToCart(produto, 1, 'M');
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Toast.show({
      type: 'success',
      text1: 'Adicionado ao carrinho',
      text2: `${produto.nome} (Médio)`,
      visibilityTime: 2000,
    });
  }, [addToCart]);

  const renderProduct = useCallback(({ item }: { item: Produto }) => (
    <ProductCard
      produto={item}
      variant="horizontal"
      isFavorito={isFavorite(item.id)}
      onToggleFavorito={() => toggleFavorite(item.id)}
      onAddToCart={() => handleAddToCart(item)}
      onPress={() => navigation.navigate('SearchDetail', { produto: item })}
    />
  ), [isFavorite, toggleFavorite, handleAddToCart, navigation]);

  const EmptySearch = () => (
    <>
      <View style={styles.secaoTituloRow}>
        <Ionicons name="flame" size={18} color={COLORS.accent} />
        <Text style={styles.secaoTitulo}>Pesquisas populares</Text>
      </View>
      <View style={styles.tagsContainer}>
        {PESQUISAS_POPULARES.map((p, i) => (
          <TouchableOpacity key={i} style={styles.tag} onPress={() => handleSearch(p)}>
            <Text style={styles.tagTexto}>{p}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={[styles.secaoTituloRow, { marginTop: 24 }]}>
        <Ionicons name="bulb-outline" size={18} color={COLORS.accent} />
        <Text style={styles.secaoTitulo}>Sugestões para você</Text>
      </View>
      {sugestoes.map((produto) => (
        <ProductCard
          key={produto.id}
          produto={produto}
          variant="horizontal"
          isFavorito={isFavorite(produto.id)}
          onToggleFavorito={() => toggleFavorite(produto.id)}
          onAddToCart={() => handleAddToCart(produto)}
          onPress={() => navigation.navigate('SearchDetail', { produto })}
        />
      ))}
    </>
  );

  const NoResults = () => (
    <View style={styles.noResults}>
      <Ionicons name="search-outline" size={64} color={COLORS.textMuted} />
      <Text style={styles.noResultsTitle}>Nenhum resultado</Text>
      <Text style={styles.noResultsDesc}>
        Não encontramos "{termo}". Tente outro termo.
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      <View style={styles.headerPadding}>
        <Text style={styles.titulo}>Buscar</Text>

        <View style={styles.searchContainer}>
          <Ionicons name="search" size={18} color={COLORS.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="O que você procura?"
            placeholderTextColor={COLORS.textMuted}
            value={termo}
            onChangeText={handleSearch}
            autoFocus
          />
          {termo.length > 0 && (
            <TouchableOpacity onPress={() => handleSearch('')}>
              <Ionicons name="close-circle" size={20} color={COLORS.textMuted} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {termo.trim().length === 0 ? (
        <FlatList
          data={[]}
          renderItem={() => null}
          ListHeaderComponent={EmptySearch}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        />
      ) : loading ? (
        <View style={styles.scrollContent}>
          {[1, 2, 3].map((i) => <ProductCardSkeleton key={i} />)}
        </View>
      ) : results.length === 0 ? (
        <NoResults />
      ) : (
        <FlatList
          data={results}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={
            <Text style={styles.resultCount}>
              {results.length} {results.length === 1 ? 'resultado' : 'resultados'}
            </Text>
          }
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.primary,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  headerPadding: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 52,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: COLORS.text,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  secaoTituloRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  secaoTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  tag: {
    backgroundColor: COLORS.card,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tagTexto: {
    color: COLORS.textWarm,
    fontSize: 14,
    fontWeight: '500',
  },

  resultCount: {
    fontSize: 14,
    color: COLORS.textMuted,
    marginBottom: 16,
  },
  noResults: {
    alignItems: 'center',
    paddingTop: 60,
  },
  noResultsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
    marginTop: 16,
  },
  noResultsDesc: {
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});
