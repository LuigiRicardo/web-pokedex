import type { Pokemon } from "../interfaces/pokemon";

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

export const getPokemonsByGeneration = async (generationId: number): Promise<Pokemon[]> => {
    const res = await fetch(`https://pokeapi.co/api/v2/generation/${generationId}`);
    const data = await res.json();

    const pokemons = await Promise.all(
        data.pokemon_species.map(async (species: any) => {
            const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${species.name}`);
            const detail = await res.json();
            return simplifyPokemon(detail);
        })
    );

    return pokemons.sort((a, b) => a.id - b.id);
};

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
            const simplified = simplifyPokemon(detailData);
            fullCache[pokeRef.name] = simplified;
            return simplified;
        })
    );

    try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(fullCache));
    } catch (e) {
        console.warn("Cache cheio, limpando para novo uso.");
        localStorage.removeItem(CACHE_KEY);
    }

    return pokemonDetails;
};

export const getPokemonByNameOrId = async (
    query: string
): Promise<Pokemon | null> => {
    try {
        const res = await fetch(
            `https://pokeapi.co/api/v2/pokemon/${query.toLowerCase()}`
        );

        if (!res.ok) return null;

        const data = await res.json();
        return simplifyPokemon(data);
    } catch {
        return null;
    }
};