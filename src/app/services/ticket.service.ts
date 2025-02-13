import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Comment } from '../components/models';

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

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private apiUrl = 'http://localhost:3000/tickets'; // JSON Server URL

  constructor(private http: HttpClient) {}
  createTicket(ticket: any): Observable<any> {
    return this.http.post(this.apiUrl, ticket);
  }
  
  getTickets(): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(this.apiUrl);
  }
  

  updateTicket(id: number, p0: { comments: Comment[]; }, ticket: Ticket): Observable<Ticket> {
    return this.http.put<Ticket>(`${this.apiUrl}/${ticket.id}`, ticket);
  }

  deleteTicket(ticketId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/tickets/${ticketId}`);
  }

  restoreTicket(ticket: Ticket): Observable<Ticket> {
    return this.http.post<Ticket>(`${this.apiUrl}/tickets`, ticket);
  }

  getRemovedTickets(): Observable<Ticket[]> {
    return this.http.get<Ticket[]>(`${this.apiUrl}/removedTickets`);
  }

  deleteComment(ticketId: number, commentIndex: number, username: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/tickets/${ticketId}/comments/${commentIndex}`, {
      body: { username }
    });
  }


}
