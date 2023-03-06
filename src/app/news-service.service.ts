import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class NewsServiceService {
  constructor(private http: HttpClient) {}

  nowDat = new Date();
  yyyy = this.nowDat.getFullYear();
  mm = this.nowDat.getMonth(); // Months start at 0!
  dd = this.nowDat.getDate();
  stringDate =
    this.yyyy.toString() +
    '-' +
    (this.mm + 1).toString() +
    '-' +
    (this.dd - 3).toString();
  private newApi = `https://newsapi.org/v2/everything?q=businesses&domains=bbc.co.uk,bbc.com,bbc.it&from=${this.stringDate}&sortBy=publishedAt&apiKey=ecaa0e0700174143a05cee2870012a95`;

  topNews(): Observable<any> {
    return this.http.get(this.newApi);
  }
}
