import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) { }

  @Post('newpost/:id')
  create(@Param('id') id: string, @Body() createPostDto: CreatePostDto) {
    return this.postService.createPost(id, createPostDto);
  }

  @Get()
  @UseGuards(AuthGuard())
  findAll() {
    return this.postService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard())
  findOne(@Param('id') id: string) {
    return this.postService.findOne(id);
  }

  @UseGuards(AuthGuard())
  @Patch(':postId/:userId')
  update(@Param('userId') userId: string, @Param('postId') postId: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.update(userId, updatePostDto, postId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postService.remove(id);
  }
}
