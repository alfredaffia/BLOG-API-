import { ConflictException, HttpException, Injectable, NotFoundException, Res, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';


@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService
  ) { }
  async findAll() {
    const AllUsers = await this.userRepository.find()
    if(!AllUsers){
      'no saved user'
    }
    return AllUsers;
  }

  async findOne (id:string){
    const user = await this.userRepository.findOne({
      where: { id: id },
      relations: ['posts']
    });
    if (!user){
      throw new NotFoundException('user not found')
    }
    return user;
  }


  async findOneById(id: string,) {
    const user = await this.userRepository.findOneBy({ id: id },);
    return user
  }

    async blockUser(id: string): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.isBlocked = true;
    await this.userRepository.save(user);

    return { message: `User with ID ${id} has been blocked.` };
  }

  async unBlockUser(id: string): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.isBlocked = false;
    await this.userRepository.save(user);

    return { message: `User with ID ${id} has been unblocked.` };
  }

  
  async update(id: string, updateUserDto: UpdateUserDto) {
    const newUpdate = await this.userRepository.findOne({where:{ id }})
    if (!newUpdate) {
      throw new NotFoundException('user not found')
    }

    const updateUser = await this.userRepository.update(id, updateUserDto)
    const updatedUser = await this.userRepository.findOne({where:{id}})
    return{
      statusCode :200,
      message: 'user updated successfully',
      data:updatedUser
    }
  }

  async remove(id: string) {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Library record with ID ${id} not found`);
    }
    const newresult = await this.userRepository.delete(id)

    return {
      message: `Library record with ID ${id} deleted successfully`
    };
  }
}
