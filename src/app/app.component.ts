import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FeedService } from './feed/feed.service';
import { Article } from './feed/feed.model';
import { SourcesService } from './sources/sources.service';
import { Source } from './sources/sources.model';
import * as Rx from 'rxjs';
import { switchMap, startWith, tap, filter, take, withLatestFrom } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {

  form: FormGroup;

  sources$: Rx.Observable<Source[]>;
  articles$: Rx.Observable<Article[]>;

  private defaultSelectedSourceSubscription: Rx.Subscription;

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

    this.articles$ = Rx.combineLatest([
      this.form.get('source').valueChanges,
      this.sources$,
    ]).pipe(
      filter(sourceId => sourceId !== undefined && sourceId !== null),
      switchMap(([sourceId, sources]: [string, Source[]]) => {
        const source = sources.find(s => s.id === sourceId);
        return this.feed.get(source);
      }),
    );

  }

  ngOnDestroy() {
    if (this.defaultSelectedSourceSubscription) {
      this.defaultSelectedSourceSubscription.unsubscribe();
    }
  }

}
