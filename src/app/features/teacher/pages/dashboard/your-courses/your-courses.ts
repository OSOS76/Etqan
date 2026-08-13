import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { AddCourse } from '../../../components/add-course/add-course';
import { AddcourseService } from '../../../services/addcourseservice';
import { AuthServices } from '../../../../auth/services/auth.services';
import { Course } from '../../../../../core/models/course.model';
import { Alerts } from '../../../../../core/utils/alerts';
import { AddGroup } from '../../../components/add-group/add-group';

@Component({
  selector: 'app-your-courses',
  imports: [RouterLink, AddCourse, AddGroup],
  templateUrl: './your-courses.html',
  styleUrl: './your-courses.scss',
})
export class YourCourses {
  selectedCourse: Course | null = null;
  isAddCourseOpen = false;

  private addCourseService = inject(AddcourseService);
  private authService = inject(AuthServices);

  courses: Course[] = [];
  async ngOnInit() {
    await this.loadCourses();
  }

  private cdr = inject(ChangeDetectorRef);

  async loadCourses() {
    const user = await this.authService.getCurrentUser();

    if (!user) return;

    const snapshot = await this.addCourseService.getTeacherCourses(user.uid);

    this.courses = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Course),
    }));
    this.cdr.detectChanges();
  }

  async deleteCourse(course: Course) {
    if (!course.id) {
      return;
    }
    await this.addCourseService.deleteCourse(course.id);
    this.courses = this.courses.filter((c) => c.id !== course.id);
    await this.loadCourses();
    Alerts.success('تم الحذف', 'تم حذف الكورس بنجاح');
  }
  editCourse(course: Course) {
    this.selectedCourse = course;
    this.isAddCourseOpen = true;
  }
}
