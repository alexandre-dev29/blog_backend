import { InferSubjects, Permissions } from 'nest-casl';
import { Users } from '../generated/users';
import { Role, SecurityActions } from '../../types';

export type Subject = InferSubjects<typeof Users>;
export const userPermissions: Permissions<Role, Subject, SecurityActions> = {
  Admin({ user, can }) {
    can(SecurityActions.manage, Users);
  },
  Editor({ user, can }) {
    can(SecurityActions.update, Users, { id: user.id });
    can(SecurityActions.readOne, Users, { id: user.id });
  },
};
