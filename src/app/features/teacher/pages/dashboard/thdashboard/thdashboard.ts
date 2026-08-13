import { Component, inject } from '@angular/core';
import { UserService } from '../../../../../core/services/user-service';
import { TopNavbar } from '../../../../student/components/top-navbar/top-navbar';
import { AddCourse } from '../../../components/add-course/add-course';
import { Sidebar } from "../../../components/sidebar/sidebar";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-thdashboard',
  imports: [TopNavbar, AddCourse, Sidebar, RouterOutlet],
  templateUrl: './thdashboard.html',
  styleUrl: './thdashboard.scss',
})
export class Thdashboard {
  private userService = inject(UserService);
  user = this.userService.user;

  constructor() {
  }
}
