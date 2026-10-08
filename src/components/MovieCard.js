import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import PropTypes from 'prop-types';
import { colors } from '../theme';

function hasPoster(poster) {
  return Boolean(poster) && poster !== 'N/A';
}

export default function MovieCard({ movie, onPress }) {
  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${movie.Title}, ${movie.Year}`}
    >
      <View style={styles.posterWrap}>
        {hasPoster(movie.Poster) ? (
          <Image source={{ uri: movie.Poster }} style={styles.poster} />
        ) : (
          <View style={styles.placeholder}>
            <Ionicons name="film-outline" size={32} color={colors.muted} />
          </View>
        )}
        <View style={styles.yearBadge}>
          <Text style={styles.year}>{movie.Year}</Text>
        </View>
      </View>
      <Text style={styles.title} numberOfLines={2}>
        {movie.Title}
      </Text>
    </Pressable>
  );
}

MovieCard.propTypes = {
  movie: PropTypes.shape({
    Title: PropTypes.string.isRequired,
    Year: PropTypes.string,
    imdbID: PropTypes.string.isRequired,
    Poster: PropTypes.string,
  }).isRequired,
  onPress: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  card: {
    width: '48%',
  },
  pressed: {
    opacity: 0.86,
  },
  posterWrap: {
    aspectRatio: 2 / 3,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: colors.poster,
    borderWidth: 1,
    borderColor: colors.line,
  },
  poster: {
    width: '100%',
    height: '100%',
  },
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  yearBadge: {
    position: 'absolute',
    left: 8,
    bottom: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: 'rgba(7, 8, 13, 0.82)',
  },
  year: {
    color: colors.gold,
    fontSize: 12,
    fontWeight: '700',
  },
  title: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 18,
    marginTop: 8,
    minHeight: 36,
  },
});
