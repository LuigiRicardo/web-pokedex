/**Normalizing the pokemon names for showdown sprites */
export function normalizePokemonName(name: string): string {
  return name
    .toLowerCase()
    .replace('nidoran-m', 'nidoranm')
    .replace('nidoran-f', 'nidoranf')
    .replace('mr-mime', 'mrmime')
    .replace('mime-jr', 'mimejr')
    .replace('farfetchd', 'farfetchd')
    .replace('sirfetchd', 'sirfetch’d')
    .replace('type-null', 'typenull')
    .replace('jangmo-o', 'jangmoo')
    .replace('hakamo-o', 'hakamoo')
    .replace('kommo-o', 'kommoo');
}
