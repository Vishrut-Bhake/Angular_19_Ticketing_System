import { Component, OnInit } from '@angular/core';
import { TicketService } from '../../services/ticket.service';
import { AuthService } from '../../services/auth-service.service';

interface Ticket {
  id: number;
  title: string;
  description: string;
  status: string;
  userId: number;
  username: string;
  comments: any[];
  showComments: boolean;
  fileUrl?: string;
}

@Component({
  selector: 'app-create-task',
  standalone: false,
  templateUrl: './create-task.component.html',
  styleUrl: './create-task.component.css'
})
export class CreateTaskComponent {
  currentUser: any;
  statuses: string[] = ['Discussion', 'In Progress', 'Test', 'Complete'];
  tickets: Ticket[] = [];
  newTaskTitle: string = '';
  newTaskDescription: string = '';
  newTaskStatus: string = 'Discussion';
  selectedFile: File | null = null;

  constructor(private ticketService: TicketService, private authService: AuthService) {
    this.currentUser = this.authService.getCurrentUser();
  }

  ngOnInit(): void {
    this.loadTickets();
  }

  loadTickets() {
    this.ticketService.getTickets().subscribe(
      (data) => {
        this.tickets = data;
      },
      (error) => {
        console.error('Error fetching tickets:', error);
      }
    );
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  createTicket() {
    if (!this.newTaskTitle.trim() || !this.newTaskDescription.trim()) {
      alert('Title and description are required.');
      return;
    }

    const newTicket: Ticket = {
      id: Math.floor(Math.random() * 10000), 
      title: this.newTaskTitle,
      description: this.newTaskDescription,
      status: this.newTaskStatus,
      userId: this.currentUser.id,
      username: this.currentUser.username,
      comments: [],
      showComments: false,
      fileUrl: this.selectedFile ? URL.createObjectURL(this.selectedFile) : undefined
    };

    this.ticketService.createTicket(newTicket).subscribe(() => {
      this.tickets.push(newTicket);
      this.newTaskTitle = '';
      this.newTaskDescription = '';
      this.newTaskStatus = 'Discussion';
      this.selectedFile = null;
    });
  }
}