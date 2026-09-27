import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common';
import { Role } from '@prisma/client';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtPayload } from '../auth/types/jwt-payload';
import { CreateResidentDto, UpdateUserDto } from './dto/users.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Patch(':id')
  @Roles(Role.ADMIN, Role.MANAGER)
  update(@Param('id') id: string, @Body() dto: UpdateUserDto, @CurrentUser() user: JwtPayload) {
    return this.users.update(id, dto, user);
  }

  @Post('residents')
  @Roles(Role.ADMIN, Role.MANAGER)
  createResident(@Body() dto: CreateResidentDto, @CurrentUser() user: JwtPayload) {
    return this.users.createResident(dto, user);
  }

  @Delete('residents/:id')
  @Roles(Role.ADMIN, Role.MANAGER)
  removeResident(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.users.removeResident(id, user);
  }
}
