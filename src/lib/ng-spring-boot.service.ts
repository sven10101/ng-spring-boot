import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Pageable } from './models/pageable';
import { Observable, of, throwError } from 'rxjs';
import { Page } from './models/page';
import { PostResponse } from './models/post-response';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NgSpringBootService {

  constructor(private http: HttpClient) {
  }

  getPage<T>(url: string, pageable?: Pageable, options?: {
    headers?: HttpHeaders | {
      [header: string]: string | string[];
    };
    observe?: 'body';
    params?: HttpParams | {
      [param: string]: string | string[];
    };
    reportProgress?: boolean;
    responseType?: 'json';
    withCredentials?: boolean;
  }): Observable<Page<T>> {
    const params = this.urlParams(pageable, url.includes('?'));
    return this.http.get<Page<T>>(url + params, options);
  }

  postResource(url: string, resource: any, options?: {
    headers?: HttpHeaders | {
      [header: string]: string | string[];
    };
    observe: 'response';
    params?: HttpParams | {
      [param: string]: string | string[];
    };
    reportProgress?: boolean;
    responseType?: 'json';
    withCredentials?: boolean;
  }): Observable<PostResponse> {
    return this.http.post(url, resource, options ? options : {observe: 'response'}).pipe(
      switchMap(r => {
        if (r.status === 201) {
          const location = r.headers.get('location');
          console.log(location);
          return of({location: location, id: location && location.length > 0 ? location.substr(location.lastIndexOf('/') + 1) : ''});
        } else {
          return throwError({status: r.status, text: r.statusText});
        }
      })
    );
  }

  private urlParams(p: Pageable, append: boolean): string {
    let params = '';
    if (p) {
      if (p.page) {
        params += 'page=' + p.page + '&';
      }
      if (p.size) {
        params += 'size=' + p.size + '&';
      }
      if (p.sort) {
        params += 'sort=' + p.sort;
        if (p.sortDir) {
          params += ';' + p.sortDir;
        }
        params += '&';
      }
      if (p.filter) {
        params += 'filter=' + p.filter + '&';
      }
    }
    return params.length === 0 ? '' : (append ? '&' : '?') + params.substr(0, params.length - 1);
  }

}
