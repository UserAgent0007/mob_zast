import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import PropTypes from 'prop-types';
import { getCurrency } from '../data/currencies';
import { colors } from '../theme';
import CurrencyMark from './CurrencyMark';

export default function RateRow({ code, value, favorite, onPress, onToggleFavorite }) {
  const currency = getCurrency(code);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
      accessibilityRole="button"
      accessibilityLabel={`${currency.name}: ${value}`}
    >
      <CurrencyMark code={code} size={36} />
      <View style={styles.copy}>
        <Text style={styles.code}>{currency.code}</Text>
        <Text style={styles.name} numberOfLines={1}>
          {currency.name}
        </Text>
      </View>
      <Text style={styles.value}>{value}</Text>
      <Pressable
        onPress={onToggleFavorite}
        hitSlop={10}
        accessibilityRole="button"
        accessibilityLabel={favorite ? 'Прибрати з обраного' : 'Додати в обране'}
      >
        <Ionicons
          name={favorite ? 'star' : 'star-outline'}
          size={18}
          color={favorite ? colors.warning : colors.muted}
        />
      </Pressable>
    </Pressable>
  );
}

RateRow.propTypes = {
  code: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  favorite: PropTypes.bool.isRequired,
  onPress: PropTypes.func.isRequired,
  onToggleFavorite: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  pressed: {
    backgroundColor: colors.surfaceRaised,
  },
  copy: {
    flex: 1,
  },
  code: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  name: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 2,
  },
  value: {
    color: colors.mint,
    fontSize: 15,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
});
