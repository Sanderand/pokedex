import { NgOptimizedImage } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PokemonSpritePipe } from '../../../pipes/pokemon-sprite.pipe';

@Component({
  selector: 'app-pokemon-list-tile',
  imports: [RouterLink, NgOptimizedImage, PokemonSpritePipe],
  templateUrl: './pokemon-list-tile.html',
})
export class PokemonListTile {
  id = input.required<string>();
  name = input.required<string>();
  isLoading = input<boolean>(false);
}
