import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Player } from '../../models/player';

interface GraphPoint {
  x: number;
  y: number;
}

interface PlayerLine {
  name: string;
  color: string;
  points: GraphPoint[];
}

@Component({
  selector: 'app-score-graph',
  imports: [CommonModule],
  templateUrl: './score-graph.component.html',
  styleUrl: './score-graph.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScoreGraphComponent implements OnChanges {
  @Input() players: Player[] = [];
  @Input() roundHistory: number[][] = [];

  playerLines: PlayerLine[] = [];
  maxScore = 0;
  minScore = 0;
  colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff'];

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['roundHistory'] || changes['players']) {
      this.updateGraph();
      this.cdr.markForCheck();
    }
  }

  private updateGraph(): void {
    if (!this.players.length || !this.roundHistory.length) return;

    this.playerLines = this.players.map((player, playerIndex) => ({
      name: player.name,
      color: this.colors[playerIndex % this.colors.length],
      points: this.roundHistory.map((round, roundIndex) => ({
        x: roundIndex,
        y: this.calculateCumulativeScore(playerIndex, roundIndex)
      }))
    }));

    this.calculateMinMaxScores();
  }

  private calculateCumulativeScore(playerIndex: number, roundIndex: number): number {
    let total = 0;
    for (let i = 0; i <= roundIndex; i++) {
      total += this.roundHistory[i][playerIndex] || 0;
    }
    return total;
  }

  private calculateMinMaxScores(): void {
    const allScores = this.playerLines.flatMap(line => line.points.map(p => p.y));
    this.maxScore = Math.max(...allScores, 0);
    this.minScore = Math.min(...allScores, 0);
  }

  getScaledX(x: number): number {
    const maxRounds = Math.max(this.roundHistory.length - 1, 1);
    return (x / maxRounds) * 280 + 10;
  }

  getScaledY(y: number): number {
    const range = this.maxScore - this.minScore || 1;
    return 180 - ((y - this.minScore) / range) * 160 + 10;
  }

  getPathData(points: GraphPoint[]): string {
    if (points.length === 0) return '';
    
    const pathCommands = points.map((point, index) => {
      const x = this.getScaledX(point.x);
      const y = this.getScaledY(point.y);
      return index === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
    });
    
    return pathCommands.join(' ');
  }
}
