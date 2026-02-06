import { Component, input } from '@angular/core';
import { PokeAPI } from 'pokeapi-types';

@Component({
  selector: 'app-pokemon-stats',
  templateUrl: './pokemon-stats.html',
})
export class PokemonStats {
  stats = input<PokeAPI.PokemonStat[]>();
  isLoading = input<boolean>(false);
}
