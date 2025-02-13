import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { User } from '../components/models';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:3000';
  private users = [
    { id: 1, ownerId : 'admin', role: 'admin', password: 'admin' },
    { id: 2, ownerId : 'user', role: 'user', password: 'user' },
    { id: 3, ownerId : 'user1', role: 'user', password: 'user1'  },
    { id: 4, ownerId : 'IT', role: 'IT', password: 'IT' },
    { id: 5, ownerId : 'tester', role: 'tester', password: 'tester'  },
    { id: 6, ownerId : 'developer', role: 'developer', password: 'developer'  },
    { id: 7, ownerId : 'cleak', role: 'cleak', password: 'cleak' },
    { id: 8, ownerId : 'user5', role: 'user', password: 'user5'  }
  ];

  constructor(private http: HttpClient , private router:Router) {}

  authenticate(ownerId : string, password: string): boolean {
    const user = this.users.find(u => u.ownerId  === ownerId  && u.password === password);
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

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`);
  }
  updateUser(userId: number, updatedData: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/users/${userId}`, updatedData);
  }
  deleteUser(userId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/${userId}`);
  }

}



