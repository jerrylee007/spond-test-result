import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

//export const CLIENT_API = 'http://localhost:8000/'
export const CLIENT_API = 'http://118.24.41.169:8000/'

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({ providedIn: 'root' })
export class ResultsService {
  results: any[]
  image: any

  constructor(
    private http: HttpClient) {
  }

  getAllResults(client: string): Observable<any[]> {
    return this.http.get<any[]>(CLIENT_API + `builds/${client}`);
  }

  getResultById(client: string, buildId: string) {
    return this.http.get<any[]>(CLIENT_API + `build/${client}/${buildId}`);
  }

  replaceScreenshot(client: string, buildId: string, screenshot: string) {
    let params = {
      screenshot: screenshot
    }
    return this.http.post(`${CLIENT_API}build/${client}/${buildId}/replace`, params);
  }

  undoReplacement(client: string, buildId: string, screenshot: string) {
    let params = {
      screenshot: screenshot
    }
    return this.http.post(`${CLIENT_API}build/${client}/${buildId}/undoReplace`, params);
  }
}
