export interface PokemonType {
    type: {
        name: string;
    };
    }

    export interface Pokemon {
    id: number;
    name: string;
    sprites: {
        other: {
        'official-artwork': {
            front_default: string;  
        };
        };
    };
    types: PokemonType[];
    weight: number; 
    height: number;
}