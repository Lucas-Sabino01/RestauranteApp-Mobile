import React from 'react';
import {
  StyleSheet, Text, View, SafeAreaView, Platform, StatusBar,
  ScrollView, Image, TouchableOpacity, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { COLORS } from '../theme/colors';
import { formatarPreco, MULTIPLICADOR_TAMANHO, TAMANHO_LABELS } from '../types';
import { useCart } from '../contexts/CartContext';
import { Header } from '../components/Header';
import type { CartScreenProps } from '../navigation/types';

export const CartScreen = ({ navigation }: CartScreenProps) => {
  const { items, updateQuantity, removeFromCart, clearCart, totalPriceFormatted, totalItems } = useCart();

  const handleCheckout = () => {
    if (items.length === 0) {
      Alert.alert('Carrinho vazio', 'Adicione itens antes de finalizar.');
      return;
    }
    navigation.navigate('Checkout');
  };

  const handleClearCart = () => {
    Alert.alert(
      'Limpar carrinho',
      'Tem certeza que deseja remover todos os itens?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Limpar',
          style: 'destructive',
          onPress: () => {
            clearCart();
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          },
        },
      ]
    );
  };

  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
        <Header title="Carrinho" />
        <View style={styles.emptyContainer}>
          <Ionicons name="cart-outline" size={80} color={COLORS.textMuted} />
          <Text style={styles.emptyTitulo}>Carrinho vazio</Text>
          <Text style={styles.emptyDesc}>Adicione delícias do nosso cardápio!</Text>
          <TouchableOpacity
            style={styles.emptyBotao}
            onPress={() => (navigation as any).navigate('HomeTab')}
          >
            <Text style={styles.emptyBotaoTexto}>Explorar cardápio</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      <View style={styles.headerRow}>
        <Header
          title="Carrinho"
          rightElement={
            <TouchableOpacity onPress={handleClearCart}>
              <Text style={styles.limparTexto}>Limpar</Text>
            </TouchableOpacity>
          }
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {items.map((item) => {
          const precoUnitario = item.produto.preco * MULTIPLICADOR_TAMANHO[item.tamanho];
          const precoSubtotal = precoUnitario * item.quantidade;

          return (
            <View key={`${item.produto.id}-${item.tamanho}`} style={styles.itemCard}>
              <Image source={{ uri: item.produto.imagem }} style={styles.itemImagem} />

              <View style={styles.itemInfo}>
                <View style={styles.itemTopo}>
                  <Text style={styles.itemNome} numberOfLines={1}>{item.produto.nome}</Text>
                  <TouchableOpacity
                    onPress={() => {
                      removeFromCart(item.produto.id, item.tamanho);
                      Haptics.selectionAsync();
                    }}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Ionicons name="close" size={18} color={COLORS.textMuted} />
                  </TouchableOpacity>
                </View>

                <Text style={styles.itemTamanho}>
                  Tamanho: {TAMANHO_LABELS[item.tamanho]}
                </Text>

                <View style={styles.itemRodape}>
                  <Text style={styles.itemPreco}>{formatarPreco(precoSubtotal)}</Text>

                  <View style={styles.quantidadeControle}>
                    <TouchableOpacity
                      style={styles.qtyBtn}
                      onPress={() => {
                        updateQuantity(item.produto.id, item.tamanho, item.quantidade - 1);
                        Haptics.selectionAsync();
                      }}
                    >
                      <Ionicons name="remove" size={16} color={COLORS.text} />
                    </TouchableOpacity>
                    <Text style={styles.qtyNumero}>{item.quantidade}</Text>
                    <TouchableOpacity
                      style={[styles.qtyBtn, styles.qtyBtnAdd]}
                      onPress={() => {
                        updateQuantity(item.produto.id, item.tamanho, item.quantidade + 1);
                        Haptics.selectionAsync();
                      }}
                    >
                      <Ionicons name="add" size={16} color={COLORS.primary} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>

      <View style={styles.bottomBar}>
        <View style={styles.resumoRow}>
          <Text style={styles.resumoLabel}>Subtotal ({totalItems} {totalItems === 1 ? 'item' : 'itens'})</Text>
          <Text style={styles.resumoValor}>{totalPriceFormatted}</Text>
        </View>
        <View style={styles.resumoRow}>
          <Text style={styles.resumoLabel}>Taxa de entrega</Text>
          <Text style={[styles.resumoValor, { color: COLORS.success }]}>Grátis</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.resumoRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValor}>{totalPriceFormatted}</Text>
        </View>
        <TouchableOpacity style={styles.checkoutBtn} onPress={handleCheckout} activeOpacity={0.8}>
          <Text style={styles.checkoutBtnText}>Finalizar pedido</Text>
          <Ionicons name="arrow-forward" size={18} color={COLORS.primary} />
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
  headerRow: { paddingHorizontal: 16 },
  limparTexto: {
    color: COLORS.danger,
    fontSize: 14,
    fontWeight: '600',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },

  itemCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    borderRadius: 18,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  itemImagem: {
    width: 90,
    height: 90,
    borderRadius: 14,
  },
  itemInfo: {
    flex: 1,
    marginLeft: 14,
    justifyContent: 'space-between',
  },
  itemTopo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemNome: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    flex: 1,
    marginRight: 8,
  },
  itemTamanho: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 4,
  },
  itemRodape: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  itemPreco: {
    fontSize: 17,
    fontWeight: 'bold',
    color: COLORS.accent,
  },
  quantidadeControle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  qtyBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: COLORS.cardLight,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  qtyBtnAdd: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },
  qtyNumero: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    minWidth: 24,
    textAlign: 'center',
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitulo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
    marginTop: 16,
  },
  emptyDesc: {
    fontSize: 15,
    color: COLORS.textMuted,
    textAlign: 'center',
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

  bottomBar: {
    backgroundColor: COLORS.card,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: Platform.OS === 'ios' ? 30 : 20,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  resumoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  resumoLabel: {
    fontSize: 14,
    color: COLORS.textMuted,
  },
  resumoValor: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 12,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  totalValor: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.accent,
  },
  checkoutBtn: {
    backgroundColor: COLORS.accent,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  checkoutBtnText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
