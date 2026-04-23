import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../theme/colors';

type ToastProps = {
  text1?: string;
  text2?: string;
};

const SuccessToast: React.FC<ToastProps> = ({ text1, text2 }) => (
  <View style={[styles.container, styles.success]}>
    <Ionicons name="checkmark-circle" size={22} color={COLORS.success} />
    <View style={styles.textContainer}>
      {text1 && <Text style={styles.title}>{text1}</Text>}
      {text2 && <Text style={styles.message}>{text2}</Text>}
    </View>
  </View>
);

const ErrorToast: React.FC<ToastProps> = ({ text1, text2 }) => (
  <View style={[styles.container, styles.error]}>
    <Ionicons name="close-circle" size={22} color={COLORS.danger} />
    <View style={styles.textContainer}>
      {text1 && <Text style={styles.title}>{text1}</Text>}
      {text2 && <Text style={styles.message}>{text2}</Text>}
    </View>
  </View>
);

const InfoToast: React.FC<ToastProps> = ({ text1, text2 }) => (
  <View style={[styles.container, styles.info]}>
    <Ionicons name="information-circle" size={22} color={COLORS.info} />
    <View style={styles.textContainer}>
      {text1 && <Text style={styles.title}>{text1}</Text>}
      {text2 && <Text style={styles.message}>{text2}</Text>}
    </View>
  </View>
);

export const toastConfig = {
  success: (props: any) => <SuccessToast text1={props.text1} text2={props.text2} />,
  error: (props: any) => <ErrorToast text1={props.text1} text2={props.text2} />,
  info: (props: any) => <InfoToast text1={props.text1} text2={props.text2} />,
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    marginHorizontal: 16,
    marginTop: 8,
    borderWidth: 1,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  success: {
    backgroundColor: COLORS.card,
    borderColor: COLORS.success,
  },
  error: {
    backgroundColor: COLORS.card,
    borderColor: COLORS.danger,
  },
  info: {
    backgroundColor: COLORS.card,
    borderColor: COLORS.info,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '700',
  },
  message: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
});
