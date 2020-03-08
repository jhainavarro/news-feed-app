import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { FeedService } from './feed/feed.service';
import { Article } from './feed/feed.model';
import { SourcesService } from './sources/sources.service';
import { Source } from './sources/sources.model';
import * as Rx from 'rxjs';
import { switchMap, filter, take, tap, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {

  readonly PAGE_SIZE = 10;

  form: FormGroup;

  articles$: Rx.Observable<Article[]>;
  sources$: Rx.Observable<Source[]>;
  page$: Rx.Observable<number>;

  private defaultSelectedSourceSubscription: Rx.Subscription;
  private pageIndexSubject: Rx.BehaviorSubject<number>;

  constructor(
    private fb: FormBuilder,
    private feed: FeedService,
    private sources: SourcesService,
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      source: [],
    });

    this.sources$ = this.sources.get();

    this.defaultSelectedSourceSubscription = this.sources$
      .pipe(take(1))
      .subscribe(
        sources => {
          this.form.get('source').setValue(sources[0].id);
        },
      );

    this.pageIndexSubject = new Rx.BehaviorSubject(0);

    this.page$ = this.pageIndexSubject.asObservable();

    const selectedSource$ = Rx.combineLatest([
      this.form.get('source').valueChanges,
      this.sources$,
    ]).pipe(
      filter(sourceId => sourceId !== undefined && sourceId !== null),
      switchMap(([sourceId, sources]: [string, Source[]]) =>
          Rx.of(sources.find(s => s.id === sourceId)) ),
      tap(() => {
        this.pageIndexSubject.next(0);
      }),
    );

    this.articles$ = Rx.combineLatest([
      selectedSource$,
      this.page$,
    ]).pipe(
      distinctUntilChanged(this.isSameFeedToFetch),
      switchMap(([source, page]) =>
        this.feed.get(source, (page + 1), this.PAGE_SIZE)),
    );

  }

  ngOnDestroy() {
    if (this.defaultSelectedSourceSubscription) {
      this.defaultSelectedSourceSubscription.unsubscribe();
    }
  }

  handlePageChange(event: PageEvent) {
    this.pageIndexSubject.next(event.pageIndex);
  }

  private isSameFeedToFetch(prev: [Source, number], curr: [Source, number]) {
    const [ prevSource, prevPage ] = prev;
    const [ currSource, currPage] = curr;
    return prevSource.id === currSource.id && prevPage === currPage;
  }

}
