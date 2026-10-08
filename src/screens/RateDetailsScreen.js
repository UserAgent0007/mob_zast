import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import PrimaryButton from '../components/PrimaryButton';
import { getCurrency } from '../data/currencies';
import { setPair } from '../store/converterSlice';
import { toggleFavorite } from '../store/settingsSlice';
import { colors, spacing } from '../theme';
import { convertAmount, crossRate, formatAmount, formatRate } from '../utils/format';

export default function RateDetailsScreen({ navigation, route }) {
  const dispatch = useDispatch();
  const { from, to } = route.params;
  const rates = useSelector((state) => state.rates.rates);
  const decimals = useSelector((state) => state.settings.decimals);
  const favorites = useSelector((state) => state.settings.favorites);
  const fromCurrency = getCurrency(from);
  const toCurrency = getCurrency(to);
  const rate = useMemo(() => crossRate(from, to, rates), [from, to, rates]);
  const inverse = useMemo(() => crossRate(to, from, rates), [from, to, rates]);
  const samples = [1, 10, 100, 1000];

  const openConverter = () => {
    dispatch(setPair({ from, to, amount: '1' }));
    navigation.navigate('Main', { screen: 'Converter' });
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.hero}>
        <Text style={styles.pair}>
          {fromCurrency.code} → {toCurrency.code}
        </Text>
        <Text style={styles.rate}>{rate == null ? '—' : formatRate(rate)}</Text>
        <Text style={styles.caption}>
          1 {fromCurrency.name} = {rate == null ? '—' : formatRate(rate)} {toCurrency.name}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Обернений курс</Text>
        <Text style={styles.value}>
          1 {to} = {inverse == null ? '—' : formatRate(inverse)} {from}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Швидкі суми</Text>
        {samples.map((amount) => {
          const converted = convertAmount(amount, from, to, rates);
          return (
            <View key={amount} style={styles.sample}>
              <Text style={styles.sampleFrom}>
                {formatAmount(amount, 0)} {from}
              </Text>
              <Text style={styles.sampleTo}>
                {converted == null ? '—' : formatAmount(converted, decimals)} {to}
              </Text>
            </View>
          );
        })}
      </View>

      <View style={styles.actions}>
        <PrimaryButton label="Відкрити в конвертері" onPress={openConverter} />
        <PrimaryButton
          label={favorites.includes(to) ? 'Прибрати з обраного' : 'Додати в обране'}
          variant="ghost"
          onPress={() => dispatch(toggleFavorite(to))}
        />
      </View>
    </ScrollView>
  );
}

RateDetailsScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
  route: PropTypes.shape({
    params: PropTypes.shape({
      from: PropTypes.string.isRequired,
      to: PropTypes.string.isRequired,
    }).isRequired,
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
    gap: 12,
  },
  hero: {
    backgroundColor: colors.mintDeep,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 20,
  },
  pair: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  rate: {
    color: colors.mint,
    fontSize: 40,
    fontWeight: '300',
    marginTop: 10,
  },
  caption: {
    color: colors.muted,
    marginTop: 8,
    lineHeight: 20,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 16,
  },
  cardTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10,
  },
  value: {
    color: colors.mint,
    fontSize: 16,
    fontWeight: '600',
  },
  sample: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  sampleFrom: {
    color: colors.muted,
  },
  sampleTo: {
    color: colors.text,
    fontWeight: '700',
  },
  actions: {
    gap: 10,
    marginTop: 6,
  },
});
