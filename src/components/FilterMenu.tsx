import React from 'react';
import { useEffect } from 'react';
import TypeBadge from './TypeBadge';

type SortOption = 'ID_ASC' | 'ID_DESC' | 'AZ' | 'ZA';

type Generation =
    | 'gen1' | 'gen2' | 'gen3'
    | 'gen4' | 'gen5' | 'gen6'
    | 'gen7' | 'gen8' | 'gen9';

const GENERATIONS: { key: Generation; label: string }[] = [
    { key: 'gen1', label: 'Generation I' },
    { key: 'gen2', label: 'Generation II' },
    { key: 'gen3', label: 'Generation III' },
    { key: 'gen4', label: 'Generation IV' },
    { key: 'gen5', label: 'Generation V' },
    { key: 'gen6', label: 'Generation VI' },
    { key: 'gen7', label: 'Generation VII' },
    { key: 'gen8', label: 'Generation VIII' },
    { key: 'gen9', label: 'Generation IX' },
];
interface FilterMenuProps {
    isOpen: boolean;
    onClose: () => void;

    generation: Generation;
    setGeneration: (g: Generation) => void;

    types: string[];
    setTypes: (types: string[]) => void;

    sort: SortOption;
    setSort: (s: SortOption) => void;
}


const ALL_TYPES = [
    'normal', 'fire', 'water', 'grass', 'electric', 'ice',
    'fighting', 'poison', 'ground', 'flying', 'psychic',
    'bug', 'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
];

const FilterMenu: React.FC<FilterMenuProps> = ({
    isOpen,
    onClose,
    generation,
    setGeneration,
    types,
    setTypes,
    sort,
    setSort,
}) => {
    if (!isOpen) return null;

    const toggleType = (type: string) => {
        setTypes(
            types.includes(type)
                ? types.filter(t => t !== type)
                : [...types, type]
        );
    };
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [onClose]);


    return (
        <div
            className="fixed inset-0 z-50 bg-black/50"
            role="dialog"
            aria-modal="true"
            aria-label="Pokémon filters"
        >
            {/* Overlay */}
            <div
                className="absolute inset-0"
                onClick={onClose}
                aria-hidden="true"
            />
            <aside
                id="filter-menu"
                role="dialog"
                aria-modal="true"
                aria-labelledby="filters-title"
                className="absolute right-0 top-0 h-full w-full max-w-sm
                bg-white p-6 overflow-y-auto
                shadow-2xl
                border-l border-gray-200"
                onClick={(e) => e.stopPropagation()}
            >

                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h2 id="filters-title" className="text-2xl font-extrabold tracking-tight">
                        Filters
                    </h2>
                    <button
                        onClick={onClose}
                        aria-label="Close filters"
                        className="w-9 h-9 flex items-center justify-center
                            rounded-full bg-gray-100
                            hover:bg-gray-200
                            transition"
                    >
                        ✕
                    </button>
                </div>

                {/* Generation */}
                <section className="mb-8">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-3">
                        Generation
                    </h3>

                    <div className="grid grid-cols-2 gap-2">
                        {GENERATIONS.map(gen => {
                            const selected = generation === gen.key;

                            return (
                                <button
                                    key={gen.key}
                                    onClick={() => setGeneration(gen.key)}
                                    className={`
                                        py-2 px-3 rounded-lg text-sm font-semibold
                                        transition
                                        ${selected
                                            ? "bg-black text-white"
                                            : "bg-gray-100 hover:bg-gray-200"}
                                    `}
                                >
                                    {gen.label}
                                </button>
                            );
                        })}
                    </div>
                </section>


                {/* Sort */}
                <section className="mb-8">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-3">
                        Sort by
                    </h3>

                    <div className="grid grid-cols-2 gap-2">
                        {[
                            { value: "ID_ASC", label: "Number ↑" },
                            { value: "ID_DESC", label: "Number ↓" },
                            { value: "AZ", label: "A–Z" },
                            { value: "ZA", label: "Z–A" },
                        ].map(option => {
                            const selected = sort === option.value;

                            return (
                                <button
                                    key={option.value}
                                    onClick={() => setSort(option.value as SortOption)}
                                    className={`
                                        py-2 px-3 rounded-lg text-sm font-semibold
                                        transition
                                        ${selected
                                            ? "bg-black text-white"
                                            : "bg-gray-100 hover:bg-gray-200"}
                                    `}
                                >
                                    {option.label}
                                </button>
                            );
                        })}
                    </div>
                </section>


                {/* Types */}
                <section>
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-3">
                        Types
                    </h3>

                    <div className="flex flex-wrap gap-3">
                        {ALL_TYPES.map(type => {
                            const isSelected = types.includes(type);

                            return (
                                <button
                                    key={type}
                                    onClick={() => toggleType(type)}
                                    className="focus:outline-none"
                                    aria-pressed={isSelected}
                                >
                                    <TypeBadge
                                        type={type}
                                        className={`
                                            transition-all duration-200
                                            ${isSelected
                                                ? "ring-2 ring-black scale-110"
                                                : "opacity-70 hover:opacity-100"}
                                        `}
                                    />
                                </button>
                            );
                        })}
                    </div>
                </section>
            </aside>
        </div>
    );
};

export default FilterMenu;
