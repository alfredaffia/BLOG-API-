import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import * as dotenv from 'dotenv'
import { Post } from 'src/post/entities/post.entity';
dotenv.config()

@Module({
  imports:[
    TypeOrmModule.forFeature([User]),

    JwtModule.register({
      global:true,
      secret:process.env.JWTSECRET,
      signOptions:{expiresIn: '1h'}
    }),
    PassportModule.register({
      defaultStrategy:'jwt',
      session:true,
    })
  ],
  controllers: [UserController],
  providers: [UserService,],
})
export class UserModule {}
