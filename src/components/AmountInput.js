import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import PropTypes from 'prop-types';
import { getCurrency } from '../data/currencies';
import { colors } from '../theme';

export default function AmountInput({ value, onChange, code }) {
  const currency = getCurrency(code);

  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>Сума</Text>
      <View style={styles.field}>
        <Text style={styles.symbol}>{currency.symbol}</Text>
        <TextInput
          value={value}
          onChangeText={onChange}
          keyboardType="decimal-pad"
          placeholder="0"
          placeholderTextColor={colors.dim}
          style={styles.input}
          accessibilityLabel="Сума для конвертації"
        />
      </View>
    </View>
  );
}

AmountInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  code: PropTypes.string.isRequired,
};

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 16,
  },
  label: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '600',
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 8,
  },
  symbol: {
    color: colors.mint,
    fontSize: 28,
    fontWeight: '700',
  },
  input: {
    flex: 1,
    color: colors.text,
    fontSize: 36,
    fontWeight: '300',
    paddingVertical: 0,
  },
});
