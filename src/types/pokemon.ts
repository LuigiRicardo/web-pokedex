/**
 * Pokémon domain types and interfaces
 */

/**
 * Pokémon type information
 */
export interface PokemonType {
  type: {
    name: string;
  };
}

/**
 * Core Pokémon data model used throughout the application
 *
 * This interface represents the simplified Pokémon structure
 * after being normalized from the full PokéAPI response.
 *
 * Only the properties required by the UI are included.
 * This avoids overfetching and keeps the app lightweight.
 */
export interface Pokemon {
  id: number;
  name: string;
  types: PokemonType[];
  weight: number;
  height: number;
}

/**
 * Pokémon index item (minimal data for list operations)
 */
export interface PokemonIndexItem {
  name: string;
  id: number;
}
