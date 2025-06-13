import { Controller, Get, Body, Patch, Param, Delete, UseGuards} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from 'src/auth/guard/role';
import { RolesGuard } from 'src/auth/guard/role.guard';
import { UserRole } from '../auth/enum/user.role.enum';


@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}


  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOneById(id);
  }

  @UseGuards(AuthGuard(),RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch(':id/block')
  async updateBlockStatus(
    @Param('id') id: string) {
    return this.userService.blockUser(id);
  }

  @UseGuards(AuthGuard(),RolesGuard)
  @Roles(UserRole.ADMIN,UserRole.SUPERADMIN) 
  @Patch(':id/unblock')
  async updateUnBlockStatus(
    @Param('id') id: string) {
    return this.userService.unBlockUser(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
