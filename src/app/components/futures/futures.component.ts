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
    this.showScrollTop = window.scrollY >= 1;
    this.showScrollBottom = window.scrollY > 1 && !this.isScrolledToBottom();
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
