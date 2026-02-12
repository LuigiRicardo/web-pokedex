import { useEffect } from 'react';
import React from 'react';
import type { Pokemon } from '../interfaces/pokemon';
import { getShowdownSprite } from '../utils/getShowdownSprite';
import TypeBadge from "./TypeBadge/TypeBadge";

/**
 * Props for the PokemonModal component.
 *
 * @property pokemon - The selected Pokémon to display.
 *                     If null, the modal will not render.
 * @property onClose - Callback function triggered when the modal is closed.
 */
interface ModalProps {
    pokemon: Pokemon | null;
    onClose: () => void;
}

/**
 * PokemonModal Component
 *
 * Displays detailed information about a selected Pokémon
 * in an accessible modal dialog.
 *
 * Responsibilities:
 * - Render Pokémon sprite and metadata
 * - Handle modal close interactions (button, Escape key, backdrop click)
 * - Manage accessibility attributes (ARIA roles)
 * - Automatically focus the close button when opened
 */
const PokemonModal: React.FC<ModalProps> = ({ pokemon, onClose }) => {
    // If no Pokémon is selected, do not render the modal
    if (!pokemon) return null;

    // Reference used to automatically focus the close button
    const closeButtonRef = React.useRef<HTMLButtonElement>(null);

    useEffect(() => {
        /**
         * Automatically focus the close button when the modal mounts.
         * This improves keyboard accessibility.
         */
        closeButtonRef.current?.focus();

        /**
         * Handles keyboard interaction.
         * Closes the modal when the Escape key is pressed.
         */
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        // Attach keydown listener when modal is mounted
        document.addEventListener('keydown', handleKey);

        // Cleanup listener when modal unmounts
        return () => document.removeEventListener('keydown', handleKey);
    }, [onClose]);

    return (    
        /**
         * Modal overlay container
         *
         * - Covers the full viewport
         * - Applies backdrop blur and semi-transparent dark background
         * - Uses ARIA attributes for accessibility compliance
         */
        <div 
            className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity"
            role="dialog"
            aria-modal="true"
            aria-labelledby="pokemon-title"
        >
            {/* Modal content container */}
            <div className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl relative animate-in fade-in zoom-in duration-300">
                
                {/* Close button */}
                <button 
                    ref={closeButtonRef}
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-black z-10 bg-gray-100 rounded-full p-2"
                    aria-label="Close modal"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth="2" 
                            d="M6 18L18 6M6 6l12 12" 
                        />
                    </svg>
                </button>

                {/* Header section with sprite and primary info */}
                <div className="bg-pink-300 p-8 flex flex-col items-center">
                    <img 
                        src={getShowdownSprite(pokemon.name)} 
                        alt={pokemon.name}
                        className="w-48 h-48 object-contain drop-shadow-xl"
                    />

                    {/* Pokémon name */}
                    <h2 
                        id="pokemon-title" 
                        className="text-3xl font-black text-white capitalize mt-4"
                    >
                        {pokemon.name}
                    </h2>

                    {/* Pokémon ID formatted with leading zeros */}
                    <span className="text-blue-100 font-bold">
                        #{String(pokemon.id).padStart(3, '0')}
                    </span>
                </div>

                {/* Stats and metadata section */}
                <div className="p-6 grid grid-cols-2 gap-4 text-center">
                    
                    {/* Weight (converted from hectograms to kg) */}
                    <div className="bg-gray-50 p-3 rounded-2xl">
                        <span className="text-gray-400 text-xs uppercase font-bold block">
                            Weight
                        </span>
                        <span className="text-lg font-bold text-gray-800">
                            {pokemon.weight! / 10} kg
                        </span>
                    </div>

                    {/* Height (converted from decimeters to meters) */}
                    <div className="bg-gray-50 p-3 rounded-2xl">
                        <span className="text-gray-400 text-xs uppercase font-bold block">
                            Height
                        </span>
                        <span className="text-lg font-bold text-gray-800">
                            {pokemon.height! / 10} m
                        </span>
                    </div>
                
                    {/* Pokémon types */}
                    <div className="col-span-2 mt-2">
                        <span className="text-gray-400 text-xs uppercase font-bold block mb-2 text-left px-2">
                            Types
                        </span>

                        <div className="flex gap-2 justify-start px-2">
                            {pokemon.types.map(t => (
                                <TypeBadge
                                    key={t.type.name}
                                    type={t.type.name}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Backdrop click area (closes modal when clicking outside content) */}
            <div 
                className="absolute inset-0 -z-10" 
                onClick={onClose}
            ></div>
        </div>
    );
};

export default PokemonModal;
