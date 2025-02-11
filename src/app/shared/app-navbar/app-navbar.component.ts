import { Component } from '@angular/core';
import { AuthService } from '../../services/auth-service.service';
import { Router } from '@angular/router';
import { TicketService } from '../../services/ticket.service';

@Component({
  selector: 'app-app-navbar',
  standalone: false,
  templateUrl: './app-navbar.component.html',
  styleUrl: './app-navbar.component.css'
})
export class AppNavbarComponent {
  isNavbarOpen = false;
  currentUser: any;
 constructor(private ticketService: TicketService, private authService: AuthService, private router: Router) {
     this.currentUser = this.authService.getCurrentUser();
     console.log("Current User:", this.currentUser);  // Debugging line to check user details
   }
  toggleNavbar(): void {
    this.isNavbarOpen = !this.isNavbarOpen;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

}
