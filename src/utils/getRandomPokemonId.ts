const NUMBER_OF_POKEMON = 1_025; // as of DLC as of 2024

export function getRandomPokemonId() {
  return Math.floor(Math.random() * NUMBER_OF_POKEMON) + 1;
}
