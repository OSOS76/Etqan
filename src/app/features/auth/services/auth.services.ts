import { inject, Service } from '@angular/core';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { auth, db } from '../../../core/firebase';
import { doc, getDoc,  setDoc } from 'firebase/firestore';
import { User } from '../../../core/models/user.model';
import { UserService } from '../../../core/services/user-service';

@Service({})
export class AuthServices {
  saveUserData(uid: string, userData: User) {
    const userRef = doc(db, 'users', uid);
    return setDoc(userRef, userData);
  }

  register(email: string, password: string) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  login(email: string, password: string) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  async getUserData(uid: string): Promise<User | null> {
    const userRef = doc(db, 'users', uid);
    const userSnapshot = await getDoc(userRef);
    if (!userSnapshot.exists()) {
      return null;
    }

    return userSnapshot.data() as User;
  }

  private userService = inject(UserService);

  checkAuthState() {
    return onAuthStateChanged(auth, async (user) => {
      if (!user) {
        this.userService.user.set(null);
        return;
      }

      const userData = await this.getUserData(user.uid);

      this.userService.user.set(userData);
    });
  }

  logout() {
    return signOut(auth);
  }

  getCurrentUser(): Promise<import('firebase/auth').User | null> {
    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        unsubscribe();
        resolve(user);
      });
    });
  }
}
