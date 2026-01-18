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

  it('should toggle between cumulative and round modes', () => {
    expect(component.showCumulative).toBe(true);
    
    component.toggleGraphMode();
    
    expect(component.showCumulative).toBe(false);
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
    component.showCumulative = true;
    component.ngOnChanges({
      roundHistory: { currentValue: [[5], [10]], previousValue: [], firstChange: true, isFirstChange: () => true }
    });

    expect(component.playerLines[0].points[0].y).toBe(5);
    expect(component.playerLines[0].points[1].y).toBe(15);
  });

  it('should show round scores when not cumulative', () => {
    const players: Player[] = [
      { id: '1', name: 'Player1', scoreCtrl: new FormControl(0), total: 15 }
    ];
    component.players = players;
    component.roundHistory = [[5], [10]];
    component.showCumulative = false;
    component.ngOnChanges({
      roundHistory: { currentValue: [[5], [10]], previousValue: [], firstChange: true, isFirstChange: () => true }
    });

    expect(component.playerLines[0].points[0].y).toBe(5);
    expect(component.playerLines[0].points[1].y).toBe(10);
  });

  it('should generate Y ticks correctly', () => {
    component.minScore = 0;
    component.maxScore = 20;
    
    const ticks = component.getYTicks();
    
    expect(ticks.length).toBeGreaterThan(0);
    expect(ticks[0]).toBe(0);
    expect(ticks[ticks.length - 1]).toBeLessThanOrEqual(20);
  });

  it('should generate round indices correctly', () => {
    component.roundHistory = [[1, 2], [3, 4], [5, 6]];
    
    const indices = component.getRoundIndices();
    
    expect(indices).toEqual([0, 1, 2]);
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

  it('should display correct title based on mode', () => {
    component.showCumulative = true;
    fixture.detectChanges();
    
    let title = fixture.nativeElement.querySelector('h3');
    expect(title.textContent).toContain('Cumulative Scores');
    
    component.toggleGraphMode();
    fixture.detectChanges();
    
    title = fixture.nativeElement.querySelector('h3');
    expect(title.textContent).toContain('Round Scores');
  });

  it('should display correct button text based on mode', () => {
    component.showCumulative = true;
    fixture.detectChanges();
    
    let button = fixture.nativeElement.querySelector('.toggle-btn');
    expect(button.textContent.trim()).toBe('Show Round Scores');
    
    component.toggleGraphMode();
    fixture.detectChanges();
    
    button = fixture.nativeElement.querySelector('.toggle-btn');
    expect(button.textContent.trim()).toBe('Show Cumulative');
  });
});