import { Injectable } from "@angular/core";
import { Article } from './feed.model';
import { Source } from '../sources/sources.model';
import { publishReplay, refCount, switchMap, map, catchError } from 'rxjs/operators';
import * as Rx from 'rxjs';
import * as Parser from 'rss-parser/dist/rss-parser.min';

@Injectable()
export class FeedService {

  private rssParser: Parser;

  constructor() {
    this.rssParser = new Parser({
      customFields: {
        item: [['media:thumbnail', 'thumbnail']],
      }
    });
  }

  getFeed(source: Source): Rx.Observable<Article[]> {
    // Some RSS feeds can't be fetched by the browser due to CORS issues
    // const url = `https://cors-anywhere.herokuapp.com/${source.url}`;

    // With browser extension enabled to bypass CORS
    const url = source.url;

    return Rx.from(this.rssParser.parseURL(url)).pipe(
      switchMap((rssFeed: Parser.Output) => Rx.of(rssFeed.items)),
      catchError(() => Rx.of([])),
      map(items => items.map(this.toArticle)),
      publishReplay(1),
      refCount(),
    );
  }

  toArticle(item: Parser.Item): Article {
    if (!item) {
      return;
    }

    return {
      title: item.title,
      author: item.creator ?? item.author,
      date: new Date(item.isoDate),
      excerpt: item.contentSnippet ?? item.content,
      imageSrc: item.thumbnail?.$?.url,
      link: item.link,
    };
  }

}
