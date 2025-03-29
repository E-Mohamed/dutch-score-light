import { Routes } from "@angular/router";
import { ScoresComponent } from "./pages/scores/scores.component";
import { StatsComponent } from "./pages/stats/stats.component";

export const routes: Routes = [
  { path: "", component: ScoresComponent, pathMatch: "full" },
  { path: "stats", component: StatsComponent },
  { path: "**", component: ScoresComponent },
];
