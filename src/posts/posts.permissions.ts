import { InferSubjects, Permissions } from 'nest-casl';
import { Role, SecurityActions } from '../../types';
import { Posts } from '../generated/posts';

export type Subject = InferSubjects<typeof Posts>;
export const postsPermissions: Permissions<Role, Subject, SecurityActions> = {
  Admin({ user, can }) {
    can(SecurityActions.manage, Posts);
  },
  Editor({ user, can }) {
    can(SecurityActions.update, Posts, { authorId: user.id });
    can(SecurityActions.delete, Posts, { authorId: user.id });
  },
};
