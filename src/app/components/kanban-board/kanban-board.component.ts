import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { TicketService } from '../../services/ticket.service';
import { AuthService } from '../../services/auth-service.service';
import { Ticket } from '../models';
@Component({
  selector: 'app-kanban-board',
  templateUrl: './kanban-board.component.html',
  styleUrls: ['./kanban-board.component.css'],
  standalone: false,
})

export class KanbanBoardComponent implements OnInit {
  tickets: any[] = [];
  removedTickets: any[] = [];
  currentUser: any;
  users: any[] = [];
  ticketMap: { [key: string]: any[] } = {
    'Discussion': [],
    'In Progress': [],
    'Test': [],
    'Complete': []
  };
  statuses = ['Discussion', 'In Progress', 'Test', 'Complete'];
  newTaskTitle = '';
  newTaskStatus = this.statuses[0];
  selectedFile: File | null = null;
  tasks: Ticket[] = [
    {
      id: 1, title: 'Design Homepage', status: 'Discussion', comments: [], showComments: false,
      userId: 1,
      description: 'is open',
      username: 'admin',
    },
    {
      id: 2, title: 'API Development', status: 'In Progress', comments: [], showComments: false,
      userId: 2,
      description: 'in progress',
      username: 'user',

    },
    {
      id: 3, title: 'Write Test Cases', status: 'Test', comments: [], showComments: false,
      userId: 3,
      description: 'in testing',
      username: 'tester',

    },
  ];

  newTicket = { title: '', description: '', image: null as string | null };
  constructor(private ticketService: TicketService, private authService: AuthService) {
    this.currentUser = this.authService.getCurrentUser();
  }
  ngOnInit(): void {
    this.loadTickets();
    this.loadUsers(); 
  }

  loadTickets() {
    this.ticketService.getTickets().subscribe((data: any[]) => {
      this.tickets = this.currentUser.role === 'admin' || this.currentUser.role === 'user' ? data : data.filter(ticket => ticket.userId === this.currentUser.id);
    });
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


  loadUsers() {
    if (this.currentUser.role === 'admin') {
      this.authService.getUsers().subscribe((data: any[]) => {
        this.users = data;
      });
    }
  }

  // Edit user role
  editUser(user: any) {
    const newRole = prompt(`Edit role for ${user.ownerId}: (admin/user)`, user.role);
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


  getTasksByStatus(status: string): Ticket[] {
    return this.tasks.filter(task => task.status === status);
  }

  drop(event: CdkDragDrop<Ticket[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const movedTask = event.previousContainer.data[event.previousIndex]; 
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
      movedTask.status = event.container.id; 
      this.tasks = [...this.tasks];
    }
  }


  toggleComments(task: Ticket) {
    task.showComments = !task.showComments;
  }

  addComment(task: Ticket, commentText: string) {
    if (commentText.trim()) {
      task.comments.push({
        text: commentText, image: null,
        createdBy: '',
        description: '',
        userID: 0
      });
    }
  }


  deleteComment(ticketId: number, commentIndex: number) {
    const ticket = this.tickets.find(ticket => ticket.id === ticketId);
    if (ticket) {
      if (ticket.comments[commentIndex].createdBy === this.currentUser.username) {
        this.ticketService.deleteComment(ticketId, commentIndex, this.currentUser.username).subscribe(() => {
          ticket.comments.splice(commentIndex, 1);
        });
      } else {
        alert('You can only delete your own comments.');
      }
    }
  }


  onCommentImageSelected(event: any, task: Ticket) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        task.comments.push({
          text: 'Image Uploaded',
          image: e.target.result,
          createdBy: this.currentUser.username,
          userID: this.currentUser.id,
          description: ''
        });
      };
      reader.readAsDataURL(file);
    }
  }

  deleteTicket(task: Ticket) {
    this.tasks = this.tasks.filter(t => t.id !== task.id);
    this.removedTickets.push({ ...task, removedBy: this.currentUser.ownerId });
  }

  restoreTicket(ticket: any) {
    this.removedTickets = this.removedTickets.filter(t => t.id !== ticket.id);
    const restoredTicket = { ...ticket };
    delete restoredTicket.removedBy;
    this.tasks.push(restoredTicket);
  }

}

