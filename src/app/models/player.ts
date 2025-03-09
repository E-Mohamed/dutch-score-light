import { FormControl } from "@angular/forms";

export interface Player {
  id: string;
  name: string;
  scoreCtrl: FormControl;
  total: number;
}
export class PlayerDTO {
  name: string;
  score: number;
  pool_id: number;

  constructor(player: Player, gamePoolId: number) {
    this.name = player.name;
    this.score = player.total;
    this.pool_id = gamePoolId;
  }
}
