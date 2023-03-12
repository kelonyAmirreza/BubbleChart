import { Component } from '@angular/core';
import { NewsServiceService } from '../news-service.service';

@Component({
  selector: 'app-news-footer',
  templateUrl: './news-footer.component.html',
  styleUrls: ['./news-footer.component.scss'],
})
export class NewsFooterComponent {
  constructor(private service: NewsServiceService) {}

  newsResultFooter: string = '';
  ngOnInit(): void {
    this.service.topNews().subscribe((result) => {
      // console.log(result);
      this.newsResultFooter = '';
      for (let i = 0; i < result.articles.length; i++) {
        this.newsResultFooter += result.articles[i].description + '   |   ';
      }
    });
  }
}
