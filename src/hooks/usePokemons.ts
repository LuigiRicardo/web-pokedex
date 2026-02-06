import { useState, useEffect } from 'react';
import { getPokemons } from '../services/api';
import type { Pokemon } from '../interfaces/pokemon';

export const usePokemons = () => {
    const [pokemons, setPokemons] = useState<Pokemon[]>([]);
    const [offset, setOffset] = useState(0);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        const loadMore = async () => {
            if (loading || !hasMore) return; 

            setLoading(true);
            try {
            const newData = await getPokemons(offset, 20);
            
            if (newData.length > 0) {
                setPokemons(prev => {
                    const combined = [...prev, ...newData];
                    // Ordenamos por ID para garantir que, mesmo com delay na rede, a lista fique correta
                    return combined
                        .filter((p, idx, self) => self.findIndex(t => t.id === p.id) === idx)
                        .sort((a, b) => a.id - b.id);
                });
            }

            // Se chegarmos perto do 151, paramos
            if (offset + 20 >= 151) {
                setHasMore(false);
            }
        } catch (error) {
            console.error("Erro ao buscar Pokémons:", error);
        } finally {
            setLoading(false);
        }
    };

        loadMore();
    }, [offset]);

    const fetchNextPage = () => {
        // Só avança se não estiver carregando e se ainda houver pokémons na geração
        if (!loading && hasMore) {
            setOffset(prev => prev + 20);
        }
    };

    return { pokemons, loading, fetchNextPage, hasMore };
};