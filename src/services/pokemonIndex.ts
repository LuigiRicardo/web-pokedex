export interface PokemonIndexItem {
    name: string;
    id: number;
}

let cache: PokemonIndexItem[] | null = null;

export const getPokemonIndex = async (): Promise<PokemonIndexItem[]> => {
    if (cache) return cache;

    const res = await fetch(
        "https://pokeapi.co/api/v2/pokemon?limit=2000"
    );
    const data = await res.json();

    cache = data.results.map((p: any) => {
        const id = Number(
            p.url.split("/").filter(Boolean).pop()
        );
        return { name: p.name, id };
    });

    return cache!;
};
