import { useEffect, useState } from "react";
import type { Pokemon } from "../interfaces/pokemon";
import { getPokemonIndex } from "../services/pokemonIndex";
import { getPokemonByNameOrId } from "../services/api";

export const useGlobalSearch = (search: string) => {
    const [results, setResults] = useState<Pokemon[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const term = search.trim().toLowerCase();

        if (!term) {
            setResults([]);
            return;
        }

        const controller = new AbortController();

        const fetchResults = async () => {
            setLoading(true);

            try {
                // 1️⃣ pega índice completo
                const index = await getPokemonIndex();

                // 2️⃣ filtra localmente (PARCIAL!)
                const matches = index.filter(p =>
                    p.name.includes(term) ||
                    p.id.toString().includes(term)
                ).slice(0, 20); // limita para evitar spam de requests

                // 3️⃣ busca detalhes reais
                const detailed = await Promise.all(
                    matches.map(p =>
                        getPokemonByNameOrId(p.name)
                    )
                );

                setResults(
                    detailed.filter(Boolean) as Pokemon[]
                );
            } catch (err) {
                if (!(err instanceof DOMException)) {
                    console.error(err);
                }
                setResults([]);
            } finally {
                setLoading(false);
            }
        };

        fetchResults();

        return () => controller.abort();
    }, [search]);

    return { results, loading };
};
