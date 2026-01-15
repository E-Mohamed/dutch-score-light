import { Component, inject, OnDestroy, OnInit } from "@angular/core";
import { SupabaseService } from "../../services/supabase.service";
import { Observable, Subject } from "rxjs";
import { CommonModule } from "@angular/common";

@Component({
    selector: "app-stats",
    standalone: true,
    imports: [CommonModule],
    templateUrl: "./stats.component.html",
    styleUrl: "./stats.component.scss"
})
export class StatsComponent implements OnInit, OnDestroy {
  private supabaseService = inject(SupabaseService);
  private destroy$ = new Subject<void>();
  public playerData$: Observable<any>;
  public ngOnInit(): void {
    this.playerData$ = this.supabaseService.getStatsV1();
  }
  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
