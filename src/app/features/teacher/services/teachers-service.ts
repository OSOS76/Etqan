import { Service, signal } from '@angular/core';
import { User } from '../../../core/models/user.model';
import { collection, doc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../../core/firebase';

@Service()
export class TeachersService {
  teachers = signal<User[]>([]);

  async getTeachers() {
    const userRef = collection(db, 'users');

    const q = query(userRef, where('role', '==', 'teacher'));

    const snapshot = await getDocs(q);

    const teachers = snapshot.docs.map((doc) => ({
      ...(doc.data() as User),
    }));
    this.teachers.set(teachers);
  }
}
