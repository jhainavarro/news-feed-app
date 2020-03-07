import { Injectable } from "@angular/core";
import { Article, Source } from './feed.model';
import * as Rx from 'rxjs';
import { publishReplay, refCount } from 'rxjs/operators';

@Injectable()
export class FeedService {

  getSources(): Rx.Observable<Source[]> {
    return Rx.of([
      {
        id: 1,
        name: 'Reddit',
        url: 'https://www.reddit.com/r/worldnews/.rss',
      },
      {
        id: 2,
        name: 'BuzzFeed',
        url: 'https://www.buzzfeed.com/world.xml',
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
        name: 'Reuters',
        url: 'http://feeds.reuters.com/Reuters/worldNews',
      },
    ]).pipe(
      publishReplay(1),
      refCount(),
    );
  }

  getFeed(source: Source): Rx.Observable<Article[]> {
    return Rx.of([
      {
        title: 'Testing',
        author: 'Jhai Navarro',
        date: new Date('March 07 2020'),
        excerpt: 'Lorem ipsum dolor sit amet',
        imageSrc: 'https://picsum.photos/200',
        link: 'https://www.jhainavarro.com',
      },
      {
        title: 'Another one',
        author: 'Andrew Lanuza',
        date: new Date('March 05 2020'),
        excerpt: 'Lorem ipsum dolor sit amet',
        imageSrc: 'https://picsum.photos/300',
        link: 'https://www.jhainavarro.com',
      },
    ]).pipe(
      publishReplay(1),
      refCount(),
    );
  }

}
