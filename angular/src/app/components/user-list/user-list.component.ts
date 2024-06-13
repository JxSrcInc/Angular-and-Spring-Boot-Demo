import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';
import { Router } from '@angular/router'; // Import Router
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['id', 'firstName', 'lastName', 'address', 'city', 'state', 'zip', 'phoneNumber', 'action'];
  dataSource = new MatTableDataSource<User>([]);
  errorMessage: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private userService: UserService, private router: Router, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.loadData();
  }

  ngAfterViewInit(): void {
    // Defer the initialization to make sure the paginator and sort are ready
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    },100);
  }

  loadData(): void {
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        // Move paginator and sort initialization here
        if (this.paginator && this.sort) {
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }
      },
      error: (err) => {
        this.errorMessage = 'An error occurred while fetching users.';
        console.error('Error fetching users', err);
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  editUser(user: User): void {
    this.router.navigate(['/user-form'], { state: { user } });
  }

  deleteUser(user: User): void {
    if (confirm(`Are you sure you want to delete user ${user.firstName} ${user.lastName}?`)) {
      this.userService.deleteUser(user.id!).subscribe({
        next: () => {
          this.snackBar.open('User deleted successfully', 'Close', {
            duration: 3000,
          });
          this.loadData(); // Refresh the data after deletion
        },
        error: (err) => {
          this.errorMessage = 'An error occurred while deleting the user.';
          console.error('Error deleting user', err);
        }
      });
    }
  }
}
