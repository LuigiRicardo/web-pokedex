/**
 * usePokemons.ts
 *
 * Custom hook responsible for:
 * - Fetching paginated Pokémon data by generation
 * - Managing infinite scrolling state
 * - Applying client-side search filtering
 * - Applying type filtering
 * - Applying sorting strategies
 *
 * Architectural Design:
 * - Pagination is generation-aware (offset + limit per generation)
 * - Data fetching is incremental (PAGE_SIZE based)
 * - Filtering and sorting are computed client-side via useMemo
 * - Deduplication is enforced using a Map keyed by Pokémon ID
 *
 * This hook abstracts all list management logic away from UI components.
 */

import React from 'react';
import { useEffect, useState } from 'react';
import { getPokemons } from '../services/api';
import type { Pokemon } from '../interfaces/pokemon';

/**
 * Defines generation boundaries using PokeAPI offsets.
 *
 * Each generation maps to:
 * - offset → starting index in the global Pokédex
 * - limit  → total Pokémon count in that generation
 */
const GENERATIONS = {
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
 * Available sorting strategies.
 */
export type SortOption = 'ID_ASC' | 'ID_DESC' | 'AZ' | 'ZA';

/**
 * Supported Pokémon generations.
 */
export type Generation =
  | 'gen1'
  | 'gen2'
  | 'gen3'
  | 'gen4'
  | 'gen5'
  | 'gen6'
  | 'gen7'
  | 'gen8'
  | 'gen9';

/**
 * Number of Pokémon fetched per page (infinite scroll chunk size).
 */
const PAGE_SIZE = 20;

/**
 * Parameters accepted by usePokemons hook.
 */
interface UsePokemonsParams {
  /** Selected generation */
  generation: Generation;

  /** Local search string (client-side filtering) */
  search: string;

  /** Selected type filters */
  types: string[];

  /** Selected sorting strategy */
  sort: SortOption;
}

export const usePokemons = ({
  generation,
  search,
  types,
  sort,
}: UsePokemonsParams) => {
  /**
   * Raw fetched Pokémon data (before filtering and sorting).
   */
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);

  /**
   * Applies client-side filtering and sorting.
   *
   * Order of operations:
   * 1. Text search filter (name or ID)
   * 2. Type filtering (must include ALL selected types)
   * 3. Sorting strategy
   *
   * Memoized to avoid unnecessary recalculations.
   */
  const filteredPokemons = React.useMemo(() => {
    let result = [...pokemons];

    // Text-based filtering (name or numeric ID)
    if (search.trim()) {
      const term = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(term) || p.id.toString().includes(term)
      );
    }

    // Type filtering (intersection logic)
    if (types.length > 0) {
      result = result.filter((pokemon) =>
        types.every((t) => pokemon.types.some((pt) => pt.type.name === t))
      );
    }

    // Sorting strategy
    switch (sort) {
      case 'ID_ASC':
        result.sort((a, b) => a.id - b.id);
        break;

      case 'ID_DESC':
        result.sort((a, b) => b.id - a.id);
        break;

      case 'AZ':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;

      case 'ZA':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
    }

    return result;
  }, [pokemons, search, types, sort]);

  /**
   * Tracks how many Pokémon have been requested so far.
   * Used to calculate the next page offset.
   */
  const [loadedCount, setLoadedCount] = useState(0);

  /**
   * Indicates whether a fetch operation is in progress.
   */
  const [loading, setLoading] = useState(false);

  /**
   * Indicates whether more Pokémon are available in the current generation.
   */
  const [hasMore, setHasMore] = useState(true);

  /**
   * Extracts generation-specific offset and limit.
   */
  const { offset: baseOffset, limit: generationLimit } =
    GENERATIONS[generation];

  /**
   * Resets pagination and list when:
   * - Generation changes
   * - Sorting changes
   *
   * Sorting reset ensures correct pagination order.
   */
  useEffect(() => {
    setPokemons([]);
    setHasMore(true);
    setLoadedCount(0);
  }, [generation, sort]);

  /**
   * Handles data fetching.
   *
   * Triggered whenever loadedCount changes.
   *
   * Logic:
   * - Calculates remaining Pokémon in the generation
   * - Determines real offset (supports descending fetch)
   * - Fetches data chunk
   * - Deduplicates results
   * - Updates hasMore state
   */
  useEffect(() => {
    const loadPokemons = async () => {
      if (loading || !hasMore) return;

      setLoading(true);

      try {
        const remaining = generationLimit - loadedCount;
        const limit = Math.min(PAGE_SIZE, remaining);
        const isDescending = sort === 'ID_DESC';

        /**
         * Offset calculation differs depending on sort direction.
         *
         * For descending order:
         * - We fetch from the end of the generation backwards.
         *
         * For ascending:
         * - We fetch progressively forward.
         */
        const realOffset = isDescending
          ? baseOffset + generationLimit - loadedCount - limit
          : baseOffset + loadedCount;

        if (limit <= 0) {
          setHasMore(false);
          return;
        }

        const newPokemons = await getPokemons(realOffset, limit);

        /**
         * Deduplicates Pokémon using a Map keyed by ID.
         * Ensures consistent dataset when switching sort direction.
         */
        setPokemons((prev) => {
          const map = new Map<number, Pokemon>();
          [...prev, ...newPokemons].forEach((p) => map.set(p.id, p));

          // Always keep internal storage sorted by ID ascending
          // (final ordering is handled in filteredPokemons)
          return Array.from(map.values()).sort((a, b) => a.id - b.id);
        });

        if (loadedCount + limit >= generationLimit) {
          setHasMore(false);
        }
      } catch (err) {
        console.error('Error fetching Pokémons:', err);
      } finally {
        setLoading(false);
      }
    };

    loadPokemons();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadedCount, generation, sort]);

  /**
   * Triggers loading of the next page.
   * Used by infinite scroll.
   */
  const fetchNextPage = () => {
    if (!loading && hasMore) {
      setLoadedCount((prev) => prev + PAGE_SIZE);
    }
  };

  return {
    pokemons: filteredPokemons,
    loading,
    hasMore,
    fetchNextPage,
  };
};
