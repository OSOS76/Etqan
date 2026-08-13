import { Component, inject, input, output } from '@angular/core';
import { Group } from '../../../../core/models/group.model';
import { NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Timestamp } from 'firebase/firestore';
import { Addgroupservice } from '../../services/addgroupservice';
import { AuthServices } from '../../../auth/services/auth.services';
import { Groups } from '../../pages/dashboard/groups/groups';
import { AddcourseService } from '../../services/addcourseservice';
import { Course } from '../../../../core/models/course.model';
import { Alerts } from '../../../../core/utils/alerts';

@Component({
  selector: 'app-add-group',
  imports: [ReactiveFormsModule],
  templateUrl: './add-group.html',
  styleUrl: './add-group.scss',
})
export class AddGroup {
  closeModal = output<void>();
  groups = input<Group | null>(null);
  courses = input<Course[]>([]);
  private Groups = inject(Groups);

  close() {
    this.closeModal.emit();
  }

  private fb = inject(NonNullableFormBuilder);
  groupform = this.fb.group({
    name: [''],
    courseId: [''],
    teacherId: [''],
    maxStudents: [0],
    schedule: [''],
    location: [''],
    createdAt: [Timestamp.now()],
  });

  private addGroupService = inject(Addgroupservice);
  private authServises = inject(AuthServices);

  ngOnInit() {
    console.log('courses:', this.courses());
    if (this.groups()) {
      this.groupform.patchValue({
        courseId: this.groups()!.courseId,
        name: this.groups()!.name,
        maxStudents: this.groups()!.maxStudents,
        schedule: this.groups()!.schedule,
        location: this.groups()!.location,
      });
    }
    console.log('FORM:', this.groupform.getRawValue());
  }
  async addGroup() {
    if (this.groupform.invalid) return;

    try {
      const formValue = this.groupform.getRawValue();
      const firebaseUser = await this.authServises.getCurrentUser();

      if (!firebaseUser) {
        return;
      }
      const GroupUserData: Group = {
        name: formValue.name,
        maxStudents: formValue.maxStudents,
        schedule: formValue.schedule,
        createdAt: formValue.createdAt,
        teacherId: firebaseUser.uid,
        location: formValue.location,
        courseId: formValue.courseId,
      };

      await this.addGroupService.addGroup(GroupUserData);
      Alerts.success('تم إنشاء الكورس بنجاح', 'تم إنشاء الكورس بنجاح');
      this.closeModal.emit();
      this.Groups.loadGroup()
    } catch (error) {
      console.error('Error adding course:', error);
    }
  }
}
