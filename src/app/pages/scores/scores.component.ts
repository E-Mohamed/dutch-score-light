import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnDestroy,
  OnInit,
  signal,
  WritableSignal,
} from "@angular/core";
import { FormControl, ReactiveFormsModule, Validators } from "@angular/forms";
import { catchError, Observable, Subject, takeUntil, throwError } from "rxjs";
import { environment } from "../../../environments/environment";
import { Player } from "../../models/player";
import { SupabaseService } from "../../services/supabase.service";
import { ModalComponent } from "../../components/modal/modal.component";
import { ScoreGraphComponent } from "../../components/score-graph/score-graph.component";
import { CommonModule, TitleCasePipe } from "@angular/common";

@Component({
    selector: "app-scores",
    standalone: true,
    imports: [ModalComponent, ScoreGraphComponent, ReactiveFormsModule, CommonModule, TitleCasePipe],
    templateUrl: "./scores.component.html",
    styleUrl: "./scores.component.scss",
})
export class ScoresComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private supabaseService = inject(SupabaseService);
  private cdr = inject(ChangeDetectorRef);

  playerName: FormControl = new FormControl("", [
    Validators.required,
    Validators.maxLength(24),
  ]);
  players: Player[] = [];
  roundHistory = signal<number[][]>([]);
  // Dumb value to init min max
  min: number = -1;
  max: number = 99;
  gamePools$: Observable<any>;
  isModalOpen: boolean;
  isDisabled: WritableSignal<boolean> = signal(true);

  isSidebarOpen = false;

  public ngOnInit(): void {
    this.supabaseService.getGamePool();
  }
  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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
      this.cdr.detectChanges();
    } 
    
    if (this.isScoreExisting()) {
      this.computeTotal();
    }
  }

  public computeTotal(): void {
    const roundScores: number[] = [];
    
    this.players.forEach((player, index) => {
      const score = player.scoreCtrl.value || 0;
      roundScores[index] = score;
      player.total += score;
      player.scoreCtrl.setValue(0);
    });

    const currentHistory = this.roundHistory();
    this.roundHistory.set([...currentHistory, roundScores]);

    const playerScoreList = this.players.map((player) => player.total);
    this.min = Math.min(...playerScoreList);
    this.max = Math.max(...playerScoreList);

    if (this.isDisabled()) this.isDisabled.set(false);
  }

  public removePlayer(playerIdx: number): void {
    this.players.splice(playerIdx, 1);
    
    const currentHistory = this.roundHistory();
    const updatedHistory = currentHistory.map(round => {
      const newRound = [...round];
      newRound.splice(playerIdx, 1);
      return newRound;
    });
    this.roundHistory.set(updatedHistory);
    
    this.computeTotal();
  }

  public openSaveScoreModal(): void {
    this.isModalOpen = true;
  }

  public closeModal(): void {
    this.isModalOpen = false;
  }
  public onConfirmSave(): void {
    this.supabaseService
      .insertScore(this.players, environment.poolId)
      .pipe(
        takeUntil(this.destroy$),
        catchError((err) => {
          return throwError(() => err.message);
        }),
      )
      .subscribe({
        next: () => {
          alert("Score saved");
          this.isModalOpen = false;
        },
        error: (err) => {
          alert("Score not saved: \n " + err);
          console.error("Insertion failed", err);
        },
      });
  }

  private isScoreExisting(): boolean {
    return this.players.some((player) => player.total > 0);
  }
}
