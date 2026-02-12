import type { Pokemon } from '../../interfaces/pokemon';
import { getShowdownSprite } from '../../utils/getShowdownSprite';
import TypeBadge from "../TypeBadge/TypeBadge";
import React from "react";

/**
 * Props for the PokemonCard component.
 *
 * @property pokemon  - Pokémon data object used for rendering.
 * @property onSelect - Callback triggered when the card is clicked.
 *                      Typically used to open the details modal.
 */
interface PokemonCardProps {
    pokemon: Pokemon;
    onSelect: (pokemon: Pokemon) => void;
}

/**
 * PokemonCard Component
 *
 * Responsibilities:
 * - Display a summarized view of a Pokémon
 * - Emit selection events to parent components
 * - Render sprite, name, ID, and types
 *
 * Architectural Notes:
 * - Pure presentational component
 * - No internal state
 * - Wrapped in React.memo for render optimization
 *
 * Performance Considerations:
 * - Uses lazy image loading
 * - Uses async image decoding
 * - Memoized to prevent unnecessary re-renders
 */
const PokemonCard: React.FC<PokemonCardProps> = ({ pokemon, onSelect }) => {
    return (
        /**
         * Entire card is a button to ensure:
         * - Keyboard accessibility
         * - Proper semantic interaction
         * - Screen reader clarity
         */
        <button
            onClick={() => onSelect(pokemon)}
            className="
                bg-white p-4 rounded-xl shadow-sm
                text-left cursor-pointer
                hover:scale-105 transition-transform
                focus:outline-none focus:ring-2 focus:ring-blue-500
            "
            aria-label={`Open details for ${pokemon.name}`}
        >
            {/* Pokémon ID */}
            <span className="text-gray-500 font-bold">
                #{pokemon.id}
            </span>

            {/* Pokémon sprite */}
            <img
                src={getShowdownSprite(pokemon.name)}
                alt={pokemon.name}
                className="w-32 h-32 object-contain block bg-gray-50 my-2"
                loading="lazy"
                decoding="async"
            />

            {/* Pokémon name */}
            <h2 className="text-xl font-extrabold capitalize">
                {pokemon.name}
            </h2>

            {/* Pokémon types */}
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

/**
 * React.memo prevents unnecessary re-renders.
 *
 * The component will only re-render if:
 * - The pokemon prop reference changes
 * - The onSelect function reference changes
 */
export default React.memo(PokemonCard);
