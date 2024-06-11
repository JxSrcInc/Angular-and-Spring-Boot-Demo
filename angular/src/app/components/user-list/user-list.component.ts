import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';
import { Router } from '@angular/router'; // Import Router
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

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit(): void {
    this.loadData();
  }

  ngAfterViewInit(): void {
    // Defer the initialization to make sure the paginator and sort are ready
    setTimeout(() => {
      console.log(this.paginator)
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
}
