import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { TicketService } from '../../services/ticket.service';
import { AuthService } from '../../services/auth-service.service';

@Component({
  selector: 'app-kanban-board',
  templateUrl: './kanban-board.component.html',
  styleUrls: ['./kanban-board.component.css'],
  standalone: false,
})

export class KanbanBoardComponent implements OnInit {

  statuses = ['Discussion', 'In Progress', 'Test', 'Complete'];
  tickets: any[] = [];
  removedTickets: any[] = [];
  currentUser: any;
  users: any[] = []; // Store users for Admin Panel

  newTicket = { title: '', description: '', image: null as string | null };
  constructor(private ticketService: TicketService, private authService: AuthService) {
    this.currentUser = this.authService.getCurrentUser();
  }
  ngOnInit(): void {
    this.loadTickets();
    this.loadUsers(); // Load users for admin panel
  }

  loadTickets() {
    this.ticketService.getTickets().subscribe((data: any[]) => {
      this.tickets = this.currentUser.role === 'admin' || 'user'? data : data.filter(ticket => ticket.userId === this.currentUser.id);
    });
  }

  drop(event: CdkDragDrop<any[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
      const movedTicket = event.container.data[event.currentIndex];
      movedTicket.status = event.container.id;
      this.ticketService.updateTicket(movedTicket.id, movedTicket).subscribe();
    }
  }

  createTicket() {
    if (!this.newTicket.title || !this.newTicket.description) return;

    const ticket = {
      title: this.newTicket.title,
      description: this.newTicket.description,
      image: this.newTicket.image,
      status: 'Discussion',
      userId: this.currentUser.id
    };

    this.tickets.push(ticket);
    this.newTicket = { title: '', description: '', image: null };
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => (this.newTicket.image = reader.result as string);
      reader.readAsDataURL(file);
    }
  }

  getTicketsByStatus(status: string) {
    return this.tickets.filter(ticket => ticket.status === status);
  }

  deleteTicket(ticket: any) {
    // Add 'removedBy' property to track who deleted the ticket
    const updatedTicket = { ...ticket, removedBy: this.currentUser.username };

    // Remove from active tickets and store in removedTickets
    this.tickets = this.tickets.filter(t => t.id !== ticket.id);
    this.removedTickets.push(updatedTicket);
  }

  restoreTicket(ticket: any) {
    // Restore the ticket back to active list
    this.removedTickets = this.removedTickets.filter(t => t.id !== ticket.id);
    this.tickets.push(ticket);
  }

  addComment(ticket: any, text: string) {
    if (!text.trim() && !ticket.newCommentImage) return;

    if (!ticket.comments) {
      ticket.comments = [];
    }

    const newComment = {
      text: text.trim(),
      image: ticket.newCommentImage || null
    };

    ticket.comments.push(newComment);
    ticket.newCommentImage = null; // Reset uploaded image
  }

  onCommentImageSelected(event: any, ticket: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        ticket.newCommentImage = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }


  loadUsers() {
    if (this.currentUser.role === 'admin') {
      this.authService.getUsers().subscribe((data: any[]) => {
        this.users = data;
      });
    }
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

  logout() {
    this.authService.logout();
  }
}
