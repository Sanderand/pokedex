import { NgOptimizedImage } from '@angular/common';
import { Component, input } from '@angular/core';
import { PokeAPI } from 'pokeapi-types';
import { PokemonSpritePipe } from '../../../pipes/pokemon-sprite.pipe';

@Component({
  selector: 'app-pokemon-profile',
  imports: [NgOptimizedImage, PokemonSpritePipe],
  templateUrl: './pokemon-profile.html',
})
export class PokemonProfile {
  pokemon = input<PokeAPI.Pokemon>();
  isLoading = input<boolean>(false);
}
