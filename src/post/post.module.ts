import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { UserModule } from 'src/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Post } from './entities/post.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports:[UserModule,
    TypeOrmModule.forFeature([Post]),
    AuthModule,
  ],
  
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
