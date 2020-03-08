import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from './../../environments/environment';
import { Article, ArticlesGetResponse, ArticleApi, Feed } from './feed.model';
import { Source } from '../sources/sources.model';
import { publishReplay, refCount, switchMap, map, tap } from 'rxjs/operators';
import * as Rx from 'rxjs';

@Injectable()
export class FeedService {

  private feedUrl = `${environment.apiBaseUrl}/feed`;

  constructor(private http: HttpClient) {}

  get(source: Source, page = 1, pageSize = 10): Rx.Observable<Feed> {
    const params = new HttpParams()
      .set('sources[]', source.id)
      .set('page', `${page}`)
      .set('pageSize', `${pageSize}`);

    return this.http.get(this.feedUrl, { params }).pipe(
      switchMap(({ status, totalResults, articles}: ArticlesGetResponse) => {
        if (status === 'ok') {
          return Rx.of({ totalResults, articles });
        }

        throw new Error(`Unable to get article feed from ${source.name}`);
      }),
      map(({ totalResults, articles }) => ({
        totalResults,
        articles: articles.map(this.toArticle),
      })),
      publishReplay(1),
      refCount(),
    );
  }

  toArticle(item: ArticleApi): Article {
    if (!item) {
      return;
    }

    let imageSrc = item.urlToImage;

    // Handle API returning `"null"` string
    if (imageSrc === 'null' || imageSrc === 'undefined') {
      imageSrc = undefined;
    }

    return {
      title: item.title,
      author: item.author ?? '',
      date: new Date(item.publishedAt),
      excerpt: item.content,
      imageSrc,
      link: item.url,
    };
  }

}
