import { Component, inject, input, output } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AddcourseService } from '../../services/addcourseservice';
import { Router } from '@angular/router';
import { Timestamp } from 'firebase/firestore';
import { Course } from '../../../../core/models/course.model';
import { Alerts } from '../../../../core/utils/alerts';
import { UserService } from '../../../../core/services/user-service';
import { AuthServices } from '../../../auth/services/auth.services';
import { YourCourses } from '../../pages/dashboard/your-courses/your-courses';

@Component({
  selector: 'app-add-course',
  imports: [ReactiveFormsModule],
  templateUrl: './add-course.html',
  styleUrl: './add-course.scss',
})
export class AddCourse {
  closeModal = output<void>();
  course = input<Course | null>(null);
  ngOnInit() {
    if (this.course()) {
      this.courseForm.patchValue({
        title: this.course()!.title,
        description: this.course()!.description,
        price: this.course()!.price,
        subject: this.course()!.subject,
        grade: this.course()!.grade,
      });
    }
  }

  close() {
    this.closeModal.emit();
  }

  private fb = inject(NonNullableFormBuilder);

  courseForm = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(4)]],
    description: ['', [Validators.required, Validators.minLength(10)]],
    price: [0, [Validators.required]],
    subject: ['', [Validators.required]],
    createdAt: [Timestamp.now()],
    teacherId: [''],
    grade: ['', [Validators.required]],
  });

  private addCourseService = inject(AddcourseService);
  private authServices = inject(AuthServices);
  private yourCourses = inject(YourCourses);

  async addCourse() {
    if (this.courseForm.invalid) {
      return;
    }
    try {
      const formValue = this.courseForm.getRawValue();
      // const courseCredential = await this.addCourseService.addCourse(formValue);
      // const useruid = await this.authServices.getCurrentUser().then((user) => user?.uid || '');
      const firebaseUser = await this.authServices.getCurrentUser();

      const courseUserData: Course = {
        title: formValue.title,
        description: formValue.description,
        price: formValue.price,
        subject: formValue.subject,
        createdAt: formValue.createdAt,
        teacherId: firebaseUser!.uid,
        grade: formValue.grade,
      };

      await this.addCourseService.addCourse(courseUserData);

      if (this.course()) {
        // تعديل
        Alerts.success('تم تعديل الكورس بنجاح', 'تم حفظ التعديلات بنجاح');
      } else {
        // إضافة
        Alerts.success('تم إنشاء الكورس بنجاح', 'تم إنشاء الكورس بنجاح');
      }
      this.closeModal.emit();
      this.yourCourses.loadCourses();
    } catch (error) {
      console.error('Error adding course:', error);
    }
  }
}
