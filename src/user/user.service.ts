import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as argon2 from 'argon2';
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService
  ) { } 

  async create(payload: CreateUserDto) {
    const { email, userName, password, ...rest } = payload;
    payload.email = payload.email.toLowerCase()
    const user = await this.userRepository.findOne({ where: { email:email } });
    if(user){
      throw new ConflictException('user alredy exists')
    }
    const hashPassword =await argon2.hash(password)

    const userDetails = await this.userRepository.save({
       email,
       password: hashPassword,
       userName,
      ...rest
    })
const userPayload ={id:userDetails.id, email:userDetails.email}
return{
      userId: userDetails.id,
      userName: userDetails.userName,
      userEmail: userDetails.email,
  access_token: await this.jwtService.signAsync(userPayload),
}
  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
