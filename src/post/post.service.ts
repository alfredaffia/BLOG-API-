import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class PostService {
  constructor(@InjectRepository(Post)
  private postRepository :Repository<Post>,
  private userService:UserService
){}

async createProfile(id:string, createPostDto:CreatePostDto){
  const user=await this.userService.findOneById(id)
  if(!user){
    throw new NotFoundException('user Does Not Exist')
  }
const newPost = await this.postRepository.save(createPostDto);
const post = await this.postRepository.create({
  ...createPostDto,
  user:user })
}

wa

  findAll() {
    return `This action returns all post`;
  }

  findOne(id: number) {
    return `This action returns a #${id} post`;
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
