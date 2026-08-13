import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AddcourseService } from '../../../teacher/services/addcourseservice';
import { AuthServices } from '../../../auth/services/auth.services';
import { Course } from '../../../../core/models/course.model';

@Component({
  selector: 'app-course-details',
  imports: [],
  templateUrl: './course-details.html',
  styleUrl: './course-details.scss',
})
export class CourseDetails {

  private route = inject(ActivatedRoute);
  private courseService = inject(AddcourseService);
  private authService = inject(AuthServices);
  private cdr = inject(ChangeDetectorRef);

  course: Course | null = null;
  teacherName = '';

async ngOnInit() {
  const courseId = this.route.snapshot.paramMap.get('id');


  if (!courseId) {
    return;
  }

  const snapshot = await this.courseService.getCourseById(courseId);


  if (!snapshot.exists()) {
    return;
  }

  this.course = {
    id: snapshot.id,
    ...(snapshot.data() as Course),
  };


  if (this.course.teacherId) {
    const teacher = await this.authService.getUserData(this.course.teacherId);


    if (teacher) {
      this.teacherName = teacher.name;
    }
  }

  this.cdr.detectChanges();
}
}
