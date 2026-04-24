import React, { useState } from 'react';
import {
  StyleSheet, Text, View, SafeAreaView, Platform, StatusBar,
  ScrollView, Image, TouchableOpacity, Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Toast from 'react-native-toast-message';
import { COLORS } from '../theme/colors';
import { FONTS } from '../theme/fonts';
import type { Produto, Tamanho } from '../types';
import { formatarPreco, MULTIPLICADOR_TAMANHO, TAMANHO_LABELS } from '../types';
import { useCart } from '../contexts/CartContext';
import { Header } from '../components/Header';
import type { AnyDetailScreenProps } from '../navigation/types';

const { width } = Dimensions.get('window');
export const DetailScreen = ({ route, navigation }: AnyDetailScreenProps) => {
  const { produto } = route.params as { produto: Produto };
  const [tamanho, setTamanho] = useState<Tamanho>('M');
  const [quantidade, setQuantidade] = useState(1);
  const { addToCart } = useCart();

  const precoComTamanho = produto.preco * MULTIPLICADOR_TAMANHO[tamanho];
  const precoTotal = precoComTamanho * quantidade;

  const handleAddToCart = () => {
    addToCart(produto, quantidade, tamanho);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Toast.show({
      type: 'success',
      text1: 'Adicionado ao carrinho!',
      text2: `${quantidade}x ${produto.nome} (${TAMANHO_LABELS[tamanho]})`,
      visibilityTime: 2500,
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.heroContainer}>
          <Image source={{ uri: produto.imagem }} style={styles.heroImage} />
          <View style={styles.heroOverlay} />
          <View style={styles.headerAbsolute}>
            <Header
              title=""
              showBack
              onBack={() => navigation.goBack()}
              rightElement={
                <TouchableOpacity style={styles.shareBtn}>
                  <Ionicons name="share-outline" size={20} color={COLORS.text} />
                </TouchableOpacity>
              }
            />
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.infoRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.categoria}>{produto.categoria}</Text>
              <Text style={styles.nome}>{produto.nome}</Text>
            </View>
            <View style={styles.avaliacaoBox}>
              <Ionicons name="star" size={16} color={COLORS.star} />
              <Text style={styles.avaliacao}>{produto.avaliacao}</Text>
            </View>
          </View>

          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Ionicons name="time-outline" size={16} color={COLORS.accent} />
              <Text style={styles.metaTexto}>{produto.tempo}</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="flame-outline" size={16} color={COLORS.accent} />
              <Text style={styles.metaTexto}>Popular</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="star-outline" size={16} color={COLORS.accent} />
              <Text style={styles.metaTexto}>Favorito</Text>
            </View>
          </View>

          <Text style={styles.descricao}>{produto.descricao}</Text>

          {produto.ingredientes && (
            <>
              <Text style={styles.secaoTitulo}>Ingredientes</Text>
              <View style={styles.ingredientesContainer}>
                {produto.ingredientes.map((ing, i) => (
                  <View key={i} style={styles.ingredienteTag}>
                    <Text style={styles.ingredienteTexto}>{ing}</Text>
                  </View>
                ))}
              </View>
            </>
          )}

          <Text style={styles.secaoTitulo}>Tamanho</Text>
          <View style={styles.tamanhosRow}>
            {(['P', 'M', 'G'] as Tamanho[]).map((t) => {
              const isAtivo = tamanho === t;
              return (
                <TouchableOpacity
                  key={t}
                  style={[styles.tamanhoBotao, isAtivo && styles.tamanhoBotaoAtivo]}
                  onPress={() => {
                    setTamanho(t);
                    Haptics.selectionAsync();
                  }}
                >
                  <Text style={[styles.tamanhoLetra, isAtivo && styles.tamanhoLetraAtiva]}>{t}</Text>
                  <Text style={[styles.tamanhoLabel, isAtivo && styles.tamanhoLabelAtiva]}>
                    {TAMANHO_LABELS[t]}
                  </Text>
                  <Text style={[styles.tamanhoPreco, isAtivo && styles.tamanhoPrecoAtivo]}>
                    {formatarPreco(produto.preco * MULTIPLICADOR_TAMANHO[t])}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={styles.secaoTitulo}>Quantidade</Text>
          <View style={styles.quantidadeRow}>
            <TouchableOpacity
              style={styles.quantidadeBotao}
              onPress={() => {
                setQuantidade((q) => Math.max(1, q - 1));
                Haptics.selectionAsync();
              }}
            >
              <Ionicons name="remove" size={22} color={COLORS.accent} />
            </TouchableOpacity>
            <Text style={styles.quantidadeNumero}>{quantidade}</Text>
            <TouchableOpacity
              style={styles.quantidadeBotao}
              onPress={() => {
                setQuantidade((q) => q + 1);
                Haptics.selectionAsync();
              }}
            >
              <Ionicons name="add" size={22} color={COLORS.accent} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <View style={styles.precoContainer}>
          <Text style={styles.precoLabel}>Total</Text>
          <Text style={styles.precoTotal}>{formatarPreco(precoTotal)}</Text>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={handleAddToCart} activeOpacity={0.8}>
          <Text style={styles.addButtonText}>Adicionar ao carrinho</Text>
          <Ionicons name="cart" size={20} color={COLORS.primary} />
        </TouchableOpacity>
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
  heroContainer: {
    position: 'relative',
    width,
    height: 300,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(27, 16, 21, 0.3)',
  },
  headerAbsolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
  },
  shareBtn: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: COLORS.card,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 100,
  },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  categoria: {
    fontSize: 13,
    color: COLORS.accent,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  nome: {
    fontSize: 26,
    fontWeight: 'bold',
    color: COLORS.text,
    lineHeight: 32,
    fontFamily: FONTS.bold,
  },
  avaliacaoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 4,
  },
  avaliacao: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },

  metaRow: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 6,
  },
  metaTexto: { fontSize: 13, color: COLORS.textSecondary, fontWeight: '500' },

  descricao: {
    fontSize: 15,
    color: COLORS.textSecondary,
    lineHeight: 24,
    marginBottom: 24,
  },

  secaoTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 14,
    fontFamily: FONTS.semiBold,
  },

  ingredientesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  ingredienteTag: {
    backgroundColor: COLORS.card,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  ingredienteTexto: {
    fontSize: 13,
    color: COLORS.textWarm,
  },

  tamanhosRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  tamanhoBotao: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: COLORS.card,
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  tamanhoBotaoAtivo: {
    borderColor: COLORS.accent,
    backgroundColor: COLORS.accentLight,
  },
  tamanhoLetra: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textMuted,
    marginBottom: 4,
  },
  tamanhoLetraAtiva: { color: COLORS.accent },
  tamanhoLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginBottom: 4,
  },
  tamanhoLabelAtiva: { color: COLORS.textWarm },
  tamanhoPreco: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  tamanhoPrecoAtivo: { color: COLORS.accent },

  quantidadeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
    marginBottom: 24,
  },
  quantidadeBotao: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: COLORS.card,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  quantidadeNumero: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.text,
    minWidth: 40,
    textAlign: 'center',
  },

  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: Platform.OS === 'ios' ? 30 : 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  precoContainer: { marginRight: 20 },
  precoLabel: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginBottom: 2,
  },
  precoTotal: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.accent,
  },
  addButton: {
    flex: 1,
    backgroundColor: COLORS.accent,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  addButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: FONTS.bold,
  },
});
