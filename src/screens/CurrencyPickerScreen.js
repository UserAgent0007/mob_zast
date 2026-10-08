import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import CurrencyMark from '../components/CurrencyMark';
import EmptyState from '../components/EmptyState';
import { getCurrency, listKnownCurrencies } from '../data/currencies';
import { setFrom, setTo } from '../store/converterSlice';
import { setDisplayBase, toggleFavorite } from '../store/settingsSlice';
import { colors, spacing } from '../theme';

export default function CurrencyPickerScreen({ navigation, route }) {
  const dispatch = useDispatch();
  const { field } = route.params;
  const [query, setQuery] = useState('');
  const rates = useSelector((state) => state.rates.rates);
  const favorites = useSelector((state) => state.settings.favorites);

  const items = useMemo(() => {
    const known = listKnownCurrencies(Object.keys(rates).length ? Object.keys(rates) : undefined);
    const needle = query.trim().toLowerCase();
    const filtered = needle
      ? known.filter(
          (item) =>
            item.code.toLowerCase().includes(needle) ||
            item.name.toLowerCase().includes(needle)
        )
      : known;

    return filtered.sort((left, right) => {
      const leftFav = favorites.includes(left.code);
      const rightFav = favorites.includes(right.code);
      if (leftFav !== rightFav) {
        return leftFav ? -1 : 1;
      }
      return left.code.localeCompare(right.code);
    });
  }, [favorites, query, rates]);

  const apply = (code) => {
    if (field === 'from') {
      dispatch(setFrom(code));
    } else if (field === 'to') {
      dispatch(setTo(code));
    } else {
      dispatch(setDisplayBase(code));
    }
    navigation.goBack();
  };

  return (
    <View style={styles.screen}>
      <View style={styles.search}>
        <Ionicons name="search" size={18} color={colors.muted} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Код або назва валюти"
          placeholderTextColor={colors.dim}
          style={styles.input}
          autoFocus
          autoCorrect={false}
          autoCapitalize="characters"
        />
      </View>
      <FlatList
        data={items}
        keyExtractor={(item) => item.code}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const favorite = favorites.includes(item.code);
          const currency = getCurrency(item.code);
          return (
            <Pressable
              onPress={() => apply(item.code)}
              style={({ pressed }) => [styles.row, pressed && styles.pressed]}
            >
              <CurrencyMark code={item.code} size={36} />
              <View style={styles.copy}>
                <Text style={styles.code}>{currency.code}</Text>
                <Text style={styles.name}>{currency.name}</Text>
              </View>
              <Pressable onPress={() => dispatch(toggleFavorite(item.code))} hitSlop={10}>
                <Ionicons
                  name={favorite ? 'star' : 'star-outline'}
                  size={18}
                  color={favorite ? colors.warning : colors.muted}
                />
              </Pressable>
            </Pressable>
          );
        }}
        ListEmptyComponent={
          <EmptyState icon="search-outline" title="Валюту не знайдено" />
        }
      />
    </View>
  );
}

CurrencyPickerScreen.propTypes = {
  navigation: PropTypes.shape({
    goBack: PropTypes.func.isRequired,
  }).isRequired,
  route: PropTypes.shape({
    params: PropTypes.shape({
      field: PropTypes.oneOf(['from', 'to', 'base']).isRequired,
    }).isRequired,
  }).isRequired,
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    margin: spacing.screen,
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.line,
    paddingHorizontal: 12,
    minHeight: 48,
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  pressed: {
    opacity: 0.85,
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
    marginTop: 2,
    fontSize: 13,
  },
});
