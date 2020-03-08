import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { FeedService } from './feed/feed.service';
import { Article } from './feed/feed.model';
import { SourcesService } from './sources/sources.service';
import { Source } from './sources/sources.model';
import * as Rx from 'rxjs';
import { switchMap, filter, take, map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {

  readonly PAGE_SIZE = 10;

  form: FormGroup;

  sources$: Rx.Observable<Source[]>;
  articles$: Rx.Observable<Article[]>;

  private defaultSelectedSourceSubscription: Rx.Subscription;
  private pageIndexSubject: Rx.BehaviorSubject<number>;
  private page$: Rx.Observable<number>;

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

    const selectedSource$ = Rx.combineLatest([
      this.form.get('source').valueChanges,
      this.sources$,
    ]).pipe(
      filter(sourceId => sourceId !== undefined && sourceId !== null),
      switchMap(([sourceId, sources]: [string, Source[]]) =>
          Rx.of(sources.find(s => s.id === sourceId)) ),
    );

    this.pageIndexSubject = new Rx.BehaviorSubject(0);

    this.page$ = this.pageIndexSubject.asObservable().pipe(
      map(index => (index + 1)),
    );

    this.articles$ = Rx.combineLatest([
      selectedSource$,
      this.page$,
    ]).pipe(
      switchMap(([source, page]) => this.feed.get(source, page, this.PAGE_SIZE)),
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

}
