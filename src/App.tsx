import React, { useEffect, useRef, useState} from 'react';
import Header from './components/Header';
import { usePokemons } from './hooks/usePokemons';
import type { Pokemon } from './interfaces/pokemon';
import PokemonModal from './components/PokemonModal';
import FilterMenu from './components/FilterMenu';
import PokemonCard from './components/cards/PokemonCard';
import { useGlobalSearch } from './hooks/useGlobalSearch';
import { useDebounce } from "./hooks/useDebounce";

type SortOption = 'ID_ASC' | 'ID_DESC' | 'AZ' | 'ZA';
type Generation =
  | 'gen1' | 'gen2' | 'gen3'
  | 'gen4' | 'gen5' | 'gen6'
  | 'gen7' | 'gen8' | 'gen9';

const App: React.FC = () => {
  const handleSelectPokemon = React.useCallback((pokemon: Pokemon) => {
    setSelectedPokemon(pokemon);
  }, []);
  const handleOpenFilters = React.useCallback(() => {
    setFiltersOpen(true);
  }, []);
  const handleCloseFilters = React.useCallback(() => {
    setFiltersOpen(false);
  }, []);
  const [search, setSearch] = useState('');
  const handleSearchChange = React.useCallback((value: string) => {
    setSearch(value);
  }, []);
  const debouncedSearch = useDebounce(search, 400);
  const [types, setTypes] = useState<string[]>([]);
  const [sort, setSort] = useState<SortOption>('ID_ASC');
  const [selectedPokemon, setSelectedPokemon] = 
    React.useState<Pokemon | null>(null);
  const [generation, setGeneration] = useState<Generation>('gen1');
  const { results: searchedPokemon, loading: searching } =
    useGlobalSearch(debouncedSearch);
  const isSearching =
    debouncedSearch.trim().length > 0 &&
    (searchedPokemon !== null || searching);
  const { pokemons, loading, hasMore, fetchNextPage,} =
    usePokemons({
      generation,
      search: isSearching ? "" : search,
      types,
      sort,
    });
  const pokemonsToRender = isSearching 
    ? searchedPokemon
    : pokemons; 
  const [filtersOpen, setFiltersOpen] = useState(false);

  const observerTarget = useRef<HTMLDivElement>(null);

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
      <Header
        searchTerm={search}
        onSearchChange={handleSearchChange}
        onOpenFilters={handleOpenFilters}
        filtersOpen={filtersOpen}
      />
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
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {pokemonsToRender.map(pokemon => (
              <PokemonCard
                key={pokemon.id}
                pokemon={pokemon}
                onSelect={handleSelectPokemon}
              />
            ))}
          
        </div>
        
        {!isSearching && hasMore && (
          <div ref={observerTarget} className="h-20 flex items-center justify-center w-full">
            {loading && (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" aria-hidden="true"></div>
            )}
          </div>
        )}

      {!hasMore && (
        <p className="text-center text-gray-400 py-10 font-medium">
          No more Pokémons
        </p>
      )}
      
      {pokemonsToRender.length === 0 && !loading && (
        <div className="text-center py-20 text-gray-500 font-medium">
          No Pokémon found with "{search}"
        </div>
      )}
      </main>
      <PokemonModal 
        pokemon={selectedPokemon} 
        onClose={() => setSelectedPokemon(null)} 
      />
    </div>
  );
};

export default App;