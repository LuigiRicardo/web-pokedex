import React from 'react';
import { useEffect, useState } from 'react';
import { getPokemons } from '../services/api';
import type { Pokemon } from '../interfaces/pokemon';

const GENERATIONS = {
    gen1: { offset: 0, limit: 151 },
    gen2: { offset: 151, limit: 100 },
    gen3: { offset: 251, limit: 135 },
    gen4: { offset: 386, limit: 107 },
    gen5: { offset: 493, limit: 156 },
    gen6: { offset: 649, limit: 72 },
    gen7: { offset: 721, limit: 88 },
    gen8: { offset: 809, limit: 96 },
    gen9: { offset: 905, limit: 120 },
} as const;

export type SortOption = 'ID_ASC' | 'ID_DESC' | 'AZ' | 'ZA';

export type Generation =
    | 'gen1' | 'gen2' | 'gen3'
    | 'gen4' | 'gen5' | 'gen6'
    | 'gen7' | 'gen8' | 'gen9';

const PAGE_SIZE = 20;
interface UsePokemonsParams {
    generation: Generation;
    search: string;
    types: string[];
    sort: SortOption;
}
export const usePokemons = ({
    generation,
    search,
    types,
    sort,
}: UsePokemonsParams) => {
    const [pokemons, setPokemons] = useState<Pokemon[]>([]);
    const filteredPokemons = React.useMemo(() => {
        let result = [...pokemons];

        if (search.trim()) {
            const term = search.toLowerCase();
            result = result.filter(p =>
                p.name.toLowerCase().includes(term) ||
                p.id.toString().includes(term)
            );
        }

        if (types.length > 0) {
            result = result.filter(pokemon =>
                types.every(t =>
                    pokemon.types.some(pt => pt.type.name === t)
                )
            );
        }

        switch (sort) {
            case 'ID_ASC':
                result.sort((a, b) => a.id - b.id);
                break;
            case 'ID_DESC':
                result.sort((a, b) => b.id - a.id);
                break;
            case 'AZ':
                result.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'ZA':
                result.sort((a, b) => b.name.localeCompare(a.name));
                break;
        }

        return result;
    }, [pokemons, search, types, sort]);

    const [loadedCount, setLoadedCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const { offset: baseOffset, limit: generationLimit } =
        GENERATIONS[generation];

    useEffect(() => {
        setPokemons([]);
        setHasMore(true);
    }, [generation, sort]);

    useEffect(() => {
        const loadPokemons = async () => {
            if (loading || !hasMore) return;

            setLoading(true);

            try {
                const remaining = generationLimit - loadedCount;
                const limit = Math.min(PAGE_SIZE, remaining);
                const isDescending = sort === 'ID_DESC';

                const realOffset = isDescending
                    ? baseOffset + generationLimit - loadedCount - limit
                    : baseOffset + loadedCount;

                if (limit <= 0) {
                    setHasMore(false);
                    return;
                }

                const newPokemons = await getPokemons(realOffset, limit);

                setPokemons(prev => {
                    const map = new Map<number, Pokemon>();
                    [...prev, ...newPokemons].forEach(p => map.set(p.id, p));
                    return Array.from(map.values()).sort((a, b) => a.id - b.id);
                });

                if (loadedCount + limit >= generationLimit) {
                    setHasMore(false);
                }
            } catch (err) {
                console.error('Erro ao buscar Pokémons:', err);
            } finally {
                setLoading(false);
            }
        };

        loadPokemons();
    }, [loadedCount, generation, sort]);

    const fetchNextPage = () => {
        if (!loading && hasMore) {
            setLoadedCount(prev => prev + PAGE_SIZE);
        }
    };

    return {
        pokemons: filteredPokemons,
        loading,
        hasMore,
        fetchNextPage,
    };
};