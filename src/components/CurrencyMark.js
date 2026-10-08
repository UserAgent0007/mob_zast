import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import PropTypes from 'prop-types';
import { getCurrency } from '../data/currencies';
import { colors } from '../theme';

export default function CurrencyMark({ code, size = 40 }) {
  const currency = getCurrency(code);
  const fontSize = currency.symbol.length > 2 ? 11 : 16;

  return (
    <View
      style={[
        styles.mark,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
        },
      ]}
    >
      <Text style={[styles.symbol, { fontSize }]} numberOfLines={1}>
        {currency.symbol}
      </Text>
    </View>
  );
}

CurrencyMark.propTypes = {
  code: PropTypes.string.isRequired,
  size: PropTypes.number,
};

const styles = StyleSheet.create({
  mark: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.mintDeep,
    borderWidth: 1,
    borderColor: colors.line,
  },
  symbol: {
    color: colors.mint,
    fontWeight: '700',
  },
});
