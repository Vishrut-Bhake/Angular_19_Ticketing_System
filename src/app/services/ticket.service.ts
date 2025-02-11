import { HttpClient } from '@angular/common/http';
import { computed, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Signal, signal } from '@angular/core';

export interface Ticket {
  id: number;
  title: string;
  description: string;
  status: string;
  createdBy: string;
}

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private ticketsUrl = 'http://localhost:3000/tickets'; // Use JSON server
  // private ticketUrl ="/assets/tickets.json"
  constructor(private http: HttpClient) {}

  // // Fetch all tickets
  // getTickets(): Observable<any[]> {
  //   return this.http.get<any[]>(this.ticketsUrl);
  // }

  // // Update a ticket
  // updateTicket(ticketId: number, updatedTicket: any): Observable<any> {
  //   return this.http.put(`${this.ticketsUrl}/${ticketId}`, updatedTicket);
  // }
  
  // addTicket(ticket: any): Observable<any> {
  //   return this.http.post(this.ticketsUrl, ticket);
  // }


  // NEW 
  private tickets = signal<Ticket[]>([]);

  getTickets(): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(this.ticketsUrl);
  }

  addTicket(ticket: Ticket) {
    this.tickets.update((tickets) => [...tickets, ticket]);
  }

  getTicketsByUser(username: string): Signal<Ticket[]> {
    return computed(() => 
      this.tickets().filter(ticket => ticket.createdBy === username)
    );
  }

  getAllTickets(): Signal<Ticket[]> {
    return this.tickets;
  }

  updateTicketStatus(ticketId: number, newStatus: string) {
    this.tickets.update((tickets) =>
      tickets.map(ticket =>
        ticket.id === ticketId ? { ...ticket, status: newStatus } : ticket
      )
    );
  }
   // Update a ticket
  updateTicket(ticketId: number, updatedTicket: any): Observable<any> {
    return this.http.put(`${this.ticketsUrl}/${ticketId}`, updatedTicket);
  }
  
}
