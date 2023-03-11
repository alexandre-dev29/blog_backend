import { jest } from '@jest/globals';
import { Users } from '../../generated/users';
import { usersStub } from '../test/stubs/users.stub';

export const UsersServiceMock = {
  create: jest.fn<() => Promise<Users>>().mockResolvedValue(usersStub()),

  findAll: jest.fn<() => Promise<Users[]>>().mockResolvedValue([usersStub()]),

  findOne: jest.fn<() => Promise<Users>>().mockResolvedValue(usersStub()),

  update: jest.fn<() => Promise<Users>>().mockResolvedValue(usersStub()),

  remove: jest.fn<() => Promise<Users>>().mockResolvedValue(usersStub()),
};
