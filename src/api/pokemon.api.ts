// src/api/pokemon.api.ts

/**
 * Responsável exclusivamente por comunicação com a PokéAPI.
 * NÃO deve conter lógica de transformação.
 */

export const fetchPokemonByQuery = async (query: string) => {
    const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${query}`
    );

    if (!response.ok) {
        throw new Error("Pokemon not found");
    }

    return response.json();
};

export const fetchPokemonIndex = async () => {
    const response = await fetch(
        "https://pokeapi.co/api/v2/pokemon?limit=2000"
    );

    if (!response.ok) {
        throw new Error("Failed to fetch Pokemon index");
    }

    return response.json();
};
