import { Service } from '@angular/core';
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../../core/firebase';
import { Course } from '../../../core/models/course.model';

@Service()
export class AddcourseService {
  private courseCollection = collection(db, 'courses');

  addCourse(course: Course) {
    return addDoc(this.courseCollection, course);
  }
  async getTeacherCourses(teacherId: string) {
    const q = query(this.courseCollection, where('teacherId', '==', teacherId));
    return await getDocs(q);
  }

  deleteCourse(id: string) {
    const courseDoc = doc(db, 'courses', id);
    return deleteDoc(courseDoc);
  }

  async getAllCourses() {
    return await getDocs(this.courseCollection);
  }
  async getCourseById(id: string) {
    const courseRef = doc(db, 'courses', id);

    return await getDoc(courseRef);
  }
}
