/**
 * App.tsx
 *
 * Root component of the Pokedex application.
 *
 * Responsibilities:
 * - Manages global UI state (search, filters, sorting, modal state)
 * - Coordinates data fetching through custom hooks
 * - Controls infinite scrolling behavior
 * - Orchestrates interaction between layout components
 *
 * Architectural Notes:
 * - Data fetching is delegated to custom hooks (usePokemons, useGlobalSearch)
 * - UI state is managed locally using React hooks
 * - Infinite scrolling is implemented using IntersectionObserver
 * - Search behavior is debounced to reduce unnecessary API calls
 */

import React, { useEffect, useRef, useState } from 'react';
import Header from './components/Header';
import { usePokemons } from './hooks/usePokemons';
import type { Pokemon } from './interfaces/pokemon';
import PokemonModal from './components/PokemonModal';
import FilterMenu from './components/FilterMenu';
import PokemonCard from './components/cards/PokemonCard';
import { useGlobalSearch } from './hooks/useGlobalSearch';
import { useDebounce } from "./hooks/useDebounce";
import type { SortOption } from './hooks/usePokemons';
import type { Generation } from './hooks/usePokemons';

const App: React.FC = () => {

  /**
   * Stores the currently selected Pokémon for modal visualization.
   * Null means no modal is open.
   */
  const [selectedPokemon, setSelectedPokemon] =
    React.useState<Pokemon | null>(null);

  /**
   * Controls the visibility of the filter side menu.
   */
  const [filtersOpen, setFiltersOpen] = useState(false);

  /**
   * Search input state (raw user input).
   */
  const [search, setSearch] = useState('');

  /**
   * Debounced search value to prevent excessive API calls.
   * Delay: 400ms
   */
  const debouncedSearch = useDebounce(search, 400);

  /**
   * Selected Pokémon types for filtering.
   */
  const [types, setTypes] = useState<string[]>([]);

  /**
   * Current sorting strategy.
   */
  const [sort, setSort] = useState<SortOption>('ID_ASC');

  /**
   * Currently selected Pokémon generation.
   */
  const [generation, setGeneration] = useState<Generation>('gen1');

  /**
   * Callback triggered when a Pokémon card is selected.
   * Memoized to prevent unnecessary re-renders of child components.
   */
  const handleSelectPokemon = React.useCallback((pokemon: Pokemon) => {
    setSelectedPokemon(pokemon);
  }, []);

  /**
   * Opens filter side menu.
   */
  const handleOpenFilters = React.useCallback(() => {
    setFiltersOpen(true);
  }, []);

  /**
   * Closes filter side menu.
   */
  const handleCloseFilters = React.useCallback(() => {
    setFiltersOpen(false);
  }, []);

  /**
   * Updates search input value.
   */
  const handleSearchChange = React.useCallback((value: string) => {
    setSearch(value);
  }, []);

  /**
   * Global search hook.
   *
   * This hook performs a direct Pokémon lookup when the user
   * types a specific name or ID.
   */
  const { results: searchedPokemon, loading: searching } =
    useGlobalSearch(debouncedSearch);

  /**
   * Determines whether the application is currently
   * operating in "global search mode".
   *
   * Global search overrides paginated generation fetching.
   */
  const isSearching =
    debouncedSearch.trim().length > 0 &&
    (searchedPokemon !== null || searching);

  /**
   * Main Pokémon fetching hook.
   *
   * Behavior:
   * - Fetches paginated Pokémon by generation
   * - Applies type filtering
   * - Applies sorting
   * - Ignores search filtering when global search is active
   */
  const { pokemons, loading, hasMore, fetchNextPage } =
    usePokemons({
      generation,
      search: isSearching ? "" : search,
      types,
      sort,
    });

  /**
   * Determines which Pokémon list should be rendered:
   * - Global search results (if searching)
   * - Paginated generation results (default)
    * Global search is separated from paginated fetching
    * to optimize performance and allow direct Pokémon lookup
    * without interfering with infinite scroll behavior.
   */
  const pokemonsToRender = isSearching
    ? searchedPokemon
    : pokemons;

  /**
   * Reference element used as a trigger for infinite scrolling.
   * When visible, it triggers the next page fetch.
   */
  const observerTarget = useRef<HTMLDivElement>(null);

  /**
   * Infinite Scroll Implementation
   *
   * Uses IntersectionObserver to detect when the sentinel element
   * enters the viewport. When triggered and not currently loading,
   * it fetches the next page of Pokémon.
   *
   * rootMargin increases preloading distance for smoother UX.
   */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          fetchNextPage();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '300px'
      }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [loading, fetchNextPage]);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Top navigation header (search + filter toggle) */}
      <Header
        searchTerm={search}
        onSearchChange={handleSearchChange}
        onOpenFilters={handleOpenFilters}
        filtersOpen={filtersOpen}
      />

      {/* Side filter menu (generation, types, sorting) */}
      <FilterMenu
        isOpen={filtersOpen}
        onClose={handleCloseFilters}
        generation={generation}
        setGeneration={setGeneration}
        types={types}
        setTypes={setTypes}
        sort={sort}
        setSort={setSort}
      />

      <main className="max-w-7xl mx-auto pt-44 px-4 pb-10">

        {/* Pokémon grid layout */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {pokemonsToRender.map(pokemon => (
            <PokemonCard
              key={pokemon.id}
              pokemon={pokemon}
              onSelect={handleSelectPokemon}
            />
          ))}
        </div>

        {/* Infinite scroll sentinel + loading spinner */}
        {!isSearching && hasMore && (
          <div
            ref={observerTarget}
            className="h-20 flex items-center justify-center w-full"
          >
            {loading && (
              <div
                className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"
                aria-hidden="true"
              ></div>
            )}
          </div>
        )}

        {/* End-of-list indicator */}
        {!hasMore && (
          <p className="text-center text-gray-400 py-10 font-medium">
            No more Pokémons
          </p>
        )}

        {/* Empty search state */}
        {pokemonsToRender.length === 0 && !loading && (
          <div className="text-center py-20 text-gray-500 font-medium">
            No Pokémon found with "{search}"
          </div>
        )}
      </main>

      {/* Pokémon details modal */}
      <PokemonModal
        pokemon={selectedPokemon}
        onClose={() => setSelectedPokemon(null)}
      />
    </div>
  );
};

export default App;
