import {
  Component,
  inject,
  OnInit,
  signal,
  WritableSignal,
} from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { FormControl, ReactiveFormsModule, Validators } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { Player } from "./models/player";
import { SupabaseService } from "./services/supabase.service";
import { Observable } from "rxjs";
import { environment } from "../environments/environment";
import { ModalComponent } from "./components/modal/modal.component";
import { SidebarComponent } from "./components/sidebar/sidebar.component";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [
    RouterOutlet,
    ReactiveFormsModule,
    CommonModule,
    ModalComponent,
    SidebarComponent,
  ],
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
  isModalOpen: boolean;
  isDisabled: WritableSignal<boolean> = signal(true);

  isSidebarOpen = false;

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

    if (this.isDisabled()) this.isDisabled.set(false);
  }

  public removePlayer(playerIdx: number): void {
    this.players.splice(playerIdx, 1);
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
      .subscribe({
        next: () => {
          alert("Score saved");
          this.isModalOpen = false;
        },
        error: (err) => {
          alert("Score not saved");
          console.error("Insertion failed", err);
        },
      });
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  onCloseSidebar() {
    console.log("get emmited envent");
    this.toggleSidebar();
  }

  private isScoreExisting(): boolean {
    return this.players.some((player) => player.total > 0);
  }
}
