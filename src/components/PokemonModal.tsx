import React from 'react';
import type { Pokemon } from '../interfaces/pokemon';

interface ModalProps {
    pokemon: Pokemon | null;
    onClose: () => void;
}

// Componente de modal para detalhes do Pokémon com suporte a acessibilidade
const PokemonModal: React.FC<ModalProps> = ({ pokemon, onClose }) => {
    if (!pokemon) return null;

    return (    
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity">
            {/* Container do Modal */}
            <div className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl relative animate-in fade-in zoom-in duration-300">
                
                {/* Botão de Fechar */}
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-black z-10 bg-gray-100 rounded-full p-2"
                    aria-label="Close modal"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Cabeçalho do Modal (Imagem e Nome) */}
                <div className="bg-blue-500 p-8 flex flex-col items-center">
                    <img 
                        src={pokemon.sprites.other['official-artwork'].front_default} 
                        alt={pokemon.name}
                        className="w-48 h-48 object-contain drop-shadow-xl"
                    />
                    <h2 className="text-3xl font-black text-white capitalize mt-4">{pokemon.name}</h2>
                    <span className="text-blue-100 font-bold">#{String(pokemon.id).padStart(3, '0')}</span>
                </div>

                {/* Corpo do Modal (Informações Técnicas) */}
                <div className="p-6 grid grid-cols-2 gap-4 text-center">
                    <div className="bg-gray-50 p-3 rounded-2xl">
                        <span className="text-gray-400 text-xs uppercase font-bold block">Weight</span>
                        <span className="text-lg font-bold text-gray-800">{pokemon.weight! / 10} kg</span>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-2xl">
                        <span className="text-gray-400 text-xs uppercase font-bold block">Height</span>
                        <span className="text-lg font-bold text-gray-800">{pokemon.height! / 10} m</span>
                    </div>
                
                    <div className="col-span-2 mt-2">
                        <span className="text-gray-400 text-xs uppercase font-bold block mb-2 text-left px-2">Types</span>
                        <div className="flex gap-2 justify-start px-2">
                        {pokemon.types.map(t => (
                            <span key={t.type.name} className="px-4 py-1 rounded-full bg-blue-600 text-white text-sm font-bold uppercase">
                            {t.type.name}
                            </span>
                        ))}
                        </div>
                    </div>
                </div>
            </div>
        
            {/* Overlay para fechar ao clicar fora */}
            <div className="absolute inset-0 -z-10" onClick={onClose}></div>
        </div>
    );
};

export default PokemonModal;