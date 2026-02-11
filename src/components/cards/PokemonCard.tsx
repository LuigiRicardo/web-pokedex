import type { Pokemon } from '../../interfaces/pokemon';
import { getShowdownSprite } from '../../utils/getShowdownSprite';
import TypeBadge from "../TypeBadge/TypeBadge";
import React from "react";

interface PokemonCardProps {
    pokemon: Pokemon;
    onSelect: (pokemon: Pokemon) => void;
}

const PokemonCard: React.FC<PokemonCardProps> = ({ pokemon, onSelect }) => {
    return (
        <button
            onClick={() => onSelect(pokemon)}
            className="bg-white p-4 rounded-xl shadow-sm text-left cursor-pointer hover:scale-105 transition-transform focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label={`Open details for ${pokemon.name}`}
        >
            <span className="text-gray-500 font-bold">#{pokemon.id}</span>

            <img
                src={getShowdownSprite(pokemon.name)}
                alt={pokemon.name}
                className="w-32 h-32 object-contain block bg-gray-50 my-2"
                loading="lazy"
                decoding="async"
            />

            <h2 className="text-xl font-extrabold capitalize">
                {pokemon.name}
            </h2>

            <div className="flex gap-2 mt-2">
                {pokemon.types.map(t => (
                    <TypeBadge
                        key={t.type.name}
                        type={t.type.name}
                    />
                ))}
            </div>
        </button>
    );
};

export default React.memo(PokemonCard);
