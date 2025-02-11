import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private users = [
    { id: 1, username: 'admin', role: 'admin' },
    { id: 2, username: 'user', role: 'user' }
  ];

  constructor() { }

  getUsers() { return this.users; }
  addUser(username: string, role: string) { 
    this.users.push({ id: Date.now(), username, role });
   }
}
