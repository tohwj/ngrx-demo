import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { mergeMap, map, exhaustMap, concatMap } from 'rxjs/operators';
import { BooksService } from '@book-co/shared-services';
import { BooksPageActions, BooksApiActions } from '@book-co/books-page/actions';

@Injectable()
export class BooksApiEffects {
  constructor(private booksService: BooksService, private actions$: Actions) {}

  // Add property to create effect
  loadBooks$ = createEffect( () => {
    return this.actions$.pipe(
      ofType(BooksPageActions.enter),   // Listen to whenever 'enter' action is invoked
      exhaustMap( () => {                 // callback fn when that happens; and loads books from API
        return this.booksService
          .all()
          .pipe(
            map(books => BooksApiActions.booksLoaded({ books }))
        )
      })
    );
  });

  createBook$ = createEffect(() => 
    this.actions$.pipe(
      ofType(BooksPageActions.createBook),  // Listen to whenever user creates a book
      concatMap( (action) => 
        this.booksService                   // create booksService, which creates a book and maps a bookCreated action
          .create(action.book)
          .pipe(map((book) => BooksApiActions.bookCreated( { book })))
      )
    )
  )

  updateBook$ = createEffect(() => 
    this.actions$.pipe(
      ofType(BooksPageActions.updateBook),  // Listen to whenever user updates a book
      concatMap( (action) => 
        this.booksService                   // create bookUpdated, which creates a book and maps a bookCreated action
          .update(action.bookId, action.changes)
          .pipe(map((book) => BooksApiActions.bookUpdated( { book })))
      )
    )
  )

  deleteBook$ = createEffect(() => 
    this.actions$.pipe(
      ofType(BooksPageActions.deleteBook),
      mergeMap( (action) => 
        this.booksService
          .delete(action.bookId)
          .pipe(map((book) => BooksApiActions.bookDeleted( { bookId: action.bookId })))
      )
    )
  )
}

