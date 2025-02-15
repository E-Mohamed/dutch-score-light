import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface Player {
  id: string,
  name: string,
  scoreCtrl: FormControl,
  total: number
}
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ReactiveFormsModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  playerName: FormControl = new FormControl('', [Validators.required, Validators.maxLength(24)]);
  players: Player[] = [];
  min: number = -1;
  max: number = 99;

  public addPlayer(): void {
    if (this.playerName.valid) {
      const iPlayer: Player = {
        id: crypto.randomUUID(),
        name: this.playerName.value,
        scoreCtrl: new FormControl(0),
        total: 0
      }
      this.players.push(iPlayer);
      this.playerName.setValue('');
    }
    if (this.isScoreExisting()) {
      this.computeTotal()
    }
  }

  public computeTotal(): void {
    this.players.forEach(player => {
      player.total += player.scoreCtrl.value;
      player.scoreCtrl.setValue(0);
    })

    const playerScoreList = this.players.map(player => player.total); 
    this.min = Math.min(...playerScoreList);
    this.max = Math.max(...playerScoreList);
  }

  public removePlayer(playerIdx: number): void {
    this.players.splice(playerIdx, 1);
    this.computeTotal();
  }

  private isScoreExisting(): boolean {
    return this.players.some(player => player.total > 0);
  }
}
