import { inject, Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import {
  createClient,
  PostgrestSingleResponse,
  SupabaseClient,
} from "@supabase/supabase-js";
import { from, map } from "rxjs";
import { Player, PlayerDTO } from "../models/player";
import { GamePool } from "../models/game-pool";
import { StateService } from "./state.service";

@Injectable({
  providedIn: "root",
})
export class SupabaseService {
  private supabase: SupabaseClient;
  private stateService = inject(StateService);
  constructor() {
    this.supabase = createClient(
      environment.supabaseUrl,
      environment.supabaseKey,
    );
  }

  public insertScore(playerScore: Player[], gamePoolId: number) {
    const playerDTOList = playerScore.map(
      (player) => new PlayerDTO(player, gamePoolId),
    );
    return from(this.supabase.from("scores").insert(playerDTOList)).pipe(
      map((response) => {
        if (response.error) {
          throw response.error;
        }
        return response;
      }),
    );
  }

  public getGamePool(): void {
    this.supabase
      .from("game_pool")
      .select()
      .then((response: PostgrestSingleResponse<GamePool[]>) => {
        if (response.error)
          console.error("Error while fetching gamePool", response.error);
        if (response.data) {
          this.stateService.gamePoolsSubject.next(response.data);
        }
      });
  }

  public getStatsV1() {
    return from(
      this.supabase
        .from("scores")
        .select(
          `
        name,
        nb_game:name.count(),
        best_score:score.min(),
        max_score:score.max(),
        total:score.sum()
      `,
        )
        .eq("pool_id", environment.poolId),
    ).pipe(
      map((response) => {
        if (response.error) {
          throw response.error;
        }
        return response.data;
      }),
    );
  }
}
