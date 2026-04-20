import React, { useState } from 'react';
import {
  StyleSheet, Text, View, SafeAreaView, Platform, StatusBar,
  ScrollView, TouchableOpacity, Alert, Modal,
} from 'react-native';
import { COLORS } from '../theme/colors';
import { useCart } from '../contexts/CartContext';
import { formatarPreco, MULTIPLICADOR_TAMANHO, TAMANHO_LABELS } from '../data/mock';
import { Header } from '../components/Header';

export const CheckoutScreen = ({ navigation }: any) => {
  const { items, totalPrice, totalPriceFormatted, clearCart } = useCart();
  const [enderecoSelecionado, setEnderecoSelecionado] = useState(0);
  const [pagamentoSelecionado, setPagamentoSelecionado] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  const enderecos = [
    { label: 'Casa', endereco: 'Rua das Flores, 123 - São Paulo, SP' },
    { label: 'Trabalho', endereco: 'Av. Paulista, 1000 - São Paulo, SP' },
  ];

  const pagamentos = [
    { icone: '💳', label: 'Cartão de Crédito', info: '•••• 4321' },
    { icone: '📱', label: 'Pix', info: 'Pagamento instantâneo' },
    { icone: '💵', label: 'Dinheiro', info: 'Pague na entrega' },
  ];

  const taxaEntrega = 0;
  const totalFinal = totalPrice + taxaEntrega;

  const handleConfirmar = () => {
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      clearCart();
      navigation.navigate('HomeTab');
    }, 3000);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      <View style={{ paddingHorizontal: 16 }}>
        <Header title="Finalizar Pedido" showBack onBack={() => navigation.goBack()} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        <Text style={styles.secaoTitulo}>📍 Endereço de entrega</Text>
        {enderecos.map((end, i) => (
          <TouchableOpacity
            key={i}
            style={[styles.optionCard, enderecoSelecionado === i && styles.optionCardAtivo]}
            onPress={() => setEnderecoSelecionado(i)}
          >
            <View style={[styles.radio, enderecoSelecionado === i && styles.radioAtivo]}>
              {enderecoSelecionado === i && <View style={styles.radioInner} />}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.optionLabel}>{end.label}</Text>
              <Text style={styles.optionInfo}>{end.endereco}</Text>
            </View>
          </TouchableOpacity>
        ))}

        <Text style={[styles.secaoTitulo, { marginTop: 24 }]}>💳 Método de pagamento</Text>
        {pagamentos.map((pag, i) => (
          <TouchableOpacity
            key={i}
            style={[styles.optionCard, pagamentoSelecionado === i && styles.optionCardAtivo]}
            onPress={() => setPagamentoSelecionado(i)}
          >
            <View style={[styles.radio, pagamentoSelecionado === i && styles.radioAtivo]}>
              {pagamentoSelecionado === i && <View style={styles.radioInner} />}
            </View>
            <Text style={styles.pagIcone}>{pag.icone}</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.optionLabel}>{pag.label}</Text>
              <Text style={styles.optionInfo}>{pag.info}</Text>
            </View>
          </TouchableOpacity>
        ))}

        <Text style={[styles.secaoTitulo, { marginTop: 24 }]}>📋 Resumo do pedido</Text>
        <View style={styles.resumoCard}>
          {items.map((item, i) => (
            <View key={i} style={styles.resumoItem}>
              <Text style={styles.resumoQty}>{item.quantidade}x</Text>
              <Text style={styles.resumoNome} numberOfLines={1}>
                {item.produto.nome} ({TAMANHO_LABELS[item.tamanho]})
              </Text>
              <Text style={styles.resumoPreco}>
                {formatarPreco(item.produto.preco * MULTIPLICADOR_TAMANHO[item.tamanho] * item.quantidade)}
              </Text>
            </View>
          ))}
          <View style={styles.divider} />
          <View style={styles.resumoItem}>
            <Text style={styles.resumoNome}>Subtotal</Text>
            <Text style={styles.resumoPreco}>{totalPriceFormatted}</Text>
          </View>
          <View style={styles.resumoItem}>
            <Text style={styles.resumoNome}>Entrega</Text>
            <Text style={[styles.resumoPreco, { color: COLORS.success }]}>Grátis</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.resumoItem}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValor}>{formatarPreco(totalFinal)}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.confirmarBtn} onPress={handleConfirmar}>
          <Text style={styles.confirmarBtnText}>Confirmar Pedido • {formatarPreco(totalFinal)}</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={showSuccess} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalIcon}>✅</Text>
            <Text style={styles.modalTitulo}>Pedido Confirmado!</Text>
            <Text style={styles.modalDesc}>
              Seu pedido foi enviado para a cozinha.{'\n'}Tempo estimado: 15-25 min
            </Text>
            <View style={styles.modalLoader}>
              <Text style={styles.modalLoaderText}>Redirecionando...</Text>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.primary,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },

  secaoTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 14,
  },

  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  optionCardAtivo: {
    borderColor: COLORS.accent,
    backgroundColor: COLORS.accentUltraLight,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: COLORS.textMuted,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  radioAtivo: {
    borderColor: COLORS.accent,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.accent,
  },
  pagIcone: {
    fontSize: 22,
    marginRight: 12,
  },
  optionLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 2,
  },
  optionInfo: {
    fontSize: 12,
    color: COLORS.textMuted,
  },

  resumoCard: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  resumoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  resumoQty: {
    fontSize: 14,
    color: COLORS.accent,
    fontWeight: 'bold',
    marginRight: 10,
    minWidth: 24,
  },
  resumoNome: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  resumoPreco: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginLeft: 8,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 12,
  },
  totalLabel: {
    flex: 1,
    fontSize: 17,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  totalValor: {
    fontSize: 19,
    fontWeight: 'bold',
    color: COLORS.accent,
  },

  bottomBar: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: Platform.OS === 'ios' ? 30 : 16,
    backgroundColor: COLORS.card,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  confirmarBtn: {
    backgroundColor: COLORS.accent,
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
  },
  confirmarBtnText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  modalContent: {
    backgroundColor: COLORS.card,
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  modalIcon: { fontSize: 56, marginBottom: 16 },
  modalTitulo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 10,
  },
  modalDesc: {
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  modalLoader: {
    backgroundColor: COLORS.successLight,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  modalLoaderText: {
    color: COLORS.success,
    fontSize: 13,
    fontWeight: '600',
  },
});
