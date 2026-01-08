import { CommonModule } from "@angular/common";
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  Renderer2,
} from "@angular/core";
import { RouterModule } from "@angular/router";

@Component({
    selector: "app-sidebar",
    imports: [CommonModule, RouterModule],
    templateUrl: "./sidebar.component.html",
    styleUrl: "./sidebar.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarComponent {
  @Input() isSidebarOpen = false;
  @Output() closeSidebar = new EventEmitter<void>();
  private startX = 0;
  private currentX = 0;
  private isDragging = false;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
  ) {}

  onCloseSidebar() {
    this.isSidebarOpen = false;
    this.closeSidebar.emit();
  }

  @HostListener("touchstart", ["$event"])
  onTouchStart(event: TouchEvent) {
    this.startX = event.touches[0].clientX;
    this.currentX = this.startX;
    this.isDragging = true;
  }

  // 👉 Capture touch move and update sidebar position
  @HostListener("touchmove", ["$event"])
  onTouchMove(event: TouchEvent) {
    if (!this.isDragging) return;

    this.currentX = event.touches[0].clientX;
    const deltaX = this.currentX - this.startX;

    // Don't allow sliding right, only left
    if (deltaX < 0) {
      this.renderer.setStyle(
        this.el.nativeElement,
        "transform",
        `translateX(${deltaX}px)`,
      );
    }
  }

  // 👉 Capture touch end and determine if sidebar should close
  @HostListener("touchend", ["$event"])
  onTouchEnd(event: TouchEvent) {
    this.isDragging = false;

    const deltaX = this.currentX - this.startX;

    // Close sidebar if swipe distance is significant
    if (deltaX < -50) {
      this.onCloseSidebar();
    }

    // Reset position
    this.renderer.setStyle(this.el.nativeElement, "transform", "translateX(0)");
  }
}
