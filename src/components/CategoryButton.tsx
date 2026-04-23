import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { COLORS } from '../theme/colors';
import type { Categoria } from '../types';

type Props = {
  categoria: Categoria;
  isAtivo: boolean;
  onPress: () => void;
};

export const CategoryButton: React.FC<Props> = ({ categoria, isAtivo, onPress }) => (
  <TouchableOpacity
    style={[styles.botao, isAtivo && styles.botaoAtivo]}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <Text style={styles.icone}>{categoria.icone}</Text>
    <Text style={[styles.texto, isAtivo && styles.textoAtivo]}>{categoria.nome}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  botao: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: COLORS.card,
    marginRight: 12,
    minWidth: 72,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  botaoAtivo: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },
  icone: {
    fontSize: 22,
    marginBottom: 6,
  },
  texto: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  textoAtivo: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
});
