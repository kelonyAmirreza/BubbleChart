import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HttpClientModule } from '@angular/common/http';

import { BubbleChartingComponentComponent } from './bubble-charting-component/bubble-charting-component.component';
import { NewsSectionComponent } from './news-section/news-section.component';

import { NewsServiceService } from './news-service.service';
import { BarChartingComponent } from './bar-charting/bar-charting.component';
import { NewsFooterComponent } from './news-footer/news-footer.component';

@NgModule({
  declarations: [
    AppComponent,
    BubbleChartingComponentComponent,
    NewsSectionComponent,
    BarChartingComponent,
    NewsFooterComponent,
  ],
  imports: [BrowserModule, NgbModule, AppRoutingModule, HttpClientModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
