import React, { useState, useCallback } from 'react';
import {
  StyleSheet, Text, View, SafeAreaView, Platform, StatusBar,
  ScrollView, TextInput, Image, TouchableOpacity, Dimensions,
} from 'react-native';
import { COLORS } from '../theme/colors';
import {
  CATEGORIAS, getDestaques, getProdutosPorCategoria, formatarPreco,
} from '../data/mock';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { CategoryButton } from '../components/CategoryButton';
import { ProductCard } from '../components/ProductCard';

const { width } = Dimensions.get('window');

export const HomeScreen = ({ navigation }: any) => {
  const [categoriaAtiva, setCategoriaAtiva] = useState('Tudo');
  const [favoritos, setFavoritos] = useState<string[]>([]);
  const { addToCart } = useCart();
  const { user } = useAuth();

  const toggleFavorito = useCallback((id: string) => {
    setFavoritos(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  }, []);

  const destaques = getDestaques();
  const produtos = getProdutosPorCategoria(categoriaAtiva);

  const nomeUsuario = user?.nome || 'Visitante';

  const hora = new Date().getHours();
  const saudacao = hora < 12 ? 'Bom dia' : hora < 18 ? 'Boa tarde' : 'Boa noite';

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>

        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerLocal}>📍 Curitiba, PR</Text>
            <Text style={styles.saudacao}>{saudacao}, {nomeUsuario}!</Text>
            <Text style={styles.titulo}>O que vamos{'\n'}pedir hoje? ☕</Text>
          </View>
          <TouchableOpacity
            style={styles.avatarContainer}
            onPress={() => navigation.navigate('ProfileTab')}
          >
            <Image
              source={{ uri: user?.avatar || 'https://randomuser.me/api/portraits/men/32.jpg' }}
              style={styles.avatar}
            />
            <View style={styles.notificacaoBadge}>
              <Text style={styles.notificacaoTexto}>2</Text>
            </View>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.searchContainer}
          activeOpacity={0.7}
          onPress={() => navigation.navigate('SearchTab')}
        >
          <Text style={styles.searchIcon}>🔍</Text>
          <Text style={styles.searchPlaceholder}>Pesquisar café, lanche...</Text>
          <View style={styles.filterButton}>
            <Text style={styles.filterIcon}>⚙️</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={0.9}>
          <View style={styles.bannerContainer}>
            <View style={styles.bannerGradient}>
              <View style={styles.bannerContent}>
                <View style={styles.bannerBadge}>
                  <Text style={styles.bannerBadgeText}>OFERTA ESPECIAL</Text>
                </View>
                <Text style={styles.bannerTitulo}>Compre 1{'\n'}Leve 2!</Text>
                <Text style={styles.bannerDesc}>Em todos os cappuccinos{'\n'}até sexta-feira</Text>
                <View style={styles.bannerBotao}>
                  <Text style={styles.bannerBotaoTexto}>Pedir agora →</Text>
                </View>
              </View>
              <Image
                source={{ uri: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=300&q=80' }}
                style={styles.bannerImagem}
              />
            </View>
          </View>
        </TouchableOpacity>

        <View style={styles.categoriasContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {CATEGORIAS.map((cat) => (
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
          <Text style={styles.secaoTitulo}>🔥 Destaques</Text>
          <TouchableOpacity>
            <Text style={styles.verTudo}>Ver tudo</Text>
          </TouchableOpacity>
        </View>

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
              isFavorito={favoritos.includes(item.id)}
              onToggleFavorito={() => toggleFavorito(item.id)}
              onPress={() => navigation.navigate('Detail', { produto: item })}
            />
          ))}
        </ScrollView>

        <View style={styles.secaoHeader}>
          <Text style={styles.secaoTitulo}>📋 Cardápio</Text>
          <TouchableOpacity>
            <Text style={styles.verTudo}>Ver tudo</Text>
          </TouchableOpacity>
        </View>

        {produtos.map((produto) => (
          <ProductCard
            key={produto.id}
            produto={produto}
            variant="horizontal"
            isFavorito={favoritos.includes(produto.id)}
            onToggleFavorito={() => toggleFavorito(produto.id)}
            onAddToCart={() => addToCart(produto, 1, 'M')}
            onPress={() => navigation.navigate('Detail', { produto })}
          />
        ))}

        <View style={{ height: 20 }} />
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
  headerLocal: {
    fontSize: 12,
    color: COLORS.accent,
    marginBottom: 6,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  saudacao: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  titulo: {
    fontSize: 26,
    fontWeight: 'bold',
    color: COLORS.text,
    lineHeight: 34,
  },
  avatarContainer: { position: 'relative' },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    borderColor: COLORS.accent,
  },
  notificacaoBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: COLORS.danger,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  notificacaoTexto: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: 'bold',
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
  searchPlaceholder: { flex: 1, fontSize: 15, color: COLORS.textMuted },
  filterButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: COLORS.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterIcon: { fontSize: 16 },
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
  secaoTitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  verTudo: {
    fontSize: 14,
    color: COLORS.accent,
    fontWeight: '600',
  },
  destaquesScroll: {
    paddingBottom: 4,
    marginBottom: 24,
  },
});
