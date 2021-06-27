import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AnalyzeService {

  constructor(private http: HttpClient) { }

  analyzeFile(): Observable<any> {
    return this.http.get('http://localhost:3000/analyze', { responseType: 'json' });
  }

  analyzeFileFromGitHub(url: string): Observable<any> {
    return this.http.get('http://localhost:3000/analyzeGitHub' + '?' + 'url=' + url, { responseType: 'json'});
  }
}
