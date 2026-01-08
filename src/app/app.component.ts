import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { CommonModule } from "@angular/common";
import { SidebarComponent } from "./components/sidebar/sidebar.component";

@Component({
    selector: "app-root",
    imports: [RouterOutlet, CommonModule, SidebarComponent],
    templateUrl: "./app.component.html",
    styleUrl: "./app.component.scss"
})
export class AppComponent {
  isSidebarOpen: boolean;
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  onCloseSidebar() {
    this.toggleSidebar();
  }
}
