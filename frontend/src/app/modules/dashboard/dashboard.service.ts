import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http: HttpClient) { }

  getDashboardData(): Observable<any> {
    return this.http.get('http://localhost:3000/dashboard', {responseType: 'json'});
  }

  getColumnDummyData() {
    return [{
      name: 'Total',
      data: [[0], [0], [0], [0] ,[0]]
    }, {
      name: 'Passed',
      data: [[0], [0], [0], [0] ,[0]]
    }, {
      name: 'Error',
      data: [[0], [0], [0], [0] ,[0]]
    }, {
      name: 'Code Quality Index',
      data: [[0], [0], [0], [0] ,[0]]
    }, {
      name: 'Potential Index',
      data: [[0], [0], [0], [0] ,[0]]
    }];
  }

  getCardDummyData() {
    return [0, 0, 0, 0, 0];
  }

  getPieDummyData() {
    return [{
      name: 'Chrome',
      y: 61.41,
      sliced: true,
      selected: true
    }, {
      name: 'Internet Explorer',
      y: 11.84
    }, {
      name: 'Firefox',
      y: 10.85
    }, {
      name: 'Edge',
      y: 4.67
    }, {
      name: 'Safari',
      y: 4.18
    }, {
      name: 'Sogou Explorer',
      y: 1.64
    }, {
      name: 'Opera',
      y: 1.6
    }, {
      name: 'QQ',
      y: 1.2
    }, {
      name: 'Other',
      y: 2.61
    }];
  }
}
