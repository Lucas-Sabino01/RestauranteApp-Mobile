import React from 'react';
import {
  StyleSheet, Text, View, SafeAreaView, Platform, StatusBar,
  ScrollView, TouchableOpacity,
} from 'react-native';
import { COLORS } from '../theme/colors';
import { PEDIDOS_MOCK, formatarPreco } from '../data/mock';
import { Header } from '../components/Header';

const STATUS_CONFIG = {
  preparando: { icone: '👨‍🍳', label: 'Preparando', cor: COLORS.warning },
  a_caminho: { icone: '🛵', label: 'A caminho', cor: COLORS.info },
  entregue: { icone: '✅', label: 'Entregue', cor: COLORS.success },
};

export const OrdersScreen = ({ navigation }: any) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      <View style={{ paddingHorizontal: 16 }}>
        <Header title="Meus Pedidos" showBack onBack={() => navigation.goBack()} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {PEDIDOS_MOCK.map((pedido) => {
          const statusInfo = STATUS_CONFIG[pedido.status];
          return (
            <View key={pedido.id} style={styles.pedidoCard}>
              <View style={styles.pedidoTopo}>
                <View>
                  <Text style={styles.pedidoId}>#{pedido.id}</Text>
                  <Text style={styles.pedidoData}>{pedido.data}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: statusInfo.cor + '22' }]}>
                  <Text style={styles.statusIcone}>{statusInfo.icone}</Text>
                  <Text style={[styles.statusTexto, { color: statusInfo.cor }]}>
                    {statusInfo.label}
                  </Text>
                </View>
              </View>

              <View style={styles.divider} />
              {pedido.itens.map((item, i) => (
                <View key={i} style={styles.itemRow}>
                  <Text style={styles.itemQty}>{item.quantidade}x</Text>
                  <Text style={styles.itemNome}>{item.nome}</Text>
                </View>
              ))}

              <View style={styles.divider} />
              <View style={styles.pedidoRodape}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValor}>{formatarPreco(pedido.total)}</Text>
              </View>

              {pedido.status === 'entregue' ? (
                <TouchableOpacity style={styles.reorderBtn}>
                  <Text style={styles.reorderBtnText}>Pedir novamente 🔄</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={styles.trackBtn}>
                  <Text style={styles.trackBtnText}>Acompanhar pedido →</Text>
                </TouchableOpacity>
              )}
            </View>
          );
        })}

        {PEDIDOS_MOCK.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📦</Text>
            <Text style={styles.emptyTitulo}>Nenhum pedido</Text>
            <Text style={styles.emptyDesc}>Seus pedidos aparecerão aqui.</Text>
          </View>
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
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  pedidoCard: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  pedidoTopo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pedidoId: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 2,
  },
  pedidoData: {
    fontSize: 13,
    color: COLORS.textMuted,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  statusIcone: { fontSize: 14 },
  statusTexto: {
    fontSize: 13,
    fontWeight: '600',
  },

  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 14,
  },

  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemQty: {
    fontSize: 14,
    color: COLORS.accent,
    fontWeight: 'bold',
    marginRight: 10,
    minWidth: 24,
  },
  itemNome: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },

  pedidoRodape: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 15,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
  totalValor: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.accent,
  },

  reorderBtn: {
    backgroundColor: COLORS.accentLight,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 14,
  },
  reorderBtnText: {
    color: COLORS.accent,
    fontSize: 14,
    fontWeight: 'bold',
  },
  trackBtn: {
    backgroundColor: COLORS.accent,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 14,
  },
  trackBtnText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: 'bold',
  },

  emptyContainer: {
    alignItems: 'center',
    paddingTop: 80,
  },
  emptyIcon: { fontSize: 56, marginBottom: 16 },
  emptyTitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  emptyDesc: {
    fontSize: 14,
    color: COLORS.textMuted,
  },
});
