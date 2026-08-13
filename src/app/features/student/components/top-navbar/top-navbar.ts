import { Component, inject } from '@angular/core';
import { UserService } from '../../../../core/services/user-service';
import { AuthServices } from '../../../auth/services/auth.services';
import { Router } from '@angular/router';
import { Alerts } from '../../../../core/utils/alerts';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-top-navbar',
  imports: [TitleCasePipe],
  templateUrl: './top-navbar.html',
  styleUrl: './top-navbar.scss',
})
export class TopNavbar {
  private userService = inject(UserService);
  user = this.userService.user;

}
