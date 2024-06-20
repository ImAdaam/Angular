import { Injectable } from '@angular/core';
import { Subject, Observable, timer } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private searchTerms = new Subject<string>();
  searchTerms$ = this.searchTerms.asObservable();

  constructor() {}

  search(terms: string): void {
    this.searchTerms.next(terms);
  }

  getFilteredTerms(debounceMs = 300): Observable<string> {
    return this.searchTerms$.pipe(
      debounceTime(debounceMs),
      distinctUntilChanged()
    );
  }
}