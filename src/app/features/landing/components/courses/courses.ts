import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { AddCourse } from '../../../teacher/components/add-course/add-course';
import { AddcourseService } from '../../../teacher/services/addcourseservice';
import { Course } from '../../../../core/models/course.model';
import { AuthServices } from '../../../auth/services/auth.services';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-courses',
  imports: [RouterLink],
  templateUrl: './courses.html',
  styleUrl: './courses.scss',
})
export class Courses {
  coursesServices = inject(AddcourseService);
  private authService = inject(AuthServices);

  courses: Course[] = [];

  private cdr = inject(ChangeDetectorRef);
  teacherNames: { [key: string]: string } = {};


  async ngOnInit() {

    const snapshot = await this.coursesServices.getAllCourses();
    this.courses = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Course),
    }));
    for (const course of this.courses) {
      if (!course.teacherId) continue;

      const teacher = await this.authService.getUserData(course.teacherId);

      if (teacher) {
        this.teacherNames[course.teacherId] = teacher.name;
      }
      this.cdr.detectChanges();
    }
  }
}
