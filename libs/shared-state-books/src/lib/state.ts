import { NgModule } from '@angular/core';
import {
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
  MetaReducer,
  StoreModule,
} from '@ngrx/store';
import * as fromBooks from './books.reducer';

export const FEATURE_KEY = 'shared-books';

/**
 * State Shape
 **/
export interface State {
  books: fromBooks.State
}

export const reducers: ActionReducerMap<State> = {
  books: fromBooks.reducer,
};

export const metaReducers: MetaReducer<State>[] = [];

/**
 * Module
 **/
@NgModule({
  // Register all the reducers that belonged to this feature module: .forFeature(feature_name, reducers)
  imports: [StoreModule.forFeature(FEATURE_KEY, reducers, { metaReducers })],
})
export class SharedStateBooksModule {}

/**
 * Feature Selector
 **/
export const selectSharedBooksState = createFeatureSelector<State>(FEATURE_KEY);

/**
 * Books Selectors
 * # These are Global Selectors #
 */
export const selectBooksState = createSelector(
  selectSharedBooksState,
  (sharedBooksFeatureState) => sharedBooksFeatureState.books
);
export const selectAllBooks = createSelector(
  selectBooksState,      // get book state
  fromBooks.selectAll   // using book state, (booksState) => fromBooks.selectAll(booksState) 
);
export const selectActiveBook = createSelector(
  selectBooksState,
  fromBooks.selectActiveBook
);
export const selectBooksEarningsTotal = createSelector(
  selectBooksState,
  fromBooks.selectEarningsTotal
);