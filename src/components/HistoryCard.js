import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import PropTypes from 'prop-types';
import { getCurrency } from '../data/currencies';
import { colors } from '../theme';

export default function HistoryCard({ item, onPress, onRemove }) {
  const from = getCurrency(item.from);
  const to = getCurrency(item.to);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      accessibilityRole="button"
      accessibilityLabel={`${item.amountLabel} ${from.code} у ${item.resultLabel} ${to.code}`}
    >
      <View style={styles.stripe} />
      <View style={styles.body}>
        <Text style={styles.time}>{item.createdAtLabel}</Text>
        <Text style={styles.pair}>
          {from.code} → {to.code}
        </Text>
        <Text style={styles.result}>
          {item.amountLabel} {from.symbol} = {item.resultLabel} {to.symbol}
        </Text>
        <Text style={styles.rate}>Курс {item.rateLabel}</Text>
      </View>
      <Pressable
        onPress={onRemove}
        hitSlop={10}
        accessibilityRole="button"
        accessibilityLabel="Видалити запис"
      >
        <Ionicons name="trash-outline" size={18} color={colors.muted} />
      </Pressable>
    </Pressable>
  );
}

HistoryCard.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    from: PropTypes.string.isRequired,
    to: PropTypes.string.isRequired,
    amountLabel: PropTypes.string.isRequired,
    resultLabel: PropTypes.string.isRequired,
    rateLabel: PropTypes.string.isRequired,
    createdAtLabel: PropTypes.string.isRequired,
  }).isRequired,
  onPress: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.line,
    paddingRight: 14,
    overflow: 'hidden',
  },
  pressed: {
    opacity: 0.88,
  },
  stripe: {
    width: 4,
    alignSelf: 'stretch',
    backgroundColor: colors.mint,
  },
  body: {
    flex: 1,
    paddingVertical: 12,
  },
  time: {
    color: colors.dim,
    fontSize: 12,
  },
  pair: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
    marginTop: 4,
  },
  result: {
    color: colors.mint,
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
  },
  rate: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 4,
  },
});
