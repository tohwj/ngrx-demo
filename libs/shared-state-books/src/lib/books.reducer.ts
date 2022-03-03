import { createReducer, on, Action, createSelector } from '@ngrx/store';
import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { BookModel, calculateBooksGrossEarnings } from '@book-co/shared-models';
import { BooksPageActions, BooksApiActions } from '@book-co/books-page/actions';

const createBook = (books: BookModel[], book: BookModel) => [...books, book];
const updateBook = (books: BookModel[], changes: BookModel) =>
  books.map((book) => {
    return book.id === changes.id ? Object.assign({}, book, changes) : book;
  });
const deleteBook = (books: BookModel[], bookId: string) =>
  books.filter((book) => bookId !== book.id);


export interface State {
  collection: BookModel[];
  activeBookId: string | null;
}

export const initialState: State = {
  collection: [],
  activeBookId: null,
};

export const reducer = createReducer(
  initialState,
  on(BooksPageActions.clearSelectedBook, BooksPageActions.enter,
    (state) => {
      return {
        ...state,
        activeBookId: null,
      };
  }),
  on(BooksPageActions.selectBook, 
    (state, action) => {
      return {
        ...state,
        activeBookId: action.bookId,
      };
  }),
  on(BooksApiActions.booksLoaded,   // When books are loaded, save them in the collection
    (state, action) => {
      return {
        ...state,
        collection: action.books,
      };
    }),
  on(BooksApiActions.bookCreated,   // When a new book is created, use createBook function to add newly created book into the collection
    (state, action) => {
      return {
        collection: createBook(state.collection, action.book),
        activeBookId: null,
      };
    }),
  on(BooksApiActions.bookUpdated,   // When a new book is updated, use updateBook function to update book in the collection
    (state, action) => {
      return {
        collection: updateBook(state.collection, action.book),
        activeBookId: null,
      };
    }),
  on(BooksApiActions.bookDeleted,   // When a new book is delete, use deleteBook function and delete from our collection
    (state, action) => {
      return {
        ...state,
        collection: deleteBook(state.collection, action.bookId)
      };
    }),
);



/**
 * These are local selectors
 */
export const selectAll = (state: State) => state.collection;
export const selectActiveBookId = (state: State) => state.activeBookId;

// How we would do it without NgRx
export const selectActiveBook_bad_performance = (state: State) => {
  const books = selectAll(state);
  const activeBookId = selectActiveBookId(state);

  return books.find(book => book.id === activeBookId) || null;
}

// createSelector helper function has better performance
export const selectActiveBook = createSelector(
  selectAll,
  selectActiveBookId,
  (books, activeBookId) => {
    return books.find(book => book.id === activeBookId) || null;
  }
)

export const selectEarningsTotal_unsimplified = createSelector(
  selectAll,
  (books) => {
    return calculateBooksGrossEarnings(books);
  }
)

// We can simplify lines 95 & 96 by just passing the function name in as a projector function 
export const selectEarningsTotal = createSelector(
  selectAll,
  calculateBooksGrossEarnings // this is equivalent to (books) => { return calculcateBooksGrossEarnings(books) }
)