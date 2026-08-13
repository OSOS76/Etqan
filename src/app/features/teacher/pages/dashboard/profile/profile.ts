import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { AuthServices } from '../../../../auth/services/auth.services';
import { User } from '../../../../../core/models/user.model';
import { FormsModule, NgModel } from '@angular/forms';
import { Alerts } from '../../../../../core/utils/alerts';

@Component({
  selector: 'app-profile',
  imports: [FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile {
  private authService = inject(AuthServices);

  user: User | null = null;

  isEditing = false;
  private cdr = inject(ChangeDetectorRef);

  editData = {
    name: '',
    phone: '',
  };
  startEditing() {
    if (!this.user) return;

    this.editData = {
      name: this.user.name,
      phone: this.user.phone,
    };
    this.isEditing = true;
  }

  async saveChanges() {
    if (!this.user) return;

    try {
      const fireBaseUser = await this.authService.getCurrentUser();
      if (!fireBaseUser) {
        return;
      }

      const updatedUser: User = {
        ...this.user,
        name: this.editData.name,
        phone: this.editData.phone,
      };

      await this.authService.saveUserData(fireBaseUser.uid, updatedUser);
      this.user = updatedUser;
      Alerts.success('تم تحديث البيانت بنجاح ', 'تم تحديث بيانتك بنجاح');
      this.isEditing = false;
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  }

  async ngOnInit() {
    const fireBaseUser = await this.authService.getCurrentUser();
    if (!fireBaseUser) {
      return;
    }

    this.user = await this.authService.getUserData(fireBaseUser.uid);
    this.cdr.detectChanges();

    console.log('PROFILE USER:', this.user);
  }
}
