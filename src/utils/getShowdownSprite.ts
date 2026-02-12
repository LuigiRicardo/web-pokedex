/**Call external animated sprites */

import { normalizePokemonName } from './normalizePokemonName';

const SHOWDOWN_BASE = 'https://play.pokemonshowdown.com/sprites/ani';

export function getShowdownSprite(name: string) {
  const normalizedName = normalizePokemonName(name);

  return `${SHOWDOWN_BASE}/${normalizedName}.gif`;
}
