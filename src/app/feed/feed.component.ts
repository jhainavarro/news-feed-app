import { Component, Input, Output, EventEmitter } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Article } from './feed.model';
import * as Rx from 'rxjs';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss'],
})
export class FeedComponent {

  @Input() articles$: Rx.Observable<Article[]>;
  @Input() pageIndex: number;
  @Input() pageSize = 10;
  @Input() totalResults: number;

  @Output() page = new EventEmitter<PageEvent>();

}
