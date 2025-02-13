import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private users = [
    { id: 1, ownerId : 'admin', role: 'admin' },
    { id: 2, ownerId : 'user', role: 'user' }
  ];

  constructor() { }

  getUsers() { return this.users; }
  addUser(ownerId : string, role: string) { 
    this.users.push({ id: Date.now(), ownerId , role });
   }
}
