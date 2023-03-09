import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PrismaService } from './prisma/prisma.service';
import { UtilityService } from './utility/utility.service';
import { Role, UserSecurity } from '../types';
import { CaslModule } from 'nest-casl';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    UsersModule,
    CaslModule.forRoot<Role, UserSecurity>({
      superuserRole: Role.Admin,
      getUserFromRequest: (request) => request.user,
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    PrismaService,
    UtilityService,
    JwtService,
    ConfigService,
  ],
})
export class AppModule {}
