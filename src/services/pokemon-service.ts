import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { PokeAPI } from 'pokeapi-types';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { PokemonStore } from '../stores/pokemon.store';
import { PokemonListDto } from './types';

@Injectable({
  providedIn: 'root',
})
export class PokemonService {
  private http = inject(HttpClient);
  private store = inject(PokemonStore);

  /** Load the next page of the Pokemon list */
  loadNextPage(): Observable<void> {
    const offset = this.store.offset();
    const limit = this.store.limit();
    const isLoading = this.store.isLoadingList();

    // abort when loading is in progress
    if (isLoading) {
      return of(undefined);
    }

    this.store.setLoadingList(true);

    return this.http
      .get<PokeAPI.NamedAPIResourceList>(
        `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`,
      )
      .pipe(
        map((response) => ({
          ...response,
          results: response.results.map((result) => {
            const id = getPokemonIdFromUrl(result.url);
            return { ...result, name: result.name, id };
          }),
        })),
        tap((response) => {
          const hasMore = response.next !== null;
          this.store.appendPokemonList(response.results, hasMore);
        }),
        map(() => undefined),
        catchError((error) => {
          this.store.setListError(error);
          return of(undefined);
        }),
      );
  }

  /** Get Pokemon details by ID */
  getDetails(id: string): Observable<PokeAPI.Pokemon | null> {
    const cache = this.store.pokemonCache();
    const pokemonDetail = cache[id];

    // return data, if available
    if (pokemonDetail?.data) {
      return of(pokemonDetail.data);
    }

    // abort when loading is in progress
    if (pokemonDetail?.isLoading) {
      return of(null);
    }

    this.store.setPokemonLoading(id);

    return this.http.get<PokeAPI.Pokemon>(`https://pokeapi.co/api/v2/pokemon/${id}`).pipe(
      tap((data) => this.store.setPokemonDetails(id, data)),
      catchError((error) => {
        this.store.setPokemonError(id, error);
        return of(null);
      }),
    );
  }
}

/**
 * @example
 * getPokemonIdFromUrl("https://pokeapi.co/api/v2/pokemon/4/") -> "4"
 */
function getPokemonIdFromUrl(url: string) {
  const match = url.match(/\/(\d+)\/?$/);

  if (match && match[1]) {
    return match[1];
  }

  throw new Error('could not determine pokemon id from url');
}
