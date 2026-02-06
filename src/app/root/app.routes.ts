import { Routes } from '@angular/router';
import { PokemonList } from '../pokemon-list/pokemon-list';
import { PokemonDetails } from '../pokemon-details/pokemon-details';
import { getRandomPokemonId } from '../../utils/getRandomPokemonId';
import { NotFound } from '../not-found/not-found';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'pokemons',
  },
  {
    path: 'pokemons',
    component: PokemonList,
  },
  {
    path: 'pokemons/random',
    redirectTo: () => `pokemons/${getRandomPokemonId()}`,
  },
  {
    path: 'pokemons/:pokemonId',
    component: PokemonDetails,
  },
  {
    path: '**',
    component: NotFound,
  },
];
