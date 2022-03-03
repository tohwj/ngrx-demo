import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { BooksPageActions, BooksApiActions } from '@book-co/books-page/actions';
import {
  BookModel,
  BookRequiredProps,
  calculateBooksGrossEarnings,
} from '@book-co/shared-models';
import { selectActiveBook, selectAllBooks, selectBooksEarningsTotal } from '@book-co/shared-state-books';
import { BooksService } from '@book-co/shared-services';

@Component({
  selector: 'bco-books-page',
  templateUrl: './books-page.component.html',
  styleUrls: ['./books-page.component.scss'],
})
export class BooksPageComponent implements OnInit {

  // Make variables observables and denote with $, $ postfix demotes streams or observables
  books$: Observable<BookModel[]>;
  currentBook$: Observable<BookModel | null>;
  total$: Observable<number>;

  constructor(private store: Store) {

    // Initialise variables in constructors using selectors created
    this.books$ = store.select(selectAllBooks);
    this.currentBook$ = store.select(selectActiveBook);
    this.total$ = store.select(selectBooksEarningsTotal);
    // Now this component is not maintaining any local state, it is retrieving state from the store
  }

  ngOnInit() {
    this.removeSelectedBook();

    // On init, user enters page
    this.store.dispatch(BooksPageActions.enter())
  }
 

  onSelect(book: BookModel) {
    // Dispatch select book action
    this.store.dispatch(BooksPageActions.selectBook({
      bookId: book.id
    } ))

  }

  onCancel() {
    this.removeSelectedBook();
  }

  removeSelectedBook() {
    // Dispatch clear selected book action
    this.store.dispatch(BooksPageActions.clearSelectedBook())

  }

  onSave(book: BookRequiredProps | BookModel) {
    if ('id' in book) {
      this.updateBook(book);
    } else {
      this.saveBook(book);
    }
  }

  saveBook(bookProps: BookRequiredProps) {
    // Dispatch create book action
    this.store.dispatch(BooksPageActions.createBook({
      book: bookProps
    }))
  }

  updateBook(book: BookModel) {
    // Dispatch update book action
    this.store.dispatch(BooksPageActions.updateBook({
      bookId: book.id,
      changes: book
    }))
  }

  onDelete(book: BookModel) {
    // Dispatch delete book action
    this.store.dispatch(BooksPageActions.deleteBook({
      bookId: book.id
    }))
  }
}
