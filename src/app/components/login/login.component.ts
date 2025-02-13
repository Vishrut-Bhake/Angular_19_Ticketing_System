import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: false,
})
export class LoginComponent {
  UserName : string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    if (this.authService.authenticate(this.UserName , this.password)) {
      this.router.navigateByUrl('/kanban');
    } else {
      alert('Invalid credentials. Please try again.');
    }
  }
}
