import { Service, signal } from '@angular/core';
import { User } from '../models/user.model';

@Service()
export class UserService {
    user = signal<User | null>(null)
}
