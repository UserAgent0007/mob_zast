import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import PropTypes from 'prop-types';
import { getMovie } from '../api/omdb';
import { colors, spacing } from '../theme';

function hasValue(value) {
  return Boolean(value) && value !== 'N/A';
}

function InfoRow({ icon, label, value }) {
  if (!hasValue(value)) {
    return null;
  }

  return (
    <View style={styles.infoRow}>
      <Ionicons name={icon} size={18} color={colors.gold} />
      <View style={styles.infoText}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );
}

InfoRow.propTypes = {
  icon: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string,
};

export default function DetailsScreen({ route }) {
  const { imdbID } = route.params;
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const nextMovie = await getMovie(imdbID);
        if (active) {
          setMovie(nextMovie);
        }
      } catch (loadError) {
        if (active) {
          setError(loadError.message);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    })();

    return () => {
      active = false;
    };
  }, [imdbID]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.gold} size="large" />
      </View>
    );
  }

  if (error || !movie) {
    return (
      <View style={styles.center}>
        <Ionicons name="alert-circle-outline" size={42} color={colors.danger} />
        <Text style={styles.errorText}>{error || 'Фільм не знайдено.'}</Text>
      </View>
    );
  }

  const genres = hasValue(movie.Genre)
    ? movie.Genre.split(',').map((genre) => genre.trim())
    : [];
  const facts = [movie.Year, movie.Rated, movie.Runtime].filter(hasValue);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.hero}>
        {hasValue(movie.Poster) ? (
          <Image source={{ uri: movie.Poster }} style={styles.poster} />
        ) : (
          <View style={[styles.poster, styles.posterFallback]}>
            <Ionicons name="film-outline" size={42} color={colors.muted} />
          </View>
        )}
        <View style={styles.heroBody}>
          <Text style={styles.title}>{movie.Title}</Text>
          {facts.length > 0 ? <Text style={styles.facts}>{facts.join('  ·  ')}</Text> : null}
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={16} color={colors.gold} />
            <Text style={styles.rating}>
              {hasValue(movie.imdbRating) ? movie.imdbRating : '—'}
            </Text>
            {hasValue(movie.imdbVotes) ? (
              <Text style={styles.votes}>{movie.imdbVotes} голосів</Text>
            ) : null}
          </View>
        </View>
      </View>

      {genres.length > 0 ? (
        <View style={styles.genres}>
          {genres.map((genre) => (
            <View key={genre} style={styles.chip}>
              <Text style={styles.chipText}>{genre}</Text>
            </View>
          ))}
        </View>
      ) : null}

      <Text style={styles.section}>Сюжет</Text>
      <Text style={styles.plot}>
        {hasValue(movie.Plot) ? movie.Plot : 'Опис для цього фільму відсутній.'}
      </Text>

      <View style={styles.panel}>
        <InfoRow icon="film-outline" label="Режисер" value={movie.Director} />
        <InfoRow icon="create-outline" label="Сценарій" value={movie.Writer} />
        <InfoRow icon="people-outline" label="Актори" value={movie.Actors} />
        <InfoRow icon="calendar-outline" label="Прем’єра" value={movie.Released} />
        <InfoRow icon="language-outline" label="Мова" value={movie.Language} />
        <InfoRow icon="earth-outline" label="Країна" value={movie.Country} />
        <InfoRow icon="trophy-outline" label="Нагороди" value={movie.Awards} />
        <InfoRow icon="cash-outline" label="Касові збори" value={movie.BoxOffice} />
      </View>
    </ScrollView>
  );
}

DetailsScreen.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      imdbID: PropTypes.string.isRequired,
      title: PropTypes.string,
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
    paddingBottom: 40,
  },
  center: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 28,
    gap: 12,
  },
  errorText: {
    color: colors.danger,
    fontSize: 16,
    textAlign: 'center',
  },
  hero: {
    flexDirection: 'row',
    gap: 14,
  },
  poster: {
    width: 124,
    height: 186,
    borderRadius: 16,
    backgroundColor: colors.poster,
  },
  posterFallback: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.line,
  },
  heroBody: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    color: colors.text,
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 30,
  },
  facts: {
    color: colors.muted,
    marginTop: 8,
    fontSize: 14,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 12,
  },
  rating: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  votes: {
    color: colors.muted,
    fontSize: 13,
  },
  genres: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 18,
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: colors.surfaceRaised,
    borderWidth: 1,
    borderColor: colors.line,
  },
  chipText: {
    color: colors.gold,
    fontSize: 13,
    fontWeight: '600',
  },
  section: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
    marginTop: 22,
    marginBottom: 8,
  },
  plot: {
    color: colors.text,
    fontSize: 15,
    lineHeight: 22,
  },
  panel: {
    marginTop: 20,
    backgroundColor: colors.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.line,
    paddingVertical: 6,
  },
  infoRow: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  infoText: {
    flex: 1,
  },
  infoLabel: {
    color: colors.muted,
    fontSize: 12,
    marginBottom: 2,
  },
  infoValue: {
    color: colors.text,
    fontSize: 15,
    lineHeight: 20,
  },
});
