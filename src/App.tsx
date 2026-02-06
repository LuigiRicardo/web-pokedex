import React, { useEffect, useRef, useState} from 'react';
import Header from './components/Header';
import { usePokemons } from './hooks/usePokemons';
import type { Pokemon} from './interfaces/pokemon';
import PokemonModal from './components/PokemonModal';

const App: React.FC = () => {
  const [selectedPokemon, setSelectedPokemon] = React.useState<Pokemon | null>(null);
  const { pokemons, loading, fetchNextPage } = usePokemons();
  const observerTarget = useRef<HTMLDivElement>(null);
  const [hasMore] = useState(true);
  const [searchTerm, setSearchTerm] = React.useState("");

  const filteredPokemons = pokemons.filter(pokemon => 
    pokemon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pokemon.id.toString().includes(searchTerm)
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Agora usamos 'loading' e 'fetchNextPage', limpando os avisos do TS
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
      <Header searchTerm={searchTerm} onSearchChange={setSearchTerm}/>

      <main className="max-w-7xl mx-auto pt-44 px-4 pb-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredPokemons.map((pokemon) => (
              <div 
                key={pokemon.id}
                onClick={() => setSelectedPokemon(pokemon)} // 2. Abre o modal ao clicar
                className="bg-white p-4 rounded-xl shadow-sm cursor-pointer hover:scale-105 transition-transform"
              >
                {/* ID do Pokémon */}
                <span className="text-gray-500 font-bold">#{pokemon.id}</span>
                
                {/* Imagem com tamanho fixo para garantir visibilidade */}
                <img 
                  src={pokemon.sprites.other['official-artwork'].front_default} 
                  alt={pokemon.name}
                  className="w-32 h-32 object-contain block bg-gray-50 my-2"
                  onError={() => console.log(`Erro ao carregar imagem de ${pokemon.name}`)}
                  loading='lazy'
                />
                
                {/* Nome com cor forte e capitalize */}
                <h2 className="text-xl font-extrabold text-black capitalize">
                  {pokemon.name}
                </h2>
                
                {/* Tipos */}
                <div className="flex gap-2 mt-2">
                  {pokemon.types.map((t) => (
                    <span key={t.type.name} className="px-2 py-1 bg-blue-600 text-white text-xs rounded">
                      {t.type.name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          
        </div>
        
        {hasMore && (
        <div ref={observerTarget} className="h-20 flex items-center justify-center w-full">
          {loading && (
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          )}
        </div>
      )}

      {!hasMore && (
        <p className="text-center text-gray-400 py-10 font-medium">
          Você chegou ao fim da 1ª Geração!
        </p>
      )}
      
      {filteredPokemons.length === 0 && !loading && (
        <div className="text-center py-20 text-gray-500 font-medium">
          No Pokémon found with "{searchTerm}"
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