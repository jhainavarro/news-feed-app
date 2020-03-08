import { Component, Input, Output, EventEmitter } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Article } from './feed.model';
import * as Rx from 'rxjs';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss']
})
export class FeedComponent {

  @Input() articles$: Rx.Observable<Article[]>;
  @Input() pageSize: number = 10;
  @Input() totalItems: number;

  @Output() page = new EventEmitter<PageEvent>();

}
