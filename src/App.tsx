import React, { useEffect, useRef, useState} from 'react';
import Header from './components/Header';
import { usePokemons } from './hooks/usePokemons';
import type { Pokemon} from './interfaces/pokemon';
import PokemonModal from './components/PokemonModal';
import FilterMenu from './components/FilterMenu';
import { getShowdownSprite } from './utils/getShowdownSprite';

type SortOption = 'ID_ASC' | 'ID_DESC' | 'AZ' | 'ZA';
type Generation =
  | 'gen1' | 'gen2' | 'gen3'
  | 'gen4' | 'gen5' | 'gen6'
  | 'gen7' | 'gen8' | 'gen9';

const App: React.FC = () => {
  const [search, setSearch] = useState('');
  const [types, setTypes] = useState<string[]>([]);
  const [sort, setSort] = useState<SortOption>('ID_ASC');
  const [selectedPokemon, setSelectedPokemon] = 
    React.useState<Pokemon | null>(null);
  const [generation, setGeneration] = useState<Generation>('gen1');
  const { pokemons, loading, hasMore, fetchNextPage } =
    usePokemons({
      generation,
      search,
      types,
      sort,
    });
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
        rootMargin: '100px'
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
        onSearchChange={setSearch}
        onOpenFilters={() => setFiltersOpen(true)}
        filtersOpen={filtersOpen}
      />
      <FilterMenu
        isOpen={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        generation={generation}
        setGeneration={setGeneration}
        types={types}
        setTypes={setTypes}
        sort={sort}
        setSort={setSort}
      />
      <main className="max-w-7xl mx-auto pt-44 px-4 pb-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {pokemons.map((pokemon) => (
              <button 
                key={pokemon.id}
                onClick={() => setSelectedPokemon(pokemon)} 
                className="bg-white p-4 rounded-xl shadow-sm text-left focus:outline-none focus:ring-2 focus:ring-blue-600 hover:scale-105 transition-transform"
                aria-haspopup="dialog"
              >
                <span className="text-gray-500 font-bold">#{pokemon.id}</span>
                <img 
                  src={getShowdownSprite(pokemon.name)}
                  alt={pokemon.name}
                  className="w-32 h-32 object-contain block bg-gray-50 my-2"
                  onError={() => console.log(`Erro ao carregar imagem de ${pokemon.name}`)}
                  loading='lazy'
                />
                <h2 className="text-xl font-extrabold text-black capitalize">
                  {pokemon.name}
                </h2>
                <div className="flex gap-2 mt-2">
                  {pokemon.types.map((t) => (
                    <span key={t.type.name} className="px-2 py-1 bg-blue-600 text-white text-xs rounded">
                      {t.type.name}
                    </span>
                  ))}
                </div>
              </button>
            ))}
          
        </div>
        
        {hasMore && (
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
      
      {pokemons.length === 0 && !loading && (
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