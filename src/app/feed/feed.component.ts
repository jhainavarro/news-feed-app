import { Component, Input } from '@angular/core';
import { Article } from './feed.model';
import * as Rx from 'rxjs';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss']
})
export class FeedComponent {

  @Input() articles$: Rx.Observable<Article[]>;

}
