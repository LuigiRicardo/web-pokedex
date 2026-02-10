import type { Pokemon } from "../interfaces/pokemon";

export const searchPokemon = async (
    query: string
): Promise<Pokemon | null> => {
    try {
    const res = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${query.toLowerCase()}`
    );

    if (!res.ok) return null;

    const data = await res.json();

    return {
        id: data.id,
        name: data.name,
        sprites: {
            other: {
                "official-artwork": {
                    front_default:
                        data.sprites.other["official-artwork"].front_default,
                },
            },
        },
        types: data.types,
        weight: data.weight,
        height: data.height,
        };
    } catch {
        return null;
    }
};
