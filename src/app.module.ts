import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { PostModule } from './post/post.module';
import { CommentModule } from './comment/comment.module';
import { CategoryModule } from './category/category.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [UserModule, PostModule, CommentModule, CategoryModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
