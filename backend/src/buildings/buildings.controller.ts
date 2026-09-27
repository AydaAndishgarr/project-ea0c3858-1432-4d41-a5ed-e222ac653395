import { Body, Controller, Delete, Param, Patch, Post } from '@nestjs/common';
import { Role } from '@prisma/client';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { JwtPayload } from '../auth/types/jwt-payload';
import { CreateBuildingDto, UpdateBuildingDto } from './dto/buildings.dto';
import { BuildingsService } from './buildings.service';

@Controller('buildings')
export class BuildingsController {
  constructor(private readonly buildings: BuildingsService) {}

  @Post()
  @Roles(Role.ADMIN)
  create(@Body() dto: CreateBuildingDto, @CurrentUser() user: JwtPayload) {
    return this.buildings.create(dto, user);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.MANAGER)
  update(@Param('id') id: string, @Body() dto: UpdateBuildingDto, @CurrentUser() user: JwtPayload) {
    return this.buildings.update(id, dto, user);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.buildings.remove(id, user);
  }
}
