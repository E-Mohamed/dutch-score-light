import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScoreGraphComponent } from './score-graph.component';

describe('ScoreGraphComponent', () => {
  let component: ScoreGraphComponent;
  let fixture: ComponentFixture<ScoreGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScoreGraphComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScoreGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
