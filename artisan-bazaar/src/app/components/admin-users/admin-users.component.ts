import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.css']
})
export class AdminUsersComponent implements OnInit {
  users: User[] = [];
  currentUser: User | null = null;

  constructor(private authService: AuthService, private userService: UserService) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
    
    this.userService.getUsers().subscribe(users => {
      this.users = users;
    });
  }

  getUsersByRole(role: string): User[] {
    return this.users.filter(user => user.role === role);
  }

  toggleUserStatus(user: User): void {
    // In a real app, this would make an API call
    console.log('Toggling user status for:', user.email);
  }

  deleteUser(user: User): void {
    // In a real app, this would make an API call
    console.log('Deleting user:', user.email);
  }
}
