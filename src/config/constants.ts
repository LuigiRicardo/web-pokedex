/**
 * Application configuration constants
 */

import type { GenerationMap } from '../types';

/**
 * API Configuration
 */
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'https://pokeapi.co/api/v2',
  POKEMON_ENDPOINT: 'pokemon',
  TIMEOUT: 10000,
} as const;

/**
 * Debounce delay for search input (milliseconds)
 */
export const SEARCH_DEBOUNCE_MS = 400;

/**
 * Number of Pokémon fetched per infinite scroll page
 */
export const PAGE_SIZE = 20;

/**
 * Generation boundaries using PokeAPI offsets.
 *
 * Each generation maps to:
 * - offset → starting index in the global Pokédex
 * - limit  → total Pokémon count in that generation
 */
export const GENERATIONS: GenerationMap = {
  gen1: { offset: 0, limit: 151 },
  gen2: { offset: 151, limit: 100 },
  gen3: { offset: 251, limit: 135 },
  gen4: { offset: 386, limit: 107 },
  gen5: { offset: 493, limit: 156 },
  gen6: { offset: 649, limit: 72 },
  gen7: { offset: 721, limit: 88 },
  gen8: { offset: 809, limit: 96 },
  gen9: { offset: 905, limit: 120 },
} as const;

/**
 * Sort options with display labels
 */
export const SORT_OPTIONS = {
  ID_ASC: 'ID (Crescente)',
  ID_DESC: 'ID (Decrescente)',
  AZ: 'A-Z',
  ZA: 'Z-A',
} as const;
