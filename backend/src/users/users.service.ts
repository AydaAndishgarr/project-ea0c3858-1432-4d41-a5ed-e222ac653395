import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { hash } from 'bcryptjs';
import { randomBytes } from 'crypto';
import { Role } from '@prisma/client';
import { JwtPayload } from '../auth/types/jwt-payload';
import { AccessService } from '../common/access/access.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateResidentDto, UpdateUserDto } from './dto/users.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly access: AccessService,
  ) {}

  async update(id: string, dto: UpdateUserDto, actor: JwtPayload) {
    if (actor.role !== Role.ADMIN && actor.sub !== id) {
      if (!(actor.role === Role.MANAGER && dto.status !== undefined && Object.keys(dto).length <= 3)) {
        // managers may update contact fields of residents in their building via dedicated endpoint
      }
    }
    if (actor.role !== Role.ADMIN && actor.sub !== id && actor.role !== Role.MANAGER) {
      throw new NotFoundException();
    }
    const data: Record<string, unknown> = { ...dto };
    if (dto.password) {
      data.passwordHash = await hash(dto.password, 10);
      delete data.password;
    }
    if (dto.email) data.email = dto.email.toLowerCase();
    return this.prisma.user.update({ where: { id }, data });
  }

  async createResident(dto: CreateResidentDto, actor: JwtPayload) {
    const unit = await this.prisma.unit.findUnique({ where: { id: dto.unitId } });
    if (!unit) throw new NotFoundException('Unit not found');
    await this.access.assertBuilding(actor, unit.buildingId);

    const email = (dto.email ?? `${dto.phone.replace(/\D/g, '')}@demo.local`).toLowerCase();
    const existing = await this.prisma.user.findFirst({
      where: { OR: [{ email }, { phone: dto.phone }] },
    });
    if (existing) throw new ConflictException('A user with this email or phone already exists');

    const passwordHash = await hash(randomBytes(12).toString('hex'), 10);
    const user = await this.prisma.user.create({
      data: {
        email,
        phone: dto.phone,
        fullName: dto.fullName,
        passwordHash,
        role: Role.RESIDENT,
        status: dto.status ?? 'ACTIVE',
      },
    });

    await this.prisma.buildingMember.upsert({
      where: { buildingId_userId: { buildingId: unit.buildingId, userId: user.id } },
      update: {},
      create: { buildingId: unit.buildingId, userId: user.id, role: 'RESIDENT' },
    });

    await this.prisma.unitOccupancy.create({
      data: { unitId: unit.id, userId: user.id, role: dto.occupancyRole },
    });

    await this.prisma.unit.update({
      where: { id: unit.id },
      data: { status: 'OCCUPIED', peopleCount: { increment: 1 } },
    });

    return user;
  }

  async removeResident(id: string, actor: JwtPayload) {
    const occupancy = await this.prisma.unitOccupancy.findFirst({
      where: { userId: id, endedAt: null },
      include: { unit: true },
    });
    if (!occupancy) throw new NotFoundException('Resident occupancy not found');
    await this.access.assertBuilding(actor, occupancy.unit.buildingId);
    await this.prisma.unitOccupancy.update({ where: { id: occupancy.id }, data: { endedAt: new Date() } });
    await this.prisma.buildingMember.deleteMany({ where: { userId: id, buildingId: occupancy.unit.buildingId } });
    return { ok: true };
  }
}
