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

  getAllResults(): Observable<any[]> {
    return this.http.get<any[]>(CLIENT_API + 'builds');
  }

  getResultById(buildId: string) {
    return this.http.get<any[]>(CLIENT_API + 'build/android/' + buildId);
  }

  replaceScreenshot(buildId: string, screenshot: string) {
    let params = {
      screenshot: screenshot
    }
    return this.http.post(`${CLIENT_API}build/android/${buildId}/replace`, params);
    }
  }
}
