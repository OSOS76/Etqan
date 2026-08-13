import { Service } from '@angular/core';
import { addDoc, collection, doc, getDocs, query, where, deleteDoc } from 'firebase/firestore';
import { db } from '../../../core/firebase';
import { Group } from '../../../core/models/group.model';

@Service()
export class Addgroupservice {
  private courseCollection = collection(db, 'Groups');

  addGroup(group: Group) {
    return addDoc(this.courseCollection, group);
  }

  async getTeacherGroups(teacherId: string) {
    const q = query(this.courseCollection, where('teacherId', '==', teacherId));
    return await getDocs(q);
  }

  deleteGroup(id: string) {
    const GroupDoc = doc(db, 'Groups', id);
    return deleteDoc(GroupDoc)
  }
}
