const fromEnv = process.env.EXPO_PUBLIC_OMDB_API_KEY;

export const OMDB_API_KEY =
  fromEnv && fromEnv.trim().length > 0 ? fromEnv.trim() : 'ac87490c';

export function isApiKeyConfigured() {
  return OMDB_API_KEY.length > 0 && OMDB_API_KEY !== 'PASTE_YOUR_OMDB_KEY';
}
