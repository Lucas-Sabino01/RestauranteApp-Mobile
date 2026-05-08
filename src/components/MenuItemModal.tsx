import React from 'react';
import {
  StyleSheet, Text, View, Modal, TouchableOpacity,
  ScrollView, Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import type { ThemeColors } from '../theme/colors';
import { FONTS } from '../theme/fonts';
import type { Estabelecimento, ItemCardapio } from '../types';

type MenuItemModalProps = {
  item: ItemCardapio | null;
  estabelecimento: Estabelecimento;
  onClose: () => void;
  onSelectRelated: (item: ItemCardapio) => void;
};

export const MenuItemModal: React.FC<MenuItemModalProps> = ({
  item,
  estabelecimento,
  onClose,
  onSelectRelated,
}) => {
  const { colors } = useTheme();
  const styles = getStyles(colors);

  const related = estabelecimento.cardapio?.filter(
    (i) => i.categoria === item?.categoria && i.nome !== item?.nome
  ) ?? [];

  return (
    <Modal
      visible={item !== null}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.closeArea}
          activeOpacity={1}
          onPress={onClose}
          accessibilityLabel="Fechar detalhes do item"
          accessibilityRole="button"
        />
        <View style={styles.content}>
          <View style={styles.handle} />
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={onClose}
            accessibilityLabel="Fechar"
            accessibilityRole="button"
          >
            <Ionicons name="close-circle" size={32} color={colors.textMuted} />
          </TouchableOpacity>

          {item?.imagem ? (
            <Image
              source={{ uri: item.imagem.replace('w=200', 'w=600').replace('w=400', 'w=600') }}
              style={styles.image}
              accessibilityLabel={`Foto de ${item.nome}`}
            />
          ) : (
            <View style={[styles.image, styles.placeholder]}>
              <Ionicons name="restaurant-outline" size={56} color={colors.textMuted} />
              <Text style={{ fontSize: 13, color: colors.textMuted, marginTop: 8 }}>
                Sem foto disponível
              </Text>
            </View>
          )}

          <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
            <View style={styles.info}>
              <View style={styles.catBadge}>
                <Text style={styles.catText}>{item?.categoria}</Text>
              </View>

              <Text style={styles.nome}>{item?.nome}</Text>
              <Text style={styles.preco}>{item?.preco}</Text>

              {item?.descricao && (
                <View style={styles.descContainer}>
                  <View style={styles.descHeader}>
                    <Ionicons name="information-circle-outline" size={18} color={colors.accent} />
                    <Text style={styles.descLabel}>Sobre este item</Text>
                  </View>
                  <Text style={styles.desc}>{item?.descricao}</Text>
                </View>
              )}

              <View style={styles.estabRow}>
                <Image source={{ uri: estabelecimento.imagem }} style={styles.estabImg} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.estabLabel}>Servido em</Text>
                  <Text style={styles.estabName}>{estabelecimento.nome}</Text>
                </View>
              </View>

              {related.length > 0 && (
                <View style={styles.related}>
                  <Text style={styles.relatedTitle}>Outros em {item?.categoria}</Text>
                  {related.slice(0, 3).map((relItem, idx) => (
                    <TouchableOpacity
                      key={idx}
                      style={styles.relatedItem}
                      onPress={() => onSelectRelated(relItem)}
                      activeOpacity={0.7}
                      accessibilityLabel={`Ver ${relItem.nome}`}
                      accessibilityRole="button"
                    >
                      {relItem.imagem ? (
                        <Image source={{ uri: relItem.imagem }} style={styles.relatedImg} />
                      ) : (
                        <View style={[styles.relatedImg, styles.relatedPlaceholder]}>
                          <Ionicons name="restaurant-outline" size={16} color={colors.textMuted} />
                        </View>
                      )}
                      <View style={{ flex: 1, marginLeft: 10 }}>
                        <Text style={styles.relatedNome} numberOfLines={1}>{relItem.nome}</Text>
                        <Text style={styles.relatedDesc} numberOfLines={1}>{relItem.descricao}</Text>
                      </View>
                      <Text style={styles.relatedPreco}>{relItem.preco}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const getStyles = (colors: ThemeColors) => StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  closeArea: {
    flex: 1,
  },
  content: {
    backgroundColor: colors.primary,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '85%',
    paddingBottom: 40,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  closeBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 16,
  },
  image: {
    width: '100%',
    height: 220,
  },
  placeholder: {
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scroll: {
    flex: 1,
  },
  info: {
    padding: 24,
    paddingBottom: 40,
  },
  catBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.accentUltraLight,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 10,
    marginBottom: 12,
  },
  catText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.accent,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  nome: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    fontFamily: FONTS.bold,
    marginBottom: 8,
  },
  preco: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.accent,
    marginBottom: 20,
  },
  descContainer: {
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 20,
  },
  descHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  descLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.accent,
  },
  desc: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 24,
  },
  estabRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 12,
    marginBottom: 20,
  },
  estabImg: {
    width: 44,
    height: 44,
    borderRadius: 12,
  },
  estabLabel: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: '500',
  },
  estabName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 2,
  },
  related: {
    marginTop: 4,
  },
  relatedTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 12,
  },
  relatedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: 12,
    borderRadius: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  relatedImg: {
    width: 44,
    height: 44,
    borderRadius: 10,
  },
  relatedPlaceholder: {
    backgroundColor: colors.accentUltraLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  relatedNome: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  relatedDesc: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
  },
  relatedPreco: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.accent,
    marginLeft: 8,
  },
});
