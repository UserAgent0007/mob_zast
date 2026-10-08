import React, { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import AmountInput from '../components/AmountInput';
import Screen from '../components/Screen';
import CurrencyButton from '../components/CurrencyButton';
import PrimaryButton from '../components/PrimaryButton';
import QuickAmountRow from '../components/QuickAmountRow';
import ScreenHeader from '../components/ScreenHeader';
import { POPULAR_CODES } from '../data/currencies';
import { addHistoryItem } from '../store/historySlice';
import { setAmount, setPair, swapCurrencies } from '../store/converterSlice';
import { colors, spacing } from '../theme';
import {
  convertAmount,
  crossRate,
  formatAmount,
  formatRate,
  formatUpdatedAt,
  parseAmount,
} from '../utils/format';

export default function ConverterScreen({ navigation }) {
  const dispatch = useDispatch();
  const { from, to, amount } = useSelector((state) => state.converter);
  const { rates, status, error, updatedAt } = useSelector((state) => state.rates);
  const decimals = useSelector((state) => state.settings.decimals);

  const numericAmount = parseAmount(amount);
  const result = useMemo(
    () => convertAmount(numericAmount, from, to, rates),
    [numericAmount, from, to, rates]
  );
  const rate = useMemo(() => crossRate(from, to, rates), [from, to, rates]);

  const openPicker = (field) => {
    navigation.navigate('CurrencyPicker', { field });
  };

  const handleSave = () => {
    if (result == null) {
      return;
    }
    dispatch(
      addHistoryItem({
        id: `${Date.now()}`,
        from,
        to,
        amount: numericAmount,
        result,
        rate,
        amountLabel: formatAmount(numericAmount, decimals),
        resultLabel: formatAmount(result, decimals),
        rateLabel: formatRate(rate),
        createdAt: new Date().toISOString(),
        createdAtLabel: formatUpdatedAt(new Date().toISOString()),
      })
    );
    navigation.navigate('History');
  };

  return (
    <Screen>
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <ScreenHeader
        kicker="Live rates"
        title="Конвертер"
        subtitle={
          status === 'failed'
            ? error
            : status === 'loading' && !updatedAt
              ? 'Завантаження курсів…'
              : `Оновлено ${formatUpdatedAt(updatedAt)}`
        }
      />

      <AmountInput value={amount} onChange={(value) => dispatch(setAmount(value))} code={from} />
      <View style={styles.quick}>
        <QuickAmountRow onSelect={(value) => dispatch(setAmount(value))} />
      </View>

      <View style={styles.pair}>
        <CurrencyButton code={from} label="З валюти" onPress={() => openPicker('from')} />
        <Pressable
          onPress={() => dispatch(swapCurrencies())}
          style={({ pressed }) => [styles.swap, pressed && styles.pressed]}
          accessibilityRole="button"
          accessibilityLabel="Поміняти валюти місцями"
        >
          <Ionicons name="swap-vertical" size={20} color={colors.bg} />
        </Pressable>
        <CurrencyButton code={to} label="У валюту" onPress={() => openPicker('to')} />
      </View>

      <View style={styles.resultCard}>
        <Text style={styles.resultLabel}>Результат</Text>
        <Text style={styles.result} adjustsFontSizeToFit numberOfLines={1}>
          {result == null ? '—' : formatAmount(result, decimals)}
        </Text>
        <Text style={styles.rate}>
          1 {from} = {rate == null ? '—' : formatRate(rate)} {to}
        </Text>
      </View>

      <PrimaryButton
        label="Зберегти в історію"
        onPress={handleSave}
        disabled={result == null || numericAmount <= 0}
      />

      <Text style={styles.section}>Популярні пари</Text>
      <View style={styles.popular}>
        {POPULAR_CODES.filter((code) => code !== from).slice(0, 4).map((code) => (
          <Pressable
            key={code}
            onPress={() => dispatch(setPair({ from, to: code }))}
            style={({ pressed }) => [styles.popularChip, pressed && styles.pressed]}
          >
            <Text style={styles.popularText}>
              {from} → {code}
            </Text>
          </Pressable>
        ))}
      </View>
    </ScrollView>
    </Screen>
  );
}

ConverterScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  content: {
    padding: spacing.screen,
    paddingBottom: 36,
  },
  quick: {
    marginTop: 12,
  },
  pair: {
    marginTop: 18,
    gap: 10,
  },
  swap: {
    alignSelf: 'center',
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.mint,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: -6,
    zIndex: 1,
  },
  pressed: {
    opacity: 0.85,
  },
  resultCard: {
    marginTop: 18,
    marginBottom: 16,
    backgroundColor: colors.mintDeep,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 18,
  },
  resultLabel: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '600',
  },
  result: {
    color: colors.mint,
    fontSize: 40,
    fontWeight: '300',
    marginTop: 6,
  },
  rate: {
    color: colors.text,
    marginTop: 8,
    fontSize: 14,
  },
  section: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
    marginTop: 22,
    marginBottom: 10,
  },
  popular: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  popularChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
  },
  popularText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '600',
  },
});
