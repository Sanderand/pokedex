import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'pokemonSprite',
  standalone: true,
})
export class PokemonSpritePipe implements PipeTransform {
  transform(pokemonId: string | number): string {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`;
  }
}
