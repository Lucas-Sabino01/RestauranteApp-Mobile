import React, { useState, useCallback } from 'react';
import {
  StyleSheet, Text, View, SafeAreaView, Platform, StatusBar,
  FlatList, ScrollView, Image, TouchableOpacity, RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Toast from 'react-native-toast-message';
import { COLORS } from '../theme/colors';
import { FONTS } from '../theme/fonts';
import { formatarPreco } from '../types';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { useProducts, useDestaques } from '../hooks/useProducts';
import { useCategories } from '../hooks/useCategories';
import { CategoryButton } from '../components/CategoryButton';
import { ProductCard } from '../components/ProductCard';
import { ProductCardSkeleton, ProductCardVerticalSkeleton } from '../components/ui/SkeletonLoader';
import type { HomeScreenProps } from '../navigation/types';
import type { RootTabNavigationProp } from '../navigation/types';
import type { Produto } from '../types';

export const HomeScreen = ({ navigation }: HomeScreenProps) => {
  const [categoriaAtiva, setCategoriaAtiva] = useState('Tudo');
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { categories } = useCategories();
  const { products, loading: productsLoading, refetch: refetchProducts } = useProducts(categoriaAtiva);
  const { products: destaques, loading: destaquesLoading } = useDestaques();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    refetchProducts();
    setTimeout(() => setRefreshing(false), 600);
  }, [refetchProducts]);

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

  const nomeUsuario = user?.nome || 'Visitante';
  const hora = new Date().getHours();
  const saudacao = hora < 12 ? 'Bom dia' : hora < 18 ? 'Boa tarde' : 'Boa noite';

  const renderProduct = useCallback(({ item }: { item: Produto }) => (
    <ProductCard
      produto={item}
      variant="horizontal"
      isFavorito={isFavorite(item.id)}
      onToggleFavorito={() => toggleFavorite(item.id)}
      onAddToCart={() => handleAddToCart(item)}
      onPress={() => navigation.navigate('Detail', { produto: item })}
    />
  ), [isFavorite, toggleFavorite, handleAddToCart, navigation]);

  const ListHeader = () => (
    <>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.locationRow}>
            <Ionicons name="location" size={14} color={COLORS.accent} />
            <Text style={styles.headerLocal}>Curitiba, PR</Text>
          </View>
          <Text style={styles.saudacao}>{saudacao}, {nomeUsuario}!</Text>
          <Text style={styles.titulo}>O que vamos{'\n'}pedir hoje? ☕</Text>
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
        <Ionicons name="search" size={18} color={COLORS.textMuted} />
        <Text style={styles.searchPlaceholder}>Pesquisar café, lanche...</Text>
        <View style={styles.filterButton}>
          <Ionicons name="options-outline" size={18} color={COLORS.primary} />
        </View>
      </TouchableOpacity>
      <View style={styles.bannerContainer}>
        <View style={styles.bannerGradient}>
          <View style={styles.bannerContent}>
            <View style={styles.bannerBadge}>
              <Text style={styles.bannerBadgeText}>OFERTA ESPECIAL</Text>
            </View>
            <Text style={styles.bannerTitulo}>Compre 1{'\n'}Leve 2!</Text>
            <Text style={styles.bannerDesc}>Em todos os cappuccinos{'\n'}até sexta-feira</Text>
            <TouchableOpacity style={styles.bannerBotao} activeOpacity={0.8}>
              <Text style={styles.bannerBotaoTexto}>Pedir agora</Text>
              <Ionicons name="arrow-forward" size={16} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=300&q=80' }}
            style={styles.bannerImagem}
          />
        </View>
      </View>
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
          <Ionicons name="flame" size={20} color={COLORS.accent} />
          <Text style={styles.secaoTitulo}>Destaques</Text>
        </View>
      </View>

      {destaquesLoading ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.destaquesScroll}>
          {[1, 2, 3].map((i) => <ProductCardVerticalSkeleton key={i} />)}
        </ScrollView>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.destaquesScroll}
        >
          {destaques.map((item) => (
            <ProductCard
              key={item.id}
              produto={item}
              variant="vertical"
              isFavorito={isFavorite(item.id)}
              onToggleFavorito={() => toggleFavorite(item.id)}
              onPress={() => navigation.navigate('Detail', { produto: item })}
            />
          ))}
        </ScrollView>
      )}
      <View style={styles.secaoHeader}>
        <View style={styles.secaoTituloRow}>
          <Ionicons name="restaurant" size={20} color={COLORS.accent} />
          <Text style={styles.secaoTitulo}>Cardápio</Text>
        </View>
      </View>
      {productsLoading && (
        <View>
          {[1, 2, 3].map((i) => <ProductCardSkeleton key={i} />)}
        </View>
      )}
    </>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      <FlatList
        data={productsLoading ? [] : products}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={<View style={{ height: 20 }} />}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={COLORS.accent}
            colors={[COLORS.accent]}
          />
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.primary,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  scrollContainer: {
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 20,
    marginBottom: 20,
  },
  headerLeft: { flex: 1 },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 6,
  },
  headerLocal: {
    fontSize: 12,
    color: COLORS.accent,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  saudacao: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 4,
    fontFamily: FONTS.regular,
  },
  titulo: {
    fontSize: 26,
    fontWeight: 'bold',
    color: COLORS.text,
    lineHeight: 34,
    fontFamily: FONTS.bold,
  },
  avatarContainer: { position: 'relative' },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    borderColor: COLORS.accent,
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
  searchPlaceholder: { flex: 1, fontSize: 15, color: COLORS.textMuted },
  filterButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: COLORS.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerContainer: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 24,
  },
  bannerGradient: {
    flexDirection: 'row',
    backgroundColor: COLORS.brown,
    padding: 20,
    borderRadius: 20,
    minHeight: 160,
  },
  bannerContent: { flex: 1, justifyContent: 'center' },
  bannerBadge: {
    backgroundColor: COLORS.accentLight,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 10,
  },
  bannerBadgeText: {
    color: COLORS.accent,
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  bannerTitulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    lineHeight: 30,
    marginBottom: 6,
  },
  bannerDesc: {
    fontSize: 13,
    color: COLORS.textWarm,
    lineHeight: 18,
    marginBottom: 12,
  },
  bannerBotao: {
    backgroundColor: COLORS.accent,
    alignSelf: 'flex-start',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  bannerBotaoTexto: {
    color: COLORS.primary,
    fontWeight: 'bold',
    fontSize: 13,
  },
  bannerImagem: {
    width: 110,
    height: 140,
    borderRadius: 16,
    marginLeft: 10,
  },
  categoriasContainer: { marginBottom: 24 },
  secaoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  secaoTituloRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  secaoTitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    fontFamily: FONTS.semiBold,
  },
  destaquesScroll: {
    paddingBottom: 4,
    marginBottom: 24,
  },
});
