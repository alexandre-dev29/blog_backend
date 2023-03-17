import { Users } from '../../../generated/users';
import { Role } from '@prisma/client';

export const usersStub = (): Users => {
  return {
    id: '1',
    username: 'alexandre',
    fullName: 'mwenze',
    email: 'axel.business29@gmail.com',
    createdAt: new Date(2022, 9, 30),
    updatedAt: new Date(2022, 9, 30),
    role: Role.Editor,
    password: '123456',
    phoneNumber: '+2438694746284',
    refreshToken: '',
    biography: 'i am a software engineer',
    Posts: [],
  };
};
