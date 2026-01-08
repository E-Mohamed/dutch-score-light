import {
  trigger,
  state,
  style,
  transition,
  animate,
} from "@angular/animations";
import { Component, EventEmitter, Output } from "@angular/core";

@Component({
    selector: "app-modal",
    standalone: true,
    imports: [],
    templateUrl: "./modal.component.html",
    styleUrl: "./modal.component.scss",
    animations: [
        trigger("slideUpDown", [
            state("void", style({ transform: "translateY(100%)" })),
            transition(":enter", [
                animate("300ms ease-out", style({ transform: "translateY(0)" })),
            ]),
            transition(":leave", [
                animate("200ms ease-in", style({ transform: "translateY(100%)" })),
            ]),
        ]),
    ]
})
export class ModalComponent {
  @Output() close = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<void>();

  closeModal(): void {
    this.close.emit();
  }

  onConfirm(): void {
    this.confirm.emit();
  }
}
