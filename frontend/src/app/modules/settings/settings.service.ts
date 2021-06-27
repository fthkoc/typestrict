import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor(private http: HttpClient) { }

  getConfig(): Observable<any> {
    return this.http.get('http://localhost:3000/settings', {responseType: 'json'});
  }

  setConfig(config: any): Observable<any> {
    return this.http.post('http://localhost:3000/settings', config, {responseType: 'json'});
  }
}
