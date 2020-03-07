import { Injectable } from "@angular/core";
import { Article, Source } from './feed.model';
import * as Rx from 'rxjs';
import { publishReplay, refCount, switchMap, tap, map, catchError } from 'rxjs/operators';
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

  getSources(): Rx.Observable<Source[]> {
    return Rx.of([
      {
        id: 1,
        name: 'BuzzFeed',
        url: 'https://www.buzzfeed.com/world.xml',
      },
      {
        id: 2,
        name: 'Reddit',
        url: 'https://www.reddit.com/r/worldnews/.rss',
      },
      {
        id: 3,
        name: 'BBC',
        url: 'http://feeds.bbci.co.uk/news/world/rss.xml',
      },
      {
        id: 4,
        name: 'Vox',
        url: 'https://www.vox.com/rss/world/index.xml',
      },
      {
        id: 5,
        name: 'CNN',
        url: 'http://rss.cnn.com/rss/edition_world.rss',
      },
    ]).pipe(
      publishReplay(1),
      refCount(),
    );
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
