import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScoreGraphComponent } from './score-graph.component';
import { Player } from '../../models/player';
import { FormControl } from '@angular/forms';

fdescribe('ScoreGraphComponent', () => {
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

  it('should display no data message when no rounds', () => {
    component.players = [];
    component.roundHistory = [];
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.no-data')).toBeTruthy();
  });

  it('should update graph when players and roundHistory change', () => {
    const players: Player[] = [
      { id: '1', name: 'Player1', scoreCtrl: new FormControl(0), total: 10 },
      { id: '2', name: 'Player2', scoreCtrl: new FormControl(0), total: 20 }
    ];
    const roundHistory = [[5, 10], [5, 10]];

    component.players = players;
    component.roundHistory = roundHistory;
    component.ngOnChanges({
      players: { currentValue: players, previousValue: [], firstChange: true, isFirstChange: () => true },
      roundHistory: { currentValue: roundHistory, previousValue: [], firstChange: true, isFirstChange: () => true }
    });
    fixture.detectChanges();

    expect(component.playerLines.length).toBe(2);
    expect(component.playerLines[0].name).toBe('Player1');
    expect(component.playerLines[1].name).toBe('Player2');
  });

  it('should calculate cumulative scores correctly', () => {
    const players: Player[] = [
      { id: '1', name: 'Player1', scoreCtrl: new FormControl(0), total: 15 }
    ];
    component.players = players;
    component.roundHistory = [[5], [10]];
    component.ngOnChanges({
      roundHistory: { currentValue: [[5], [10]], previousValue: [], firstChange: true, isFirstChange: () => true }
    });

    expect(component.playerLines[0].points[0].y).toBe(5);
    expect(component.playerLines[0].points[1].y).toBe(15);
  });

  it('should calculate min and max scores', () => {
    const players: Player[] = [
      { id: '1', name: 'Player1', scoreCtrl: new FormControl(0), total: 10 },
      { id: '2', name: 'Player2', scoreCtrl: new FormControl(0), total: 30 }
    ];
    component.players = players;
    component.roundHistory = [[5, 15], [5, 15]];
    component.ngOnChanges({
      players: { currentValue: players, previousValue: [], firstChange: true, isFirstChange: () => true },
      roundHistory: { currentValue: [[5, 15], [5, 15]], previousValue: [], firstChange: true, isFirstChange: () => true }
    });
    fixture.detectChanges();

    expect(component.minScore).toBeLessThanOrEqual(component.maxScore);
    expect(component.maxScore).toBeGreaterThan(0);
  });

  it('should generate correct SVG path data', () => {
    component.roundHistory = [[10], [20]];
    const points = [{ x: 0, y: 10 }, { x: 1, y: 20 }];
    
    const pathData = component.getPathData(points);
    
    expect(pathData).toContain('M');
    expect(pathData).toContain('L');
  });

  it('should assign different colors to players', () => {
    const players: Player[] = [
      { id: '1', name: 'Player1', scoreCtrl: new FormControl(0), total: 10 },
      { id: '2', name: 'Player2', scoreCtrl: new FormControl(0), total: 20 }
    ];
    component.players = players;
    component.roundHistory = [[10, 20]];
    component.ngOnChanges({
      roundHistory: { currentValue: [[10, 20]], previousValue: [], firstChange: true, isFirstChange: () => true }
    });

    expect(component.playerLines[0].color).toBe('#ff6b6b');
    expect(component.playerLines[1].color).toBe('#4ecdc4');
  });
});
