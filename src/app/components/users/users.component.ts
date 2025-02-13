import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { TicketService } from '../../services/ticket.service';
import { AuthService } from '../../services/auth-service.service';
import { HttpClient } from '@angular/common/http';

import { Comment, Ticket, User } from '../models'
import { map } from 'rxjs';
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
  standalone: false
})
export class UsersComponent implements OnInit {
  private apiUrl = 'http://localhost:3000'; // Change this to your actual API URL
  currentUser: any;
  statuses: string[] = ['Discussion', 'In Progress', 'Test', 'Complete'];
  tickets: Ticket[] = [];
  removedTickets: Ticket[] = [];
  users: User[] = [];
  newCommentText: { [ticketId: number]: string } = {};
  newCommentImage: { [ticketId: number]: string | null } = {};
  tasksByStatus: Map<string, Ticket[]> = new Map();
  constructor(
    private ticketService: TicketService,
    private authService: AuthService,
    private http: HttpClient
  ) {
    this.currentUser = this.authService.getCurrentUser();
  }

  ngOnInit(): void {
    this.loadTickets();
    if (this.currentUser.role === 'user') {
      this.loadRemovedTickets();
      this.loadUsers();
    }
  }

  loadTickets() {
    this.ticketService.getTickets()
      .pipe(
        map((data: any[]) => data.filter(ticket =>
          this.currentUser.role === 'user' || ticket.userId === this.currentUser.id
        ))
      )
      .subscribe(filteredTickets => {
        this.tickets = filteredTickets;
        this.groupTasksByStatus();
      });
  }


  loadRemovedTickets() {
    this.ticketService.getRemovedTickets().subscribe(data => {
      this.removedTickets = data;
    });
  }

  loadUsers() {
    this.authService.getUsers().subscribe(data => {
      this.users = data;
    });
  }

  groupTasksByStatus() {
    this.tasksByStatus.clear();
    this.statuses.forEach(status => {
      this.tasksByStatus.set(status, this.tickets.filter(ticket => ticket.status === status));
    });
  }

  getTasksByStatus(status: string): Ticket[] {
    return this.tasksByStatus.get(status) || [];
  }

  toggleComments(ticketId: number) {
    const ticket = this.tickets.find(ticket => ticket.id === ticketId);
    if (ticket) {
      ticket.showComments = !ticket.showComments;
    }
  }

  addComment(ticketId: number, text: string) {
    if (!text.trim()) return;

    const ticket = this.tickets.find(ticket => ticket.id === ticketId);
    if (ticket) {
      const newComment: Comment = {
        text,
        image: this.newCommentImage[ticketId] || null,
        createdBy: this.currentUser.username,
        description: '',
        userID: this.currentUser.ownerId
      };
      ticket.comments.push(newComment);

      this.http.put(`${this.apiUrl}/tickets/${ticket.id}`, ticket).subscribe(() => {
        this.newCommentText[ticketId] = '';
        this.newCommentImage[ticketId] = null;
      });
    }
  }

  deleteComment(ticketId: number, commentIndex: number) {
    const ticket = this.tickets.find(ticket => ticket.id === ticketId);
    if (ticket) {
      if (ticket.comments[commentIndex].createdBy === this.currentUser.username) {
        ticket.comments.splice(commentIndex, 1);
        this.http.put(`${this.apiUrl}/tickets/${ticket.id}`, ticket).subscribe();
      } else {
        alert('You can only delete your own comments.');
      }
    }
  }

  onCommentImageSelected(event: any, ticketId: number) {
    const file = event.target.files[0];
    if (file && file.type.includes('image')) {
      this.newCommentImage[ticketId] = URL.createObjectURL(file);
    } else {
      alert('Only image files are allowed.');
    }
  }

  drop(event: CdkDragDrop<Ticket[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const ticket = event.previousContainer.data[event.previousIndex];
      ticket.status = event.container.id;
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
      this.http.put(`${this.apiUrl}/tickets/${ticket.id}`, ticket).subscribe();
    }
  }

  deleteTicket(ticket: Ticket) {
    if (confirm('Are you sure you want to delete this ticket?')) {
      this.ticketService.deleteTicket(ticket.id).subscribe(() => {
        this.tickets = this.tickets.filter(t => t.id !== ticket.id);
      });
    }
  }

  restoreTicket(ticket: Ticket) {
    if (confirm('Restore this ticket?')) {
      this.ticketService.restoreTicket(ticket).subscribe(() => {
        this.removedTickets = this.removedTickets.filter(t => t.id !== ticket.id);
      });
    }
  }

  deleteUser(userId: number) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.http.delete(`${this.apiUrl}/users/${userId}`).subscribe(() => {
        this.users = this.users.filter(user => user.ownerId !== userId);
      });
    }
  }

 editUser(user: User) {
  const newRole = prompt(`Edit role for ${user.ownerId}:`, user.role);
  if (newRole && (newRole === 'admin' || newRole === 'user')) {
    this.authService.updateUser(user.ownerId, { role: newRole }).subscribe(updatedUser => {
      user.role = updatedUser.role;
    });
  }
}

}
