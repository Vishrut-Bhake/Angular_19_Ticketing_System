import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { UserService } from './services/user.service';
import { AdminPanelComponent } from './components/admin-panel/admin-panel.component';
import { KanbanBoardComponent } from './components/kanban-board/kanban-board.component';
import { TicketService } from './services/ticket.service';
import { AuthService } from './services/auth-service.service';
import { AppNavbarComponent } from './shared/app-navbar/app-navbar.component';
import { CreateTaskComponent } from './components/create-task/create-task.component';
import { UsersComponent } from './components/users/users.component';
import { FilterPipe } from "./services/filter.pipe";
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DragDropModule } from '@angular/cdk/drag-drop';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AdminPanelComponent,
    KanbanBoardComponent,
    AppNavbarComponent,
    CreateTaskComponent,
    UsersComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MatTableModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    DragDropModule, // CDK Drag and Drop
    FormsModule,
    FilterPipe
],
  providers: [UserService,TicketService,AuthService, provideAnimationsAsync()],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
