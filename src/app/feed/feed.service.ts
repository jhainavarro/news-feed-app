import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Article, ArticlesGetResponse, ArticleApi } from './feed.model';
import { Source } from '../sources/sources.model';
import { publishReplay, refCount, switchMap, map } from 'rxjs/operators';
import * as Rx from 'rxjs';

@Injectable()
export class FeedService {

  private feedUrl = 'http://localhost:3000/feed';

  constructor(private http: HttpClient) {}

  get(source: Source, page = 1, pageSize = 10): Rx.Observable<Article[]> {
    let params = new HttpParams()
      .set('sources[]', source.id)
      .set('page', `${page}`)
      .set('pageSize', `${pageSize}`);

    return this.http.get(this.feedUrl, { params }).pipe(
      switchMap(({ status, articles}: ArticlesGetResponse) => {
        if (status === 'ok') {
          return Rx.of(articles);
        }

        throw new Error(`Unable to get article feed from ${source.name}`);
      }),
      map(articles => articles.map(this.toArticle)),
      publishReplay(1),
      refCount(),
    );
  }

  toArticle(item: ArticleApi): Article {
    if (!item) {
      return;
    }

    return {
      title: item.title,
      author: item.author ?? '',
      date: new Date(item.publishedAt),
      excerpt: item.content,
      imageSrc: item.urlToImage,
      link: item.url,
    };
  }

}
