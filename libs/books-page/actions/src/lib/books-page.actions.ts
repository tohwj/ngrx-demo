import { createAction, props } from '@ngrx/store';
import { BookRequiredProps } from '@book-co/shared-models';


/**
 * [User on Books Page] Enter
 * [User on Books Page] Select a Book
 * [User on Books Page] Clear Selected Book
 * [User on Books Page] Create Book
 * [User on Books Page] Update Book
 * [User on Books Page] Delete Book
 */

export const enter = createAction(
    '[User on Books Page] Enter'
);

export const selectBook = createAction(
    '[User on Books Page] Select a Book',
    props<{ bookId: string}>()
);

export const clearSelectedBook = createAction(
    '[User on Books Page] Clear Selected Book'
);

export const createBook = createAction(
    '[User on Books Page] Create Book',
    props<{ book: BookRequiredProps }>()
);

export const updateBook = createAction(
    '[User on Books Page] Update Book',
    props<{ bookId: string; changes: BookRequiredProps}>()
);

export const deleteBook = createAction(
    '[User on Books Page] Delete Book',
    props<{ bookId: string }>()
);












