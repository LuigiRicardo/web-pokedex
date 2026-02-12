import type { Pokemon, PokemonType } from "../interfaces/pokemon";
import type { PokemonIndexItem } from "../interfaces/pokemon";


/**
 * Transforma resposta bruta da API em modelo interno Pokemon
 */
export const mapPokemon = (data: any): Pokemon => {
    return {
        id: data.id,
        name: data.name,
        types: data.types as PokemonType[],
        weight: data.weight,
        height: data.height,
    };
};

/**
 * Extrai ID numérico da URL da PokéAPI
 */
const extractIdFromUrl = (url: string): number => {
    const segments = url.split("/").filter(Boolean);
    return Number(segments[segments.length - 1]);
};

/**
 * Transforma resposta do índice da API
 */
export const mapPokemonIndex = (data: any): PokemonIndexItem[] => {
    return data.results.map((pokemon: any) => ({
        name: pokemon.name,
        id: extractIdFromUrl(pokemon.url),
    }));
};
