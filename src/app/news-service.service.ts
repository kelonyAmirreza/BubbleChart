import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class NewsServiceService {
  constructor(private http: HttpClient) {}

  private newApi =
    ' https://newsapi.org/v2/everything?q=web3&from=2023-02-04&sortBy=publishedAt&apiKey=ecaa0e0700174143a05cee2870012a95';

  topNews(): Observable<any> {
    return this.http.get(this.newApi);
  }
}
