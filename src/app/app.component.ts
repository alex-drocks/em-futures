import {Component, HostListener} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  showScrollBottom = false;
  showScrollTop = false;

  @HostListener('window:scroll', [])
  onScroll(): void {
    this.showScrollBottom = window.scrollY > 800 && !this.isScrolledToBottom();
    this.showScrollTop = window.scrollY >= 3000;
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
