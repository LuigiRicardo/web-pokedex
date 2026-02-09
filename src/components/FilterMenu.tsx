import React from 'react';
import { useEffect } from 'react';

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
                className="absolute right-0 top-0 h-full w-full max-w-sm bg-white p-4 overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >

                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-black">Filters</h2>
                    <button
                        onClick={onClose}
                        aria-label="Close filters"
                        className="p-2 rounded-full bg-gray-100"
                    >
                        ✕
                    </button>
                </div>

                {/* Generation */}
                <section className="mb-6">
                    <h3 className="font-bold mb-2">Generation</h3>
                    <div className="flex flex-col gap-2">
                        {GENERATIONS.map(gen => (
                                <label key={gen.key} className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="generation"
                                        checked={generation === gen.key}
                                        onChange={() => setGeneration(gen.key)}
                                    />
                                    {gen.label}
                                </label>
                        ))}
                    </div>
                </section>

                {/* Sort */}
                <section className="mb-6">
                    <h3 className="font-bold mb-2">Sort by</h3>
                    <select
                        value={sort}
                        onChange={e => setSort(e.target.value as SortOption)}
                        className="w-full border p-2 rounded"
                    >
                        <option value="ID_ASC">Number ↑</option>
                        <option value="ID_DESC">Number ↓</option>
                        <option value="AZ">A–Z</option>
                        <option value="ZA">Z–A</option>
                    </select>
                </section>

                {/* Types */}
                <section>
                    <h3 className="font-bold mb-2">Types</h3>
                    <div className="flex flex-wrap gap-2">
                        {ALL_TYPES.map(type => (
                            <button
                                key={type}
                                onClick={() => toggleType(type)}
                                aria-pressed={types.includes(type)}
                                className={`px-3 py-1 rounded-full text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-600
                                    ${types.includes(type)
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-200 text-gray-800'
                                    }`}
                            >
                            {type}
                            </button>
                        ))}
                    </div>
                </section>
            </aside>
        </div>
    );
};

export default FilterMenu;
