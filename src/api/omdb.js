import { isApiKeyConfigured, OMDB_API_KEY } from '../config';

const ENDPOINT = 'https://www.omdbapi.com/';
const NOT_FOUND = 'Movie not found!';

function translateError(message) {
  if (!message || message === NOT_FOUND) {
    return null;
  }
  if (message === 'Invalid API key!') {
    return 'Недійсний ключ OMDB. Вкажіть його у src/config.js.';
  }
  if (message === 'Too many results.') {
    return 'Запит надто загальний. Уточніть назву фільму.';
  }
  return message;
}

async function request(params) {
  if (!isApiKeyConfigured()) {
    throw new Error('Додайте ключ OMDB у файл src/config.js.');
  }

  const query = new URLSearchParams({
    apikey: OMDB_API_KEY,
    ...params,
  });

  let response;
  try {
    response = await fetch(`${ENDPOINT}?${query.toString()}`);
  } catch {
    throw new Error('Немає з’єднання з OMDB. Перевірте мережу.');
  }

  if (!response.ok) {
    throw new Error('Сервіс OMDB тимчасово недоступний.');
  }

  return response.json();
}

export async function searchMovies(title, page = 1) {
  const data = await request({
    s: title,
    type: 'movie',
    page: String(page),
  });

  if (data.Response === 'False') {
    const error = translateError(data.Error);
    return {
      movies: [],
      total: 0,
      error,
    };
  }

  return {
    movies: data.Search || [],
    total: Number(data.totalResults) || 0,
    error: null,
  };
}

export async function getMovie(imdbID) {
  const data = await request({
    i: imdbID,
    plot: 'full',
  });

  if (data.Response === 'False') {
    throw new Error(translateError(data.Error) || 'Не вдалося завантажити фільм.');
  }

  return data;
}

export function mergeMovies(current, incoming) {
  const seen = new Set(current.map((movie) => movie.imdbID));
  const next = current.slice();
  incoming.forEach((movie) => {
    if (!seen.has(movie.imdbID)) {
      seen.add(movie.imdbID);
      next.push(movie);
    }
  });
  return next;
}
