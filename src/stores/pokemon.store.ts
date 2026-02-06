import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';
import { PokeAPI } from 'pokeapi-types';
import { PokemonListResultDto } from '../services/types';

export type PokemonDetail = {
  id: string;
  name: string;
  data?: PokeAPI.Pokemon;
  isLoading: boolean;
  error: Error | null;
};

type PokemonState = {
  pokemonCache: Record<string, PokemonDetail>; // holds pokemon details

  listPokemonIds: string[]; // holds lists of pokemons in correct order
  offset: number;
  limit: number;
  hasMore: boolean;
  isLoadingList: boolean;
  listError: Error | null;
};

const initialState: PokemonState = {
  listPokemonIds: [],
  offset: 0,
  limit: 30,
  hasMore: true,
  isLoadingList: false,
  listError: null,
  pokemonCache: {},
};

export const PokemonStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store) => ({
    setLoadingList(isLoading: boolean) {
      patchState(store, { isLoadingList: isLoading });
    },

    appendPokemonList(pokemons: PokemonListResultDto[], hasMore: boolean) {
      patchState(store, (state) => {
        const updatedCache = { ...state.pokemonCache };

        // Add basic info to cache for new Pokemon
        pokemons.forEach((pokemon) => {
          if (!updatedCache[pokemon.id]) {
            updatedCache[pokemon.id] = {
              id: pokemon.id,
              name: pokemon.name,
              isLoading: false,
              error: null,
            };
          }
        });

        return {
          listPokemonIds: [...state.listPokemonIds, ...pokemons.map((r) => r.id)],
          offset: state.offset + pokemons.length,
          hasMore,
          isLoadingList: false,
          listError: null,
          pokemonCache: updatedCache,
        };
      });
    },

    setListError(error: Error) {
      patchState(store, { listError: error, isLoadingList: false });
    },

    setPokemonLoading(id: string) {
      patchState(store, (state) => ({
        pokemonCache: {
          ...state.pokemonCache,
          [id]: {
            ...state.pokemonCache[id],
            id,
            name: state.pokemonCache[id]?.name || '',
            isLoading: true,
            error: null,
          },
        },
      }));
    },

    setPokemonDetails(id: string, data: PokeAPI.Pokemon) {
      patchState(store, (state) => ({
        pokemonCache: {
          ...state.pokemonCache,
          [id]: {
            id,
            name: data.name,
            data,
            isLoading: false,
            error: null,
          },
        },
      }));
    },

    setPokemonError(id: string, error: Error) {
      patchState(store, (state) => ({
        pokemonCache: {
          ...state.pokemonCache,
          [id]: {
            ...state.pokemonCache[id],
            id,
            name: state.pokemonCache[id]?.name || '',
            error,
            isLoading: false,
          },
        },
      }));
    },
  })),
);
