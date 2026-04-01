import { UserRole } from '../config';

export interface AuthenticatedUser {
  username: string;
  role: UserRole;
}
