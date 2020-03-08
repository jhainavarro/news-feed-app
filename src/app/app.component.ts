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

    this.articles$ = this.form.get('source').valueChanges.pipe(
      startWith(this.form.get('source').value),
      filter(sourceId => sourceId !== undefined && sourceId !== null),
      withLatestFrom(this.sources$),
      switchMap(([sourceId, sources]: [string, Source[]]) => {
        const source = sources.find(s => s.id === sourceId);
        return this.feed.getFeed(source);
      }),
    );

  }

  ngOnDestroy() {
    if (this.defaultSelectedSourceSubscription) {
      this.defaultSelectedSourceSubscription.unsubscribe();
    }
  }

}
