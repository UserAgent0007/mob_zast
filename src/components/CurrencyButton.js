import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import PropTypes from 'prop-types';
import { getCurrency } from '../data/currencies';
import { colors } from '../theme';
import CurrencyMark from './CurrencyMark';

export default function CurrencyButton({ code, label, onPress }) {
  const currency = getCurrency(code);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${label}: ${currency.name}`}
      onPress={onPress}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
    >
      <CurrencyMark code={code} />
      <View style={styles.copy}>
        <Text style={styles.caption}>{label}</Text>
        <Text style={styles.code}>{currency.code}</Text>
        <Text style={styles.name} numberOfLines={1}>
          {currency.name}
        </Text>
      </View>
      <Ionicons name="chevron-down" size={18} color={colors.muted} />
    </Pressable>
  );
}

CurrencyButton.propTypes = {
  code: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  pressed: {
    opacity: 0.86,
  },
  copy: {
    flex: 1,
  },
  caption: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  code: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
    marginTop: 2,
  },
  name: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 1,
  },
});
