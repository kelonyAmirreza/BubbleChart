import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NewsSectionComponent } from './news-section/news-section.component';
import { BubbleChartingComponentComponent } from './bubble-charting-component/bubble-charting-component.component';
import { BarChartingComponent } from './bar-charting/bar-charting.component';

const routes: Routes = [
  { path: '', component: BubbleChartingComponentComponent },
  { path: 'bar-chart', component: BarChartingComponent },
  { path: 'web3-news', component: NewsSectionComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
