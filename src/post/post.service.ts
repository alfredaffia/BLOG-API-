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
  private postRepository: Repository<Post>,
    private userService: UserService
  ) { }

  async createPost(id: string, createPostDto: CreatePostDto) {
    const user = await this.userService.findOneById(id)

    if (!user) {
      throw new NotFoundException('user Does Not Exist')
    }
    const newPost = this.postRepository.create({
      ...createPostDto,
      // user: user, // Associate the post with the user
      authorId: user.id,
    });
    const savedPost = await this.postRepository.save(newPost);

    return savedPost;
  }


  findAll() {
    const allPosts = this.postRepository.find()
    if (!allPosts) {
      throw new NotFoundException('No posts found');
    }
    return allPosts;
  }

  async findOne(id: string) {
    const post = await this.postRepository.findOne({ where: { id: id } });
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    // Optionally, you can remove the check for post.id since if post is null, the above exception is thrown
    return post;
  }

  update(id: number, updatePostDto: UpdatePostDto) {
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }

}
