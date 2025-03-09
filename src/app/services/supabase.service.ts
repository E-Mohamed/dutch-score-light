import { inject, Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import {
  createClient,
  PostgrestSingleResponse,
  SupabaseClient,
} from "@supabase/supabase-js";
import { from } from "rxjs";
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
    return from(this.supabase.from("scores").insert(playerDTOList));
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
          console.log(this.stateService.gamePoolsSubject);
        }
      });
  }
}
