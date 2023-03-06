import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsFooterComponent } from './news-footer.component';

describe('NewsFooterComponent', () => {
  let component: NewsFooterComponent;
  let fixture: ComponentFixture<NewsFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewsFooterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewsFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
