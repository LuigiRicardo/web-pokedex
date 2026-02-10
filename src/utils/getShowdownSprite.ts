export function getShowdownSprite(name: string) {
    return `https://play.pokemonshowdown.com/sprites/ani/${name
        .toLowerCase()
        .replace('♀', 'f')
        .replace('♂', 'm')
    }.gif`;
}
