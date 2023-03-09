import { AuthorizableUser } from 'nest-casl';

export class UserSecurity implements AuthorizableUser<Role, string> {
  id: string;
  roles: Array<Role>;
  email: string;
  fullName: string;
}

export enum Role {
  Admin = 'Admin',
  User = 'Editor',
}
