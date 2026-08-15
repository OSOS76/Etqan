import { Component, inject } from '@angular/core';
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
      experienceYears: [0],
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

    if (role === 'teacher') {
      subject.setValidators(Validators.required);

      bio.setValidators([Validators.required, Validators.minLength(10)]);

      image.setValidators(Validators.required);
      experienceYears.setValidators([Validators.required, Validators.min(0)]);

    } else {
      subject.clearValidators();
      bio.clearValidators();
      image.clearValidators();
      experienceYears.clearValidators();
    }

    subject.updateValueAndValidity();
    bio.updateValueAndValidity();
    image.updateValueAndValidity();
    experienceYears.updateValueAndValidity();
  }

  private authServices = inject(AuthServices);
  private router = inject(Router);

  async register() {
    if (this.registerForm.invalid) {
      return;
    }
    try {
      // const { name, email, phone, password, role } = this.registerForm.value
      const formValue = this.registerForm.getRawValue();

      const userCredential = await this.authServices.register(formValue.email, formValue.password);
      const userData: User = {
        name: formValue.name,
        email: formValue.email,
        phone: formValue.phone,
        role: formValue.role as 'student' | 'teacher',
      };
      if (formValue.role === 'teacher') {
        userData.subject = formValue.subject;
        userData.bio = formValue.bio;
        userData.image = formValue.image;
        userData.experienceYears = formValue.experienceYears;
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
