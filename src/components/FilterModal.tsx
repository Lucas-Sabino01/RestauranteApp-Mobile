import React, { useState } from 'react';
import {
  StyleSheet, Text, View, TouchableOpacity, Modal, ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import type { ThemeColors } from '../theme/colors';
import { FONTS } from '../theme/fonts';

export type Filters = {
  faixaPreco: string[];
  avaliacaoMinima: number | null;
  bairro: string | null;
  abertoAgora: boolean;
  distanciaMaxima: number | null; // km
};

export const EMPTY_FILTERS: Filters = {
  faixaPreco: [],
  avaliacaoMinima: null,
  bairro: null,
  abertoAgora: false,
  distanciaMaxima: null,
};

const PRECOS = ['$', '$$', '$$$', '$$$$'];
const AVALIACOES = [4.0, 4.5, 4.7];
const BAIRROS = [
  'Centro Histórico', 'Centro', 'Batel', 'Santa Felicidade',
  'Bigorrilho', 'São Francisco', 'Água Verde',
];
const DISTANCIAS = [1, 3, 5, 10]; // km

type FilterModalProps = {
  visible: boolean;
  filters: Filters;
  onApply: (filters: Filters) => void;
  onClose: () => void;
};

export const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  filters,
  onApply,
  onClose,
}) => {
  const { colors } = useTheme();
  const styles = getStyles(colors);

  const [local, setLocal] = useState<Filters>(filters);

  const togglePreco = (p: string) => {
    setLocal((prev) => ({
      ...prev,
      faixaPreco: prev.faixaPreco.includes(p)
        ? prev.faixaPreco.filter((x) => x !== p)
        : [...prev.faixaPreco, p],
    }));
  };

  const setAvaliacao = (v: number | null) => {
    setLocal((prev) => ({
      ...prev,
      avaliacaoMinima: prev.avaliacaoMinima === v ? null : v,
    }));
  };

  const setBairro = (b: string | null) => {
    setLocal((prev) => ({
      ...prev,
      bairro: prev.bairro === b ? null : b,
    }));
  };

  const setDistancia = (d: number | null) => {
    setLocal((prev) => ({
      ...prev,
      distanciaMaxima: prev.distanciaMaxima === d ? null : d,
    }));
  };

  const handleReset = () => setLocal(EMPTY_FILTERS);

  const activeCount =
    local.faixaPreco.length +
    (local.avaliacaoMinima ? 1 : 0) +
    (local.bairro ? 1 : 0) +
    (local.distanciaMaxima ? 1 : 0) +
    (local.abertoAgora ? 1 : 0);

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.handle} />
          <View style={styles.header}>
            <Text style={styles.title}>Filtros</Text>
            {activeCount > 0 && (
              <TouchableOpacity onPress={handleReset}>
                <Text style={styles.resetText}>Limpar tudo</Text>
              </TouchableOpacity>
            )}
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.sectionTitle}>Faixa de Preço</Text>
            <View style={styles.chipsRow}>
              {PRECOS.map((p) => (
                <TouchableOpacity
                  key={p}
                  style={[styles.chip, local.faixaPreco.includes(p) && styles.chipActive]}
                  onPress={() => togglePreco(p)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.chipText, local.faixaPreco.includes(p) && styles.chipTextActive]}>
                    {p}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.sectionTitle}>Avaliação Mínima</Text>
            <View style={styles.chipsRow}>
              {AVALIACOES.map((v) => (
                <TouchableOpacity
                  key={v}
                  style={[styles.chip, local.avaliacaoMinima === v && styles.chipActive]}
                  onPress={() => setAvaliacao(v)}
                  activeOpacity={0.7}
                >
                  <Ionicons name="star" size={14} color={local.avaliacaoMinima === v ? colors.primary : colors.star} />
                  <Text style={[styles.chipText, local.avaliacaoMinima === v && styles.chipTextActive]}>
                    {v}+
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.sectionTitle}>Bairro</Text>
            <View style={styles.chipsRow}>
              {BAIRROS.map((b) => (
                <TouchableOpacity
                  key={b}
                  style={[styles.chip, local.bairro === b && styles.chipActive]}
                  onPress={() => setBairro(b)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.chipText, local.bairro === b && styles.chipTextActive]}>
                    {b}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.sectionTitle}>Distância Máxima</Text>
            <View style={styles.chipsRow}>
              {DISTANCIAS.map((d) => (
                <TouchableOpacity
                  key={d}
                  style={[styles.chip, local.distanciaMaxima === d && styles.chipActive]}
                  onPress={() => setDistancia(d)}
                  activeOpacity={0.7}
                >
                  <Ionicons name="location-outline" size={14} color={local.distanciaMaxima === d ? colors.primary : colors.textSecondary} />
                  <Text style={[styles.chipText, local.distanciaMaxima === d && styles.chipTextActive]}>
                    Até {d} km
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.sectionTitle}>Disponibilidade</Text>
            <TouchableOpacity
              style={[styles.toggleRow, local.abertoAgora && styles.toggleRowActive]}
              onPress={() => setLocal((prev) => ({ ...prev, abertoAgora: !prev.abertoAgora }))}
              activeOpacity={0.7}
            >
              <Ionicons
                name={local.abertoAgora ? 'checkmark-circle' : 'ellipse-outline'}
                size={22}
                color={local.abertoAgora ? colors.success : colors.textMuted}
              />
              <Text style={[styles.toggleText, local.abertoAgora && styles.toggleTextActive]}>
                Aberto agora
              </Text>
            </TouchableOpacity>
          </ScrollView>
          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose} activeOpacity={0.7}>
              <Text style={styles.cancelBtnText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.applyBtn}
              onPress={() => { onApply(local); onClose(); }}
              activeOpacity={0.8}
            >
              <Text style={styles.applyBtnText}>
                Aplicar{activeCount > 0 ? ` (${activeCount})` : ''}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const getStyles = (colors: ThemeColors) => StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: colors.primary,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingBottom: 30,
    maxHeight: '80%',
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
    fontFamily: FONTS.bold,
  },
  resetText: {
    fontSize: 14,
    color: colors.danger,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
    marginTop: 8,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 5,
  },
  chipActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  chipText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  chipTextActive: {
    color: colors.primary,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 14,
    gap: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
  toggleRowActive: {
    borderColor: colors.success,
    backgroundColor: colors.successLight,
  },
  toggleText: {
    fontSize: 15,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  toggleTextActive: {
    color: colors.success,
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cancelBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  applyBtn: {
    flex: 2,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    backgroundColor: colors.accent,
  },
  applyBtnText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.primary,
  },
});
