import { PokeAPI } from 'pokeapi-types';

export type PokemonListDto = Omit<PokeAPI.NamedAPIResourceList, 'results'> & {
  results: Array<PokemonListResultDto>;
};

export type PokemonListResultDto = PokeAPI.NamedAPIResource & { id: string };
