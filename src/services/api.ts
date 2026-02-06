import type { Pokemon } from "../interfaces/pokemon";

// Comentário técnico: Função para extrair apenas os dados necessários, economizando espaço no LocalStorage
const simplifyPokemon = (data: any): Pokemon => ({
    id: data.id,
    name: data.name,
    sprites: {
        other: {
            'official-artwork': {
                front_default: data.sprites.other['official-artwork'].front_default
            }
        }
    },
    types: data.types,
    weight: data.weight,
    height: data.height
});

export const getPokemons = async (offset: number, limit: number = 20): Promise<Pokemon[]> => {
    const CACHE_KEY = 'pokedex_cache';
    const cachedData = localStorage.getItem(CACHE_KEY);
    let fullCache = cachedData ? JSON.parse(cachedData) : {};

    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);
    const data = await response.json();

    const pokemonDetails = await Promise.all(
        data.results.map(async (pokeRef: { name: string; url: string }) => {
            if (fullCache[pokeRef.name]) return fullCache[pokeRef.name];

            const res = await fetch(pokeRef.url);
            const detailData = await res.json();
        
            // Salvando apenas a versão simplificada no cache
            const simplified = simplifyPokemon(detailData);
            fullCache[pokeRef.name] = simplified;
            return simplified;
        })
    );

    try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(fullCache));
    } catch (e) {
        // Se o cache lotar, limpamos para não travar a aplicação
        console.warn("Cache cheio, limpando para novo uso.");
        localStorage.removeItem(CACHE_KEY);
    }

    return pokemonDetails;
};