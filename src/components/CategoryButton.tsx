import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import type { ThemeColors } from '../theme/colors';
import type { Categoria } from '../types';

type Props = {
  categoria: Categoria;
  isAtivo: boolean;
  onPress: () => void;
};

export const CategoryButton: React.FC<Props> = ({ categoria, isAtivo, onPress }) => {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  
  return (
    <TouchableOpacity
      style={[styles.botao, isAtivo && styles.botaoAtivo]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={styles.icone}>{categoria.icone}</Text>
      <Text style={[styles.texto, isAtivo && styles.textoAtivo]}>{categoria.nome}</Text>
    </TouchableOpacity>
  );
};

const getStyles = (colors: ThemeColors) => StyleSheet.create({
  botao: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: colors.card,
    marginRight: 12,
    minWidth: 72,
    borderWidth: 1,
    borderColor: colors.border,
  },
  botaoAtivo: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  icone: {
    fontSize: 22,
    marginBottom: 6,
  },
  texto: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  textoAtivo: {
    color: colors.primary,
    fontWeight: 'bold',
  },
});
