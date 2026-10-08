import React, { useCallback, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import PropTypes from 'prop-types';
import { mergeMovies, searchMovies } from '../api/omdb';
import MovieCard from '../components/MovieCard';
import { isApiKeyConfigured } from '../config';
import { colors, spacing } from '../theme';

export default function SearchScreen({ navigation }) {
  const [query, setQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('');
  const [results, setResults] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const loadingMoreRef = useRef(false);

  const openMovie = useCallback(
    (movie) => {
      navigation.navigate('Details', {
        imdbID: movie.imdbID,
        title: movie.Title,
      });
    },
    [navigation]
  );

  const runSearch = useCallback(async () => {
    const title = query.trim();
    Keyboard.dismiss();
    if (!title) {
      setError('Введіть назву фільму.');
      return;
    }

    setLoading(true);
    setError(null);
    setHasSearched(true);
    setResults([]);
    setTotal(0);
    setPage(1);
    setSubmittedQuery(title);

    try {
      const first = await searchMovies(title, 1);
      if (first.error) {
        setError(first.error);
        return;
      }

      let movies = first.movies;
      let nextPage = 1;
      if (first.total > movies.length) {
        try {
          const second = await searchMovies(title, 2);
          if (!second.error && second.movies.length > 0) {
            movies = mergeMovies(movies, second.movies);
            nextPage = 2;
          }
        } catch {
          // Перша сторінка вже валідна, тож показуємо її навіть без другої.
        }
      }

      setResults(movies);
      setTotal(first.total);
      setPage(nextPage);
    } catch (searchError) {
      setError(searchError.message);
    } finally {
      setLoading(false);
    }
  }, [query]);

  const loadMore = useCallback(async () => {
    if (loading || loadingMoreRef.current || !submittedQuery) {
      return;
    }
    if (results.length === 0 || results.length >= total) {
      return;
    }

    loadingMoreRef.current = true;
    setLoadingMore(true);
    const nextPage = page + 1;

    try {
      const data = await searchMovies(submittedQuery, nextPage);
      if (!data.error) {
        setResults((current) => mergeMovies(current, data.movies));
        setPage(nextPage);
      }
    } catch (searchError) {
      setError(searchError.message);
    } finally {
      loadingMoreRef.current = false;
      setLoadingMore(false);
    }
  }, [loading, page, results.length, submittedQuery, total]);

  const clearQuery = () => {
    setQuery('');
  };

  return (
    <View style={styles.screen}>
      <View style={styles.toolbar}>
        <Text style={styles.kicker}>OMDB</Text>
        <Text style={styles.heading}>Знайдіть фільм</Text>
        <View style={styles.searchRow}>
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Наприклад, Inception"
            placeholderTextColor={colors.muted}
            style={styles.input}
            returnKeyType="search"
            onSubmitEditing={runSearch}
            autoCorrect={false}
            autoCapitalize="none"
          />
          {query.length > 0 ? (
            <Pressable onPress={clearQuery} hitSlop={8} accessibilityLabel="Очистити">
              <Ionicons name="close-circle" size={20} color={colors.muted} />
            </Pressable>
          ) : null}
          <Pressable
            style={({ pressed }) => [styles.searchButton, pressed && styles.pressed]}
            onPress={runSearch}
            accessibilityRole="button"
            accessibilityLabel="Шукати"
          >
            <Ionicons name="search" size={20} color={colors.goldDeep} />
          </Pressable>
        </View>
        {!isApiKeyConfigured() ? (
          <Text style={styles.keyHint}>
            Додайте ключ API у src/config.js, інакше пошук не запрацює.
          </Text>
        ) : null}
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color={colors.gold} size="large" />
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.imdbID}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContent}
          keyboardShouldPersistTaps="handled"
          onEndReached={loadMore}
          onEndReachedThreshold={0.4}
          renderItem={({ item }) => (
            <MovieCard movie={item} onPress={() => openMovie(item)} />
          )}
          ListHeaderComponent={
            hasSearched && !error && total > 0 ? (
              <Text style={styles.count}>
                Показано {results.length} з {total}
              </Text>
            ) : null
          }
          ListFooterComponent={
            loadingMore ? (
              <ActivityIndicator color={colors.gold} style={styles.footer} />
            ) : (
              <View style={styles.footer} />
            )
          }
          ListEmptyComponent={
            <View style={styles.center}>
              <Ionicons
                name={error ? 'alert-circle-outline' : 'film-outline'}
                size={42}
                color={error ? colors.danger : colors.gold}
              />
              <Text style={[styles.emptyTitle, error && styles.errorText]}>
                {error
                  ? error
                  : hasSearched
                    ? 'Нічого не знайдено'
                    : 'Введіть назву й натисніть пошук'}
              </Text>
              {!error && !hasSearched ? (
                <Text style={styles.emptyBody}>
                  Якщо збігів більше десяти, список підвантажить наступні сторінки.
                </Text>
              ) : null}
            </View>
          }
        />
      )}
    </View>
  );
}

SearchScreen.propTypes = {
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
    paddingBottom: 12,
  },
  kicker: {
    color: colors.gold,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.4,
  },
  heading: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '700',
    marginTop: 4,
    marginBottom: 14,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.line,
    paddingLeft: 14,
    paddingRight: 6,
    minHeight: 52,
    gap: 8,
  },
  input: {
    flex: 1,
    color: colors.text,
    fontSize: 16,
    paddingVertical: 12,
  },
  searchButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.85,
  },
  keyHint: {
    color: colors.gold,
    marginTop: 10,
    fontSize: 13,
    lineHeight: 18,
  },
  listContent: {
    paddingHorizontal: spacing.screen,
    paddingBottom: 24,
    flexGrow: 1,
  },
  row: {
    justifyContent: 'space-between',
  },
  count: {
    color: colors.muted,
    marginBottom: 12,
    fontSize: 13,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
    paddingVertical: 48,
    gap: 10,
  },
  emptyTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  emptyBody: {
    color: colors.muted,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  errorText: {
    color: colors.danger,
  },
  footer: {
    height: 36,
    marginTop: 8,
  },
});
