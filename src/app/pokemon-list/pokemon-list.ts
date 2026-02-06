import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  afterNextRender,
  computed,
  inject,
  viewChild,
} from '@angular/core';
import { PokemonService } from '../../services/pokemon-service';
import { PokemonStore } from '../../stores/pokemon.store';
import { PokemonListTile } from './pokemon-list-tile/pokemon-list-tile';

// start loading 200px before listBottom enters the viewport
const LOAD_MORE_DATA_OFFSET_BOTTOM = '200px';

@Component({
  selector: 'app-pokemon-list',
  imports: [PokemonListTile],
  templateUrl: './pokemon-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PokemonList implements OnInit, OnDestroy {
  private listBottom = viewChild<ElementRef<HTMLDivElement>>('listBottom');
  private intersectionObserver?: IntersectionObserver;

  private pokemonService = inject(PokemonService);
  private store = inject(PokemonStore);

  listPokemonIds = this.store.listPokemonIds;
  pokemonCache = this.store.pokemonCache;
  isLoadingList = this.store.isLoadingList;
  hasMore = this.store.hasMore;

  // Combine list IDs with cached details
  pokemons = computed(() => {
    const ids = this.listPokemonIds();
    const cache = this.pokemonCache();

    return ids.map((id) => ({
      id,
      name: cache[id]?.name || '',
      isLoading: cache[id]?.isLoading || false,
    }));
  });

  constructor() {
    this.intializeScrollObserver();
  }

  ngOnInit() {
    if (this.listPokemonIds().length === 0) {
      this.loadMore();
    }
  }

  ngOnDestroy() {
    this.intersectionObserver?.disconnect();
  }

  private intializeScrollObserver() {
    afterNextRender(() => this.setupInfiniteScroll());
  }

  private setupInfiniteScroll() {
    const listBottomEl = this.listBottom()?.nativeElement;

    if (!listBottomEl) return;

    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && this.hasMore() && !this.isLoadingList()) {
          this.loadMore();
        }
      },
      { rootMargin: LOAD_MORE_DATA_OFFSET_BOTTOM },
    );

    this.intersectionObserver.observe(listBottomEl);
  }

  private loadMore() {
    this.pokemonService.loadNextPage().subscribe();
  }
}
