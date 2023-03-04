import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarChartingComponent } from './bar-charting.component';

describe('BarChartingComponent', () => {
  let component: BarChartingComponent;
  let fixture: ComponentFixture<BarChartingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BarChartingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BarChartingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
