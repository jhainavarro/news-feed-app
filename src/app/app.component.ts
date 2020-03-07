import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FeedService } from './feed/feed.service';
import { Article, Source } from './feed/feed.model';
import * as Rx from 'rxjs';
import { switchMap, startWith, tap, filter, take } from 'rxjs/operators';

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
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      source: [],
    });

    this.sources$ = this.feed.getSources();

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
      switchMap(sourceId => this.feed.getFeed(sourceId)),
    );

  }

  ngOnDestroy() {
    if (this.defaultSelectedSourceSubscription) {
      this.defaultSelectedSourceSubscription.unsubscribe();
    }
  }

}
