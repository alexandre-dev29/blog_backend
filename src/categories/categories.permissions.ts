import { InferSubjects, Permissions } from 'nest-casl';
import { Role, SecurityActions } from '../../types';
import { Categories } from '../generated/categories';

export type Subject = InferSubjects<typeof Categories>;
export const categoryPermissions: Permissions<Role, Subject, SecurityActions> =
  {
    Admin({ user, can }) {
      can(SecurityActions.manage, Categories);
    },
  };
