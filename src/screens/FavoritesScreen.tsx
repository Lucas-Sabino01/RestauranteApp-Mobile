import React from 'react';
import {
  StyleSheet, Text, View, SafeAreaView, Platform, StatusBar,
  FlatList, TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Toast from 'react-native-toast-message';
import { COLORS } from '../theme/colors';
import { useCart } from '../contexts/CartContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { useProducts } from '../hooks/useProducts';
import { ProductCard } from '../components/ProductCard';
import { ProductCardSkeleton } from '../components/ui/SkeletonLoader';
import { Header } from '../components/Header';
import type { FavoritesScreenProps, RootTabNavigationProp } from '../navigation/types';
import type { Produto } from '../types';

export const FavoritesScreen = ({ navigation }: FavoritesScreenProps) => {
  const { isFavorite, toggleFavorite, favorites } = useFavorites();
  const { products, loading } = useProducts('Tudo');
  const { addToCart } = useCart();

  const handleAddToCart = (produto: Produto) => {
    addToCart(produto, 1, 'M');
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Toast.show({
      type: 'success',
      text1: 'Adicionado ao carrinho',
      text2: `${produto.nome} (Médio)`,
      visibilityTime: 2000,
    });
  };

  const favoriteProducts = products.filter((p) => favorites.includes(p.id));

  const renderProduct = ({ item }: { item: Produto }) => (
    <ProductCard
      produto={item}
      variant="horizontal"
      isFavorito={isFavorite(item.id)}
      onToggleFavorito={() => toggleFavorite(item.id)}
      onAddToCart={() => handleAddToCart(item)}
      onPress={() => navigation.navigate('FavoritesDetail', { produto: item })}
    />
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      <View style={{ paddingHorizontal: 16 }}>
        <Header title="Meus Favoritos" showBack onBack={() => navigation.goBack()} />
      </View>

      <View style={styles.content}>
        {loading ? (
          <View>
            {[1, 2, 3].map((i) => <ProductCardSkeleton key={i} />)}
          </View>
        ) : favoriteProducts.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="heart-dislike-outline" size={64} color={COLORS.textMuted} />
            <Text style={styles.emptyTitulo}>Nenhum favorito</Text>
            <Text style={styles.emptyDesc}>
              Você ainda não salvou nenhum produto.{'\n'}Explore o cardápio e favorite os seus preferidos!
            </Text>
            <TouchableOpacity 
              style={styles.emptyBotao}
              onPress={() => navigation.getParent<RootTabNavigationProp>()?.navigate('HomeTab')}
            >
              <Text style={styles.emptyBotaoTexto}>Explorar cardápio</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={favoriteProducts}
            renderItem={renderProduct}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.primary,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  listContent: {
    paddingBottom: 40,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
    marginTop: 16,
  },
  emptyDesc: {
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  emptyBotao: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 25,
  },
  emptyBotaoTexto: {
    color: COLORS.primary,
    fontWeight: 'bold',
    fontSize: 15,
  },
});
