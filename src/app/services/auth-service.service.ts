import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private users = [
    { id: 1, username: 'admin', role: 'admin', password: 'admin' },
    { id: 2, username: 'user', role: 'user', password: 'user' },
    { id: 3, username: 'user2', role: 'user', password: 'user2'  },
    { id: 4, username: 'IT', role: 'IT', password: 'IT' },
    { id: 5, username: 'tester', role: 'tester', password: 'tester'  },
    { id: 6, username: 'developer', role: 'developer', password: 'developer'  },
    { id: 7, username: 'cleak', role: 'cleak', password: 'cleak' },
    { id: 8, username: 'user5', role: 'user', password: 'user5'  }
  ];

  constructor(private router: Router) { }

  authenticate(username: string, password: string): boolean {
    const user = this.users.find(u => u.username === username && u.password === password);
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
      return true;
    }
    return false;
  }

  getCurrentUser(): any {
    try {
      return JSON.parse(localStorage.getItem('currentUser') || 'null');
    } catch (error) {
      return null; // Prevents app crash if localStorage is corrupted
    }
  }

  isAuthenticated(): boolean {
    return !!this.getCurrentUser();
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.router.navigate(['/login']);

  }

  getUserRole(): string {
    const user = this.getCurrentUser();
    return user ? user.role : '';
  }

  getUserId(): number {
    const user = this.getCurrentUser();
    return user ? user.id : 0;
  }

  getUsers(): Observable<any[]> {
    return of(this.users);
  }

  updateUser(userId: number, updatedData: any): Observable<any> {
    this.users = this.users.map(user => user.id === userId ? { ...user, ...updatedData } : user);
    return of({ success: true });
  }

  deleteUser(userId: number): Observable<any> {
    this.users = this.users.filter(user => user.id !== userId);
    return of({ success: true });
  }


}
