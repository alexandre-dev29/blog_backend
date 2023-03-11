import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaServiceMock } from '../prisma/__mock__/prisma.service';
import { UtilityService } from '../utility/utility.service';
import { UtilityServiceMock } from '../utility/__mock__/utility.service';
import { usersStub } from './test/stubs/users.stub';
import { Users } from '../generated/users';
import { UsersServiceMock } from './__mock__/users.service';

describe('UsersService', () => {
  let service: UsersService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: UsersService, useValue: UsersServiceMock },
        { provide: PrismaService, useValue: PrismaServiceMock },
        { provide: UtilityService, useValue: UtilityServiceMock },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Get All Users', () => {
    let users: Users[];
    beforeEach(async () => {
      users = await service.findAll();
    });

    test('then it should call users service', async () => {
      expect(jest.spyOn(service, 'findAll')).toHaveBeenCalled();
    });
    test('then it should return users', async () => {
      expect(users).toEqual([usersStub()]);
    });
  });
  describe('Get One User', () => {
    let users: Users;
    beforeEach(async () => {
      users = await service.findOne('1');
    });

    test('then it should call users service', async () => {
      expect(jest.spyOn(service, 'findOne')).toHaveBeenCalled();
    });

    test('then it should call users service with params', async () => {
      expect(jest.spyOn(service, 'findOne')).toHaveBeenCalledWith('1');
    });

    test('then it should return one user', async () => {
      expect(users).toEqual(usersStub());
    });
  });
});
