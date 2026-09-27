import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtPayload } from '../auth/types/jwt-payload';
import { AccessService } from '../common/access/access.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUnitDto, UpdateUnitDto } from './dto/units.dto';

@Injectable()
export class UnitsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly access: AccessService,
  ) {}

  async create(dto: CreateUnitDto, actor: JwtPayload) {
    await this.access.assertBuilding(actor, dto.buildingId);
    return this.prisma.unit.create({
      data: {
        buildingId: dto.buildingId,
        number: dto.number,
        floor: dto.floor,
        areaSqm: dto.areaSqm,
        peopleCount: dto.peopleCount ?? 0,
        status: dto.status ?? 'VACANT',
      },
    });
  }

  async update(id: string, dto: UpdateUnitDto, actor: JwtPayload) {
    const unit = await this.prisma.unit.findUnique({ where: { id } });
    if (!unit) throw new NotFoundException('Unit not found');
    await this.access.assertBuilding(actor, unit.buildingId);
    return this.prisma.unit.update({ where: { id }, data: dto });
  }

  async remove(id: string, actor: JwtPayload) {
    const unit = await this.prisma.unit.findUnique({ where: { id } });
    if (!unit) throw new NotFoundException('Unit not found');
    await this.access.assertBuilding(actor, unit.buildingId);
    await this.prisma.unit.delete({ where: { id } });
    return { ok: true };
  }
}
