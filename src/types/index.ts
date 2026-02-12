/**
 * Centralized type definitions for the application
 *
 * This file exports all domain and UI types to maintain
 * a single source of truth across the project.
 */

/**
 * Available sorting strategies for Pokémon list
 */
export type SortOption = 'ID_ASC' | 'ID_DESC' | 'AZ' | 'ZA';

/**
 * Supported Pokémon generations (Gen 1-9)
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
 * Generation metadata including offset and total count
 */
export interface GenerationConfig {
  offset: number;
  limit: number;
}

/**
 * Map of all generations with their configurations
 */
export type GenerationMap = Record<Generation, GenerationConfig>;

/**
 * API pagination parameters
 */
export interface PaginationParams {
  offset: number;
  limit: number;
}

/**
 * Generic API response wrapper
 */
export interface ApiResponse<T> {
  data: T;
  error?: ApiErrorResponse;
}

/**
 * Standard error response format
 */
export interface ApiErrorResponse {
  status: number;
  message: string;
  code?: string;
}

/**
 * Filter state for Pokémon list
 */
export interface FilterState {
  search: string;
  types: string[];
  generation: Generation;
  sort: SortOption;
}
