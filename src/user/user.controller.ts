import { Controller, Get, Body, Patch, Param, Delete, UseGuards, Post, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/auth/guard/role';
import { RolesGuard } from 'src/auth/guard/role.guard';
import { UserRole } from '../auth/enum/user.role.enum';
import { Request } from 'express';

interface AuthenticatedRequest extends Request {
  user: {
    id: string; 
    email: string;
    role: UserRole; 
    isBlocked: boolean; 
  };
}



@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post('seed-admins')
  async seedAdmins() {
    return await this.userService.seedDefaultAdmins();
  }

  @UseGuards(AuthGuard(),RolesGuard)
  @Roles(UserRole.ADMIN, ) 
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOneById(id);
  }


  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch(':id/block')
  async updateBlockStatus(
    @Param('id') id: string) {
    return this.userService.blockUser(id);
  }

  @UseGuards(AuthGuard(), RolesGuard)
  @Roles(UserRole.ADMIN,)
  @Patch(':id/unblock')
  async updateUnBlockStatus(
    @Param('id') id: string) {
    return this.userService.unBlockUser(id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.userService.update(id, updateUserDto);
  // }


  @Patch(':id') 
  async update(
    @Param('id') userId: string, 
    @Body() updateUserDto: UpdateUserDto, 
  ) {
    return this.userService.update(userId, updateUserDto); // Removed currentUserId argument
  }


  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
