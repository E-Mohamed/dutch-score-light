import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { GamePool } from "../models/game-pool";

@Injectable({
  providedIn: "root",
})
export class StateService {
  public gamePoolsSubject = new BehaviorSubject<GamePool[]>([]);
  constructor() {}
}
