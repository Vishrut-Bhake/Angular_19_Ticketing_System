import { Component } from '@angular/core';
import { TicketService } from '../../services/ticket.service';
import { AuthService } from '../../services/auth-service.service';

@Component({
  selector: 'app-create-task',
  standalone: false,
  templateUrl: './create-task.component.html',
  styleUrl: './create-task.component.css'
})
export class CreateTaskComponent {
  newTicket = { title: '', description: '', image: null as string | null };
  currentUser: any;
  tickets: any[] = [];
  constructor(private ticketService: TicketService, private authService: AuthService) {
    this.currentUser = this.authService.getCurrentUser();
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
}
