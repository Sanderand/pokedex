import { Component, computed, inject } from '@angular/core';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap } from 'rxjs';
import { BackLink } from '../../common/back-link/back-link';
import { PokemonService } from '../../services/pokemon-service';
import { PokemonStore } from '../../stores/pokemon.store';
import { PokemonProfile } from './pokemon-profile/pokemon-profile';
import { PokemonStats } from './pokemon-stats/pokemon-stats';

@Component({
  selector: 'app-pokemon-details',
  imports: [BackLink, PokemonProfile, PokemonStats],
  templateUrl: './pokemon-details.html',
})
export class PokemonDetails {
  private activatedRoute = inject(ActivatedRoute);
  private store = inject(PokemonStore);
  private service = inject(PokemonService);

  pokemonId = toSignal(this.activatedRoute.params.pipe(map((params) => params['pokemonId'])));

  pokemon = computed(() => {
    const id = this.pokemonId();
    const cache = this.store.pokemonCache();
    return cache[id];
  });

  constructor() {
    // fetch Pokemon details when ID changes
    toObservable(this.pokemonId)
      .pipe(
        switchMap((id: string) => this.service.getDetails(id)),
        takeUntilDestroyed(),
      )
      .subscribe();
  }
}
