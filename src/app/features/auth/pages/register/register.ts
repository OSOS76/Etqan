import { Component, inject, OnInit } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { passwordMatchValidator } from '../../../../core/validators/password-match.validator';
import { AuthServices } from '../../services/auth.services';
import { RouterLink, Router } from '@angular/router';
import { Alerts } from '../../../../core/utils/alerts';
import { User } from '../../../../core/models/user.model';
import { Breadcrumbs } from '../../../../core/shared/breadcrumbs/breadcrumbs';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink, Breadcrumbs],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  showPassword = false;
  showConfirmPassword = false;

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  private fb = inject(NonNullableFormBuilder);
  registerForm = this.fb.group(
    {
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{11}$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      role: ['student' as 'student' | 'teacher', Validators.required],

      subject: [''],
      bio: ['', Validators.minLength(10)],
      image: [''],
      experienceYears: [],
      grades: [[] as string[]],
    },
    {
      validators: passwordMatchValidator(),
    },
  );

  selectRole(role: 'student' | 'teacher') {
    this.registerForm.controls.role.setValue(role);
    this.updateRoleValidators(role);
  }
  private updateRoleValidators(role: 'student' | 'teacher') {
    const subject = this.registerForm.controls.subject;
    const bio = this.registerForm.controls.bio;
    const image = this.registerForm.controls.image;
    const experienceYears = this.registerForm.controls.experienceYears;
    const grads = this.registerForm.controls.grades;

    if (role === 'teacher') {
      subject.setValidators(Validators.required);

      bio.setValidators([Validators.required, Validators.minLength(10)]);

      image.setValidators(Validators.required);

      experienceYears.setValidators([Validators.required, Validators.min(0)]);

      grads.setValidators([Validators.required, Validators.minLength(1)]);
    } else {
      subject.clearValidators();
      bio.clearValidators();
      image.clearValidators();
      experienceYears.clearValidators();
      grads.clearValidators();
    }

    subject.updateValueAndValidity();
    bio.updateValueAndValidity();
    image.updateValueAndValidity();
    experienceYears.updateValueAndValidity();
    grads.updateValueAndValidity();
  }

  onGradeChange(grade: string, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    const currentGrades = this.registerForm.controls.grades.value as string[];

    if (checked) {
      this.registerForm.controls.grades.setValue([...currentGrades, grade]);
    } else {
      this.registerForm.controls.grades.setValue(currentGrades.filter((g) => g !== grade));
    }
    this.registerForm.controls.grades.markAsTouched();
  }

  isGradeChecked(grade: string): boolean {
    const currentGrades = this.registerForm.controls.grades.value as string[];
    return currentGrades.includes(grade);
  }

  private authServices = inject(AuthServices);
  private router = inject(Router);

  async register() {
    if (this.registerForm.invalid) {
      return;
    }
    try {
      const formValue = this.registerForm.getRawValue();

      const userCredential = await this.authServices.register(formValue.email, formValue.password);
      const userData: User = {
        name: formValue.name,
        email: formValue.email,
        phone: formValue.phone,
        role: formValue.role as 'student' | 'teacher',
        grades: formValue.grades,
      };
      if (formValue.role === 'teacher') {
        userData.subject = formValue.subject;
        userData.bio = formValue.bio;
        userData.image = formValue.image;
        userData.experienceYears = formValue.experienceYears;
        userData.grades = formValue.grades;
      }
      await this.authServices.saveUserData(userCredential.user.uid, userData);

      Alerts.success('تم إنشاء الحساب بنجاح', 'تم إنشاء الحساب بنجاح');
      this.router.navigate(['/login']);
    } catch (error: any) {
      switch (error.code) {
        case 'auth/email-already-in-use':
          Alerts.error('البريد الإلكتروني مستخدم', 'هذا البريد الإلكتروني مستخدم بالفعل.');
          break;

        case 'auth/invalid-email':
          Alerts.error('بريد إلكتروني غير صالح', 'يرجى إدخال بريد إلكتروني صحيح.');
          break;

        case 'auth/weak-password':
          Alerts.error('كلمة المرور ضعيفة', 'يجب أن تكون كلمة المرور 6 أحرف على الأقل.');
          break;

        default:
          Alerts.error('حدث خطأ', error.message);
      }
    }
  }
}
