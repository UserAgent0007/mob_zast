import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import CurrencyMark from '../components/CurrencyMark';
import EmptyState from '../components/EmptyState';
import Screen from '../components/Screen';
import RateRow from '../components/RateRow';
import ScreenHeader from '../components/ScreenHeader';
import { getCurrency, listKnownCurrencies } from '../data/currencies';
import { loadRates } from '../store/ratesSlice';
import { toggleFavorite } from '../store/settingsSlice';
import { colors, spacing } from '../theme';
import { crossRate, formatRate, formatUpdatedAt } from '../utils/format';

export default function RatesScreen({ navigation }) {
  const dispatch = useDispatch();
  const [query, setQuery] = useState('');
  const { rates, status, error, updatedAt } = useSelector((state) => state.rates);
  const { displayBase, favorites } = useSelector((state) => state.settings);
  const base = getCurrency(displayBase);

  const items = useMemo(() => {
    const available = Object.keys(rates);
    const known = listKnownCurrencies(available).filter((item) => item.code !== displayBase);
    const needle = query.trim().toLowerCase();
    const filtered = needle
      ? known.filter(
          (item) =>
            item.code.toLowerCase().includes(needle) ||
            item.name.toLowerCase().includes(needle)
        )
      : known;

    return filtered
      .map((item) => ({
        ...item,
        rate: crossRate(displayBase, item.code, rates),
        favorite: favorites.includes(item.code),
      }))
      .sort((left, right) => {
        if (left.favorite !== right.favorite) {
          return left.favorite ? -1 : 1;
        }
        return left.code.localeCompare(right.code);
      });
  }, [displayBase, favorites, query, rates]);

  const refreshing = status === 'loading';

  return (
    <Screen>
      <View style={styles.toolbar}>
        <ScreenHeader
          kicker="Ринок"
          title="Курси"
          subtitle={`1 ${base.code} · ${formatUpdatedAt(updatedAt)}`}
          action={
            <Pressable
              onPress={() => navigation.navigate('CurrencyPicker', { field: 'base' })}
              style={styles.baseButton}
              accessibilityRole="button"
              accessibilityLabel="Обрати базову валюту"
            >
              <CurrencyMark code={base.code} size={28} />
              <Text style={styles.baseCode}>{base.code}</Text>
            </Pressable>
          }
        />
        <View style={styles.search}>
          <Ionicons name="search" size={18} color={colors.muted} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Пошук валюти"
            placeholderTextColor={colors.dim}
            style={styles.input}
            autoCorrect={false}
            autoCapitalize="none"
          />
        </View>
      </View>

      {status === 'loading' && items.length === 0 ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.mint} size="large" />
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.code}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => dispatch(loadRates())}
              tintColor={colors.mint}
            />
          }
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <RateRow
              code={item.code}
              value={item.rate == null ? '—' : formatRate(item.rate)}
              favorite={item.favorite}
              onPress={() =>
                navigation.navigate('RateDetails', {
                  from: displayBase,
                  to: item.code,
                })
              }
              onToggleFavorite={() => dispatch(toggleFavorite(item.code))}
            />
          )}
          ListEmptyComponent={
            <EmptyState
              icon={error ? 'alert-circle-outline' : 'cash-outline'}
              title={error || 'Немає валют за цим запитом'}
              danger={Boolean(error)}
            />
          }
        />
      )}
    </Screen>
  );
}

RatesScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  toolbar: {
    paddingHorizontal: spacing.screen,
    paddingTop: 8,
  },
  baseButton: {
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: 10,
    paddingVertical: 8,
    minWidth: 64,
  },
  baseCode: {
    color: colors.text,
    fontWeight: '700',
    marginTop: 2,
  },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: 12,
    minHeight: 48,
    marginBottom: 8,
  },
  input: {
    flex: 1,
    color: colors.text,
    fontSize: 16,
    paddingVertical: 10,
  },
  list: {
    flexGrow: 1,
    paddingHorizontal: spacing.screen,
    paddingBottom: 24,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
