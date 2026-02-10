// hooks/useGlobalSearch.ts
import { useEffect, useState } from "react";
import type { Pokemon } from "../interfaces/pokemon";

export const useGlobalSearch = (search: string) => {
    const [pokemon, setPokemon] = useState<Pokemon | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const term = search.trim().toLowerCase();

        if (!term) {
            setPokemon(null);
            return;
        }

        const controller = new AbortController();

        const fetchPokemon = async () => {
            setLoading(true);
            try {
                const res = await fetch(
                    `https://pokeapi.co/api/v2/pokemon/${term}`,
                    { signal: controller.signal }
                );

                if (!res.ok) {
                    setPokemon(null);
                    return;
                }

                const data = await res.json();

                setPokemon({
                    id: data.id,
                    name: data.name,
                    sprites: data.sprites,
                    types: data.types,
                    weight: data.weight,
                    height: data.height,
                });
            } catch (err) {
                if (!(err instanceof DOMException)) {
                    console.error(err);
                }
                setPokemon(null);
            } finally {
                setLoading(false);
            }
        };

        fetchPokemon();
        return () => controller.abort();
    }, [search]);

    return { pokemon, loading };
};
