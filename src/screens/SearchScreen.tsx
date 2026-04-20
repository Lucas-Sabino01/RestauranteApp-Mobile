import React, { useState, useMemo } from 'react';
import {
  StyleSheet, Text, View, SafeAreaView, Platform, StatusBar,
  ScrollView, TextInput, TouchableOpacity,
} from 'react-native';
import { COLORS } from '../theme/colors';
import { buscarProdutos, PRODUTOS } from '../data/mock';
import { useCart } from '../contexts/CartContext';
import { ProductCard } from '../components/ProductCard';

const PESQUISAS_POPULARES = ['Cappuccino', 'Brownie', 'Iced Latte', 'Croissant', 'Cold Brew'];

export const SearchScreen = ({ navigation }: any) => {
  const [termo, setTermo] = useState('');
  const { addToCart } = useCart();
  const [favoritos, setFavoritos] = useState<string[]>([]);

  const resultados = useMemo(() => {
    if (termo.trim().length === 0) return [];
    return buscarProdutos(termo);
  }, [termo]);

  const toggleFavorito = (id: string) => {
    setFavoritos(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      <View style={styles.headerPadding}>
        <Text style={styles.titulo}>Buscar</Text>

        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="O que você procura?"
            placeholderTextColor={COLORS.textMuted}
            value={termo}
            onChangeText={setTermo}
            autoFocus
          />
          {termo.length > 0 && (
            <TouchableOpacity onPress={() => setTermo('')}>
              <Text style={styles.clearIcon}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {termo.trim().length === 0 && (
          <>
            <Text style={styles.secaoTitulo}>🔥 Pesquisas populares</Text>
            <View style={styles.tagsContainer}>
              {PESQUISAS_POPULARES.map((p, i) => (
                <TouchableOpacity key={i} style={styles.tag} onPress={() => setTermo(p)}>
                  <Text style={styles.tagTexto}>{p}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[styles.secaoTitulo, { marginTop: 24 }]}>💡 Sugestões para você</Text>
            {PRODUTOS.slice(0, 4).map((produto) => (
              <ProductCard
                key={produto.id}
                produto={produto}
                variant="horizontal"
                isFavorito={favoritos.includes(produto.id)}
                onToggleFavorito={() => toggleFavorito(produto.id)}
                onAddToCart={() => addToCart(produto, 1, 'M')}
                onPress={() => navigation.navigate('SearchDetail', { produto })}
              />
            ))}
          </>
        )}

        {termo.trim().length > 0 && resultados.length === 0 && (
          <View style={styles.noResults}>
            <Text style={styles.noResultsIcon}>😕</Text>
            <Text style={styles.noResultsTitle}>Nenhum resultado</Text>
            <Text style={styles.noResultsDesc}>
              Não encontramos "{termo}". Tente outro termo.
            </Text>
          </View>
        )}

        {termo.trim().length > 0 && resultados.length > 0 && (
          <>
            <Text style={styles.resultCount}>
              {resultados.length} {resultados.length === 1 ? 'resultado' : 'resultados'}
            </Text>
            {resultados.map((produto) => (
              <ProductCard
                key={produto.id}
                produto={produto}
                variant="horizontal"
                isFavorito={favoritos.includes(produto.id)}
                onToggleFavorito={() => toggleFavorito(produto.id)}
                onAddToCart={() => addToCart(produto, 1, 'M')}
                onPress={() => navigation.navigate('SearchDetail', { produto })}
              />
            ))}
          </>
        )}
      </ScrollView>
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
  },
  searchIcon: { fontSize: 16, marginRight: 10 },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: COLORS.text,
  },
  clearIcon: {
    fontSize: 16,
    color: COLORS.textMuted,
    padding: 4,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  secaoTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 14,
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
  noResultsIcon: { fontSize: 48, marginBottom: 16 },
  noResultsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  noResultsDesc: {
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
});
