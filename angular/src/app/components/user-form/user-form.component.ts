import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {
  user: User = {
    id: undefined,
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    phoneNumber: ''
  };
  isEditMode = false;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const userId = params.get('id');
      if (userId) {
        this.isEditMode = true;
        this.userService.getUserById(+userId).subscribe(user => {
          this.user = user;
        });
      } else if (history.state.user) {
        this.isEditMode = true;
        this.user = history.state.user;
      }
    });
  }

  saveUser(): void {
    if (this.isEditMode) {
      this.userService.updateUser(this.user.id!, this.user).subscribe(() => {
        this.router.navigate(['/users']);
      });
    } else {
      this.userService.createUser(this.user).subscribe(() => {
        this.router.navigate(['/users']);
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/users']);
  }
}
