import {Component, HostListener} from '@angular/core';

@Component({
  selector: 'app-futures',
  templateUrl: './futures.component.html',
  styleUrl: './futures.component.scss'
})
export class FuturesComponent {
  showScrollBottom = false;
  showScrollTop = false;

  @HostListener('window:scroll', [])
  onScroll(): void {
    this.showScrollBottom = window.scrollY > 100 && !this.isScrolledToBottom();
    this.showScrollTop = window.scrollY >= 2500;
  }

  public goToTop(): void {
    window.scrollTo(0, 0);
  }

  public goToBottom(): void {
    window.scrollTo(0, document.body.scrollHeight);
  }

  public isScrolledToBottom() {
    const tolerance = 100;
    return window.scrollY + window.innerHeight + tolerance >= document.body.scrollHeight;
  }
}
