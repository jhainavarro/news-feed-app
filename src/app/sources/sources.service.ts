import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Source, SourceApi, SourcesGetResponse } from './sources.model';
import * as Rx from 'rxjs';
import { publishReplay, refCount, map, switchMap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable()
export class SourcesService {

  private sourcesUrl = `${environment.apiBaseUrl}/sources`;

  constructor(private http: HttpClient) {}

  get(): Rx.Observable<Source[]> {
    return this.http.get(this.sourcesUrl).pipe(
      switchMap(({ status, sources }: SourcesGetResponse) => {
        if (status === 'ok') {
          return Rx.of(sources);
        }

        throw new Error('Unable to get list of sources');
      }),
      map(sources => sources.map(this.toSource)),
      publishReplay(1),
      refCount(),
    );
  }

  private toSource(item: SourceApi): Source {
    return {
      id: item.id,
      name: item.name,
      url: item.url,
    };
  }

}
