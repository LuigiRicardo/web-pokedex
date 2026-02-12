/**
 * useGlobalSearch.ts
 *
 * Custom hook responsible for global Pokémon search.
 *
 * Responsibilities:
 * - Perform partial name or ID matching
 * - Fetch full Pokémon details for matched entries
 * - Manage loading state
 * - Limit result size to prevent excessive network requests
 *
 * Architectural Strategy:
 * - Uses a lightweight Pokémon index for fast local filtering
 * - Only fetches full Pokémon data for matched results
 * - Separates global search logic from paginated generation fetching
 *
 * This avoids interfering with infinite scroll logic
 * while enabling fast, responsive search behavior.
 */

import { useEffect, useState } from 'react';
import type { Pokemon } from '../interfaces/pokemon';
import { getPokemonIndex } from '../services/pokemon.service';
import { getPokemonByNameOrId } from '../services/api';

export const useGlobalSearch = (search: string) => {
  /**
   * Stores detailed Pokémon results after lookup.
   */
  const [results, setResults] = useState<Pokemon[]>([]);

  /**
   * Indicates whether search is currently in progress.
   */
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    /**
     * Normalizes search term:
     * - Trim whitespace
     * - Convert to lowercase for case-insensitive matching
     */
    const term = search.trim().toLowerCase();

    // If search is empty, reset results
    if (!term) {
      setResults([]);
      return;
    }

    /**
     * AbortController prepared for potential cancellation.
     * (Currently not passed to fetch calls, but allows future enhancement.)
     */
    const controller = new AbortController();

    const fetchResults = async () => {
      setLoading(true);

      try {
        /**
         * Step 1: Retrieve full Pokémon index.
         * This index should contain lightweight entries:
         * - name
         * - id
         */
        const index = await getPokemonIndex();

        /**
         * Step 2: Perform local partial matching.
         *
         * Matching rules:
         * - Name includes search term
         * - OR ID includes search term
         *
         * Results are limited to 20 to:
         * - Prevent excessive detail fetch requests
         * - Improve performance
         */
        const matches = index
          .filter(
            (p) => p.name.includes(term) || p.id.toString().includes(term)
          )
          .slice(0, 20);

        /**
         * Step 3: Fetch detailed Pokémon data
         * for matched entries.
         */
        const detailed = await Promise.all(
          matches.map((p) => getPokemonByNameOrId(p.name))
        );

        /**
         * Filters out null results
         * (in case any fetch fails or returns not found).
         */
        setResults(detailed.filter(Boolean) as Pokemon[]);
      } catch (err) {
        /**
         * Ignore AbortController cancellation errors.
         * Log only unexpected errors.
         */
        if (!(err instanceof DOMException)) {
          console.error(err);
        }

        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();

    /**
     * Cleanup function:
     * Cancels pending request if search changes quickly.
     */
    return () => controller.abort();
  }, [search]);

  return { results, loading };
};
