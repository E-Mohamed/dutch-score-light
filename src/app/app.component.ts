import { Component, inject, OnInit } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { FormControl, ReactiveFormsModule, Validators } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { Player } from "./models/player";
import { SupabaseService } from "./services/supabase.service";
import { catchError, map, Observable, throwError } from "rxjs";
import { GamePool } from "./models/game-pool";
import { PostgrestSingleResponse } from "@supabase/supabase-js";
import { environment } from "../environments/environment";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet, ReactiveFormsModule, CommonModule],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.scss",
})
export class AppComponent implements OnInit {
  private supabaseService = inject(SupabaseService);

  playerName: FormControl = new FormControl("", [
    Validators.required,
    Validators.maxLength(24),
  ]);
  players: Player[] = [];
  // Dumb value to init min max
  min: number = -1;
  max: number = 99;
  gamePools$: Observable<any>;

  public ngOnInit(): void {
    this.supabaseService.getGamePool();
  }

  public addPlayer(): void {
    if (this.playerName.valid) {
      const iPlayer: Player = {
        id: crypto.randomUUID(),
        name: this.playerName.value,
        scoreCtrl: new FormControl(0),
        total: 0,
      };
      this.players.push(iPlayer);
      this.playerName.setValue("");
    }
    if (this.isScoreExisting()) {
      this.computeTotal();
    }
  }

  public computeTotal(): void {
    this.players.forEach((player) => {
      player.total += player.scoreCtrl.value;
      player.scoreCtrl.setValue(0);
    });

    const playerScoreList = this.players.map((player) => player.total);
    this.min = Math.min(...playerScoreList);
    this.max = Math.max(...playerScoreList);
  }

  public removePlayer(playerIdx: number): void {
    this.players.splice(playerIdx, 1);
    this.computeTotal();
  }

  public saveScore(): void {
    // TODO: First open pop up to choose a game pool
    this.supabaseService
      .insertScore(this.players, environment.poolId)
      .subscribe({
        next: () => {
          alert("Score saved");
        },
        error: (err) => {
          alert("Score not saved");
          console.error("Insertion failed", err);
        },
      });
  }

  private isScoreExisting(): boolean {
    return this.players.some((player) => player.total > 0);
  }
}
