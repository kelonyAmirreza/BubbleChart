import { Component } from '@angular/core';
import { NewsServiceService } from '../news-service.service';

@Component({
  selector: 'app-news-section',
  templateUrl: './news-section.component.html',
  styleUrls: ['./news-section.component.scss'],
})
export class NewsSectionComponent {
  constructor(private service: NewsServiceService) {}

  newsResult: any = [];
  ngOnInit(): void {
    this.service.topNews().subscribe((result) => {
      console.log(result);
      this.newsResult = result.articles;
    });
  }
}
