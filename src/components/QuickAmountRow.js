import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import PropTypes from 'prop-types';
import { QUICK_AMOUNTS } from '../data/currencies';
import { colors } from '../theme';

export default function QuickAmountRow({ onSelect }) {
  return (
    <View style={styles.row}>
      {QUICK_AMOUNTS.map((value) => (
        <Pressable
          key={value}
          onPress={() => onSelect(String(value))}
          style={({ pressed }) => [styles.chip, pressed && styles.pressed]}
          accessibilityRole="button"
          accessibilityLabel={`Сума ${value}`}
        >
          <Text style={styles.label}>{value}</Text>
        </Pressable>
      ))}
    </View>
  );
}

QuickAmountRow.propTypes = {
  onSelect: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: colors.surfaceRaised,
    borderWidth: 1,
    borderColor: colors.line,
  },
  pressed: {
    opacity: 0.8,
  },
  label: {
    color: colors.mint,
    fontSize: 13,
    fontWeight: '700',
  },
});
