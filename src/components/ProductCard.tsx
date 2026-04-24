import React from 'react';
import { TouchableOpacity, Text, View, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../theme/colors';
import { FONTS } from '../theme/fonts';
import type { Produto } from '../types';
import { formatarPreco } from '../types';

type Props = {
  produto: Produto;
  onPress: () => void;
  onAddToCart?: () => void;
  isFavorito?: boolean;
  onToggleFavorito?: () => void;
  variant?: 'horizontal' | 'vertical';
};

export const ProductCard: React.FC<Props> = ({
  produto,
  onPress,
  onAddToCart,
  isFavorito = false,
  onToggleFavorito,
  variant = 'horizontal',
}) => {
  if (variant === 'vertical') {
    return (
      <TouchableOpacity style={styles.verticalCard} onPress={onPress} activeOpacity={0.85}>
        <Image source={{ uri: produto.imagem }} style={styles.verticalImagem} />
        {onToggleFavorito && (
          <TouchableOpacity style={styles.favoritoBotao} onPress={onToggleFavorito}>
            <Ionicons
              name={isFavorito ? 'heart' : 'heart-outline'}
              size={18}
              color={isFavorito ? COLORS.danger : COLORS.text}
            />
          </TouchableOpacity>
        )}
        <View style={styles.verticalInfo}>
          <Text style={styles.nome} numberOfLines={1}>{produto.nome}</Text>
          <View style={styles.rodapeVertical}>
            <Text style={styles.preco}>{formatarPreco(produto.preco)}</Text>
            <View style={styles.avaliacaoContainer}>
              <Ionicons name="star" size={14} color={COLORS.star} />
              <Text style={styles.avaliacaoTexto}>{produto.avaliacao}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={styles.horizontalCard} onPress={onPress} activeOpacity={0.85}>
      <Image source={{ uri: produto.imagem }} style={styles.horizontalImagem} />
      <View style={styles.horizontalInfo}>
        <View style={styles.topoRow}>
          <Text style={styles.nome} numberOfLines={1}>{produto.nome}</Text>
          {onToggleFavorito && (
            <TouchableOpacity onPress={onToggleFavorito} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons
                name={isFavorito ? 'heart' : 'heart-outline'}
                size={20}
                color={isFavorito ? COLORS.danger : COLORS.textMuted}
              />
            </TouchableOpacity>
          )}
        </View>
        <Text style={styles.descricao} numberOfLines={2}>{produto.descricao}</Text>
        <View style={styles.metaRow}>
          <View style={styles.avaliacaoContainer}>
            <Ionicons name="star" size={14} color={COLORS.star} />
            <Text style={styles.avaliacaoTexto}>{produto.avaliacao}</Text>
          </View>
          <View style={styles.tempoContainer}>
            <Ionicons name="time-outline" size={14} color={COLORS.textMuted} />
            <Text style={styles.tempo}>{produto.tempo}</Text>
          </View>
        </View>
        <View style={styles.rodapeRow}>
          <Text style={styles.preco}>{formatarPreco(produto.preco)}</Text>
          {onAddToCart && (
            <TouchableOpacity style={styles.addBtn} onPress={onAddToCart}>
              <Ionicons name="add" size={22} color={COLORS.primary} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  verticalCard: {
    width: 170,
    backgroundColor: COLORS.card,
    borderRadius: 20,
    marginRight: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  verticalImagem: {
    width: '100%',
    height: 140,
  },
  favoritoBotao: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(27, 16, 21, 0.6)',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verticalInfo: { padding: 14 },
  rodapeVertical: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },

  horizontalCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    borderRadius: 18,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  horizontalImagem: {
    width: 100,
    height: 100,
    borderRadius: 14,
  },
  horizontalInfo: {
    flex: 1,
    marginLeft: 14,
    justifyContent: 'space-between',
  },
  topoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  nome: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.text,
    flex: 1,
    marginRight: 8,
    fontFamily: FONTS.semiBold,
  },
  descricao: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 4,
    lineHeight: 17,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 12,
  },
  tempoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  tempo: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  avaliacaoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  avaliacaoTexto: {
    fontSize: 13,
    color: COLORS.textWarm,
    fontWeight: '600',
  },
  preco: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.accent,
    fontFamily: FONTS.bold,
  },
  rodapeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  addBtn: {
    backgroundColor: COLORS.accent,
    width: 34,
    height: 34,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
