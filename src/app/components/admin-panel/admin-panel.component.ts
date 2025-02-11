import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-admin-panel',
  standalone: false,
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.css'
})
export class AdminPanelComponent {
  users: any[] = [];
  newUsername = '';
  newUserRole = 'user';
  authService: any;
  currentUser: any;
  constructor(private userService: UserService) {
    this.currentUser = this.authService.getCurrentUser();
  }


    // Edit user role
    editUser(user: any) {
      const newRole = prompt(`Edit role for ${user.username}: (admin/user)`, user.role);
      if (newRole && (newRole === 'admin' || newRole === 'user')) {
        user.role = newRole;
        this.authService.updateUser(user.id, { role: newRole }).subscribe();
      }
    }
  
    // Delete user
    deleteUser(userId: number) {
      if (confirm("Are you sure you want to delete this user?")) {
        this.users = this.users.filter(u => u.id !== userId);
        this.authService.deleteUser(userId).subscribe();
      }
    }
  
}
