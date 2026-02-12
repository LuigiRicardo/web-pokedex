/**
 * api.ts
 *
 * Service layer responsible for communicating with the PokeAPI.
 *
 * Responsibilities:
 * - Fetch Pokémon data from external API
 * - Normalize API responses into internal Pokemon interface
 * - Implement localStorage caching strategy
 * - Provide generation-based and paginated fetching
 *
 * Design Principles:
 * - External API shape is abstracted from UI layer
 * - Only simplified, domain-relevant data is exposed
 * - Basic caching strategy is implemented to reduce network requests
 */

import type { Pokemon } from "../interfaces/pokemon";

/**
 * Normalizes raw PokeAPI Pokémon response
 * into the application's internal Pokemon interface.
 *
 * Only required fields are extracted to:
 * - Reduce memory usage
 * - Improve consistency
 * - Decouple UI from full API response structure
 */
const simplifyPokemon = (data: any): Pokemon => ({
    id: data.id,
    name: data.name,
    types: data.types,
    weight: data.weight,
    height: data.height
});

/**
 * Fetches all Pokémon belonging to a specific generation.
 *
 * Process:
 * 1. Fetch generation metadata (contains species list)
 * 2. For each species, fetch full Pokémon detail
 * 3. Normalize each response
 * 4. Return sorted list by ID ascending
 *
 * Note:
 * This method performs multiple parallel requests and
 * may be heavy depending on generation size.
 */
export const getPokemonsByGeneration = async (
    generationId: number
): Promise<Pokemon[]> => {

    const res = await fetch(
        `https://pokeapi.co/api/v2/generation/${generationId}`
    );
    const data = await res.json();

    const pokemons = await Promise.all(
        data.pokemon_species.map(async (species: any) => {
            const res = await fetch(
                `https://pokeapi.co/api/v2/pokemon/${species.name}`
            );
            const detail = await res.json();
            return simplifyPokemon(detail);
        })
    );

    // Ensures deterministic ordering
    return pokemons.sort((a, b) => a.id - b.id);
};

/**
 * Fetches a paginated list of Pokémon using offset-based pagination.
 *
 * Features:
 * - Uses PokeAPI list endpoint (limit + offset)
 * - Fetches detailed Pokémon data per result
 * - Implements localStorage caching to reduce redundant API calls
 *
 * Caching Strategy:
 * - Cache key: "pokedex_cache"
 * - Cached by Pokémon name
 * - Entire cache object stored as JSON
 * - If storage quota exceeded, cache is cleared
 */
export const getPokemons = async (
    offset: number,
    limit: number = 20
): Promise<Pokemon[]> => {

    const CACHE_KEY = 'pokedex_cache';

    // Retrieve cache from localStorage
    const cachedData = localStorage.getItem(CACHE_KEY);
    let fullCache = cachedData ? JSON.parse(cachedData) : {};

    /**
     * Fetch paginated Pokémon references.
     * This endpoint only returns name + URL.
     */
    const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`
    );
    const data = await response.json();

    /**
     * Fetch detailed data for each Pokémon.
     * Uses cache when available.
     */
    const pokemonDetails = await Promise.all(
        data.results.map(async (pokeRef: { name: string; url: string }) => {

            // Return cached version if available
            if (fullCache[pokeRef.name]) {
                return fullCache[pokeRef.name];
            }

            // Otherwise fetch full detail
            const res = await fetch(pokeRef.url);
            const detailData = await res.json();
            const simplified = simplifyPokemon(detailData);

            // Store in cache
            fullCache[pokeRef.name] = simplified;

            return simplified;
        })
    );

    /**
     * Persist updated cache.
     * If storage quota exceeded, clear cache to prevent failure.
     */
    try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(fullCache));
    } catch (e) {
        console.warn("Cache full. Clearing storage for reuse.");
        localStorage.removeItem(CACHE_KEY);
    }

    return pokemonDetails;
};

/**
 * Fetches a single Pokémon by name or numeric ID.
 *
 * Used for global search functionality.
 *
 * Behavior:
 * - Returns normalized Pokémon object if found
 * - Returns null if not found or request fails
 */
export const getPokemonByNameOrId = async (
    query: string
): Promise<Pokemon | null> => {
    try {
        const res = await fetch(
            `https://pokeapi.co/api/v2/pokemon/${query.toLowerCase()}`
        );

        if (!res.ok) return null;

        const data = await res.json();
        return simplifyPokemon(data);

    } catch {
        return null;
    }
};
