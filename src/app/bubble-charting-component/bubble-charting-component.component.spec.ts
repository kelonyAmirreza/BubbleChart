import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BubbleChartingComponentComponent } from './bubble-charting-component.component';

describe('BubbleChartingComponentComponent', () => {
  let component: BubbleChartingComponentComponent;
  let fixture: ComponentFixture<BubbleChartingComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BubbleChartingComponentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BubbleChartingComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
