import { AfterViewInit, Component, signal } from '@angular/core';
import { RouterOutlet, RouterLinkWithHref } from '@angular/router';
import { LayoutService } from './layout';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLinkWithHref, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements AfterViewInit {
  protected readonly title = signal('salah-time-board');

  constructor(private layoutService: LayoutService) {}


  ngAfterViewInit() {
    this.layoutService.setPreload(true);
    this.layoutService.setResizingHandlers();
    this.layoutService.setupMenuToggles();
  }

  toggleSidebar(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.layoutService.toggleSidebar();
  }
}
