import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import Screen from '../components/Screen';
import ScreenHeader from '../components/ScreenHeader';
import { getCurrency } from '../data/currencies';
import { loadRates } from '../store/ratesSlice';
import { setDecimals, toggleFavorite } from '../store/settingsSlice';
import { colors, spacing } from '../theme';
import { formatUpdatedAt } from '../utils/format';

const DECIMAL_OPTIONS = [2, 4, 6];

export default function SettingsScreen({ navigation }) {
  const dispatch = useDispatch();
  const settings = useSelector((state) => state.settings);
  const rates = useSelector((state) => state.rates);
  const base = getCurrency(settings.displayBase);

  return (
    <Screen>
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <ScreenHeader
        kicker="Профіль"
        title="Налаштування"
        subtitle="Точність, базова валюта та обране"
      />

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Знаків після коми</Text>
        <View style={styles.row}>
          {DECIMAL_OPTIONS.map((value) => {
            const active = settings.decimals === value;
            return (
              <Pressable
                key={value}
                onPress={() => dispatch(setDecimals(value))}
                style={[styles.option, active && styles.optionActive]}
              >
                <Text style={[styles.optionText, active && styles.optionTextActive]}>{value}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <Pressable
        style={styles.card}
        onPress={() => navigation.navigate('CurrencyPicker', { field: 'base' })}
      >
        <Text style={styles.cardTitle}>База для таблиці курсів</Text>
        <Text style={styles.value}>
          {base.code} · {base.name}
        </Text>
      </Pressable>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Обрані валюти</Text>
        <View style={styles.favorites}>
          {settings.favorites.map((code) => {
            const currency = getCurrency(code);
            return (
              <Pressable
                key={code}
                onPress={() => dispatch(toggleFavorite(code))}
                style={styles.favorite}
              >
                <Text style={styles.favoriteText}>{currency.code}</Text>
              </Pressable>
            );
          })}
        </View>
        <Text style={styles.hint}>Натисніть валюту, щоб прибрати її з обраного.</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Джерело даних</Text>
        <Text style={styles.value}>{rates.provider || 'ExchangeRate-API'}</Text>
        <Text style={styles.hint}>
          Мережевий виклик: open.er-api.com. Останнє оновлення {formatUpdatedAt(rates.updatedAt)}.
        </Text>
        <Pressable style={styles.refresh} onPress={() => dispatch(loadRates())}>
          <Text style={styles.refreshText}>Оновити курси зараз</Text>
        </Pressable>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Архітектура</Text>
        <Text style={styles.hint}>
          Redux зберігає курси, конвертер, історію та налаштування. Вкладки ведуть між розділами,
          а стек відкриває вибір валюти та деталі пари.
        </Text>
      </View>
    </ScrollView>
    </Screen>
  );
}

SettingsScreen.propTypes = {
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
    gap: 12,
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
  },
  row: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  option: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceRaised,
  },
  optionActive: {
    backgroundColor: colors.mint,
  },
  optionText: {
    color: colors.text,
    fontWeight: '700',
  },
  optionTextActive: {
    color: colors.bg,
  },
  value: {
    color: colors.mint,
    marginTop: 8,
    fontSize: 15,
    fontWeight: '600',
  },
  favorites: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  favorite: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: colors.mintDeep,
    borderWidth: 1,
    borderColor: colors.line,
  },
  favoriteText: {
    color: colors.text,
    fontWeight: '600',
  },
  hint: {
    color: colors.muted,
    marginTop: 10,
    fontSize: 13,
    lineHeight: 18,
  },
  refresh: {
    marginTop: 14,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceRaised,
  },
  refreshText: {
    color: colors.mint,
    fontWeight: '700',
  },
});
