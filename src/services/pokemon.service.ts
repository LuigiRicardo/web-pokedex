import type { Pokemon } from '../interfaces/pokemon';
import { fetchPokemonByQuery, fetchPokemonIndex } from '../api/pokemon.api';
import { mapPokemon, mapPokemonIndex } from '../mappers/pokemon.mapper';

export interface PokemonIndexItem {
  name: string;
  id: number;
}

let indexCache: PokemonIndexItem[] | null = null;
let indexPending: Promise<PokemonIndexItem[]> | null = null;

/**
 * Busca um Pokémon específico
 */
export const searchPokemon = async (query: string): Promise<Pokemon | null> => {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) return null;

  try {
    const data = await fetchPokemonByQuery(normalizedQuery);
    return mapPokemon(data);
  } catch {
    return null;
  }
};

/**
 * Busca e armazena em cache o índice completo
 */
export const getPokemonIndex = async (): Promise<PokemonIndexItem[]> => {
  if (indexCache) return indexCache;
  if (indexPending) return indexPending;

  indexPending = fetchPokemonIndex().then((data) => {
    const mapped = mapPokemonIndex(data);
    indexCache = mapped;
    return mapped;
  });

  return indexPending;
};
