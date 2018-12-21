import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

//export const CLIENT_API = 'http://localhost:8000/'
export const CLIENT_API = 'http://118.24.41.169:8000/'

const LOCAL_BUILD_ID = '99999'

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

  getBaseScreenshots(client: string) {
    return this.http.get(`${CLIENT_API}${client}/base`);
  }

  replaceScreenshot(client: string, buildId: string, screenshot: string) {
    let params = {
      screenshot: screenshot
    }
    return this.http.post(`${CLIENT_API}build/${client}/${buildId}/replace`, params);
  }

  removeBuild(client: string, buildId: string) {
    return this.http.post(`${CLIENT_API}build/${client}/${buildId}/remove`, {});
  }

  removeBaseScreenshot(client: string, buildId: string, screenshot: string) {
    let params = {
      screenshot: screenshot
    }
    return this.http.post(`${CLIENT_API}build/${client}/${buildId}/removeBase`, params);
  }

  undoReplacement(client: string, buildId: string, screenshot: string) {
    let params = {
      screenshot: screenshot
    }
    return this.http.post(`${CLIENT_API}build/${client}/${buildId}/undoReplace`, params);
  }

  hasScreenshotBeenReplaced(screenshot:string , build: any) {
    return build.replaced && build.replaced.includes(screenshot);
  }

  getResultScreenshotPath(client: string, screenshot:string , build: any) {
    let path = undefined;
    if (build.buildNumber == LOCAL_BUILD_ID) {
        path = `${CLIENT_API}screenshots/${client}/result/${screenshot}`
    }
    else {
      switch (client) {
        case "ios":
          path = `${CLIENT_API}ios/${build.buildNumber}/archive/result/${screenshot}`;
          break;
        case "web":
          path = `${CLIENT_API}web/${build.buildNumber}/archive/result/${screenshot}`;
          break;

        case "android":
          path = `${CLIENT_API}android/${build.buildNumber}/archive/result/${screenshot}`;
          break;
    
        default:
          break;
      }  
    }
    return path;
  }

  getNewScreenshotPath(client: string, screenshot:string , build: any) {
    let path = undefined;

    if (build.buildNumber == LOCAL_BUILD_ID) {
        path = `${CLIENT_API}screenshots/${client}/new/${screenshot}`
    }
    else {
      switch (client) {
        case "ios":
          path = `${CLIENT_API}ios/${build.buildNumber}/archive/new/${screenshot}`;
          break;
        case "web":
          path = `${CLIENT_API}web/${build.buildNumber}/archive/new/${screenshot}`;
          break;

        case "android":
          path = `${CLIENT_API}android/${build.buildNumber}/archive/new/${screenshot}`;
          break;
    
        default:
          break;
      }  
    }


    return path;
  }

  getBaseScreenshotPath(client: string, screenshot:string , build: any) {
    return `${CLIENT_API}screenshots/${client}/base/${screenshot}`;
  }
}
