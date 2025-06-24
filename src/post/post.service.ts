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

 async update(userId: string, updatePostDto: UpdatePostDto, postId: string) {
    const postToUpdate = await this.postRepository.findOne({ where: { id: postId } ,});
    if (!postToUpdate) {
      throw new NotFoundException('Post not found');
    }
    if (postToUpdate.authorId !== userId) {
      throw new NotFoundException('You are not authorized to update this post');
    }
  const updatepost= await this.postRepository.update(postId, updatePostDto);
  const updatedPost =await this.postRepository.findOne({where:{id:postId}})

  return updatedPost

  }

  async remove(id: string) {
    const result = await this.postRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Library record with ID ${id} not found`);
    }
    const newresult = await this.postRepository.delete(id)

    return {
      message: `Library record with ID ${id} deleted successfully`
    };
  }

}
