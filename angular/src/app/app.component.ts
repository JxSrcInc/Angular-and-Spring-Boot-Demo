import { Component } from '@angular/core';
import { Router } from '@angular/router'; // Import Router

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'User Management';

  constructor(private router: Router) {}

  navigateTo(page: string): void {
    this.router.navigate([`/${page}`]);
  }
}
