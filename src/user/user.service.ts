import { ConflictException, HttpException, Injectable, Res } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import {  Response } from 'express';
import * as argon2 from 'argon2';
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


    async verifyPassword(hashedPassword: string, plainPassword: string,): Promise<boolean> {
    try {
      return await argon2.verify(hashedPassword, plainPassword);
    } catch (err) {
      console.log(err.message)
      return false;
    }
  }
    async signIn(payload: LoginDto, @Res() res: Response) {
    const { email, password } = payload;
    // const user = await this.userRepo.findOne({where:{email:email}  })
    const user = await this.userRepository.createQueryBuilder("user").addSelect("user.password").where("user.email = :email", { email: payload.email }).getOne()

    // console.log('Fetched User:', user);

    if (!user) {
      throw new HttpException('No email found', 400)
    }
    // if (user.IsBlocked === true) {
    //   throw new ForbiddenException('your Accoount have been blocked' );
    // }
    const checkedPassword = await this.verifyPassword(user.password, password);
    if (!checkedPassword) {
      throw new HttpException('password incorrect', 400)
    }
    const token = await this.jwtService.signAsync({
      email: user.email,
      id: user.id
    });

    res.cookie('isAuthenticated', token, {
      httpOnly: true,
      maxAge: 1 * 60 * 60 * 1000
    });
    // delete user.password
    return res.send({
      success: true,
      userToken: token

    })
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
