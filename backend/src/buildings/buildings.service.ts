import { Injectable, NotFoundException } from '@nestjs/common';
import { PlanType, Role } from '@prisma/client';
import { JwtPayload } from '../auth/types/jwt-payload';
import { AccessService } from '../common/access/access.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBuildingDto, UpdateBuildingDto } from './dto/buildings.dto';

const PLAN_PRICE: Record<PlanType, number> = {
  BASIC: 2_400_000,
  PROFESSIONAL: 4_800_000,
  ENTERPRISE: 9_600_000,
};

@Injectable()
export class BuildingsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly access: AccessService,
  ) {}

  async create(dto: CreateBuildingDto, actor: JwtPayload) {
    const manager =
      (dto.managerId && (await this.prisma.user.findUnique({ where: { id: dto.managerId } }))) ||
      (await this.prisma.user.findFirst({ where: { role: Role.MANAGER, status: 'ACTIVE' } }));
    if (!manager) throw new NotFoundException('No manager available to assign');

    const plan = dto.plan ?? PlanType.BASIC;
    const building = await this.prisma.building.create({
      data: {
        name: dto.name,
        address: dto.address,
        type: dto.type,
        status: dto.status ?? 'ACTIVE',
        managerId: manager.id,
      },
    });

    await this.prisma.buildingMember.upsert({
      where: { buildingId_userId: { buildingId: building.id, userId: manager.id } },
      update: { role: 'MANAGER' },
      create: { buildingId: building.id, userId: manager.id, role: 'MANAGER' },
    });

    const now = new Date();
    const expires = new Date(now);
    expires.setFullYear(expires.getFullYear() + 1);
    await this.prisma.subscription.create({
      data: {
        buildingId: building.id,
        plan,
        priceToman: dto.priceToman ?? PLAN_PRICE[plan],
        startedAt: now,
        expiresAt: expires,
      },
    });

    await this.prisma.buildingSettings.create({
      data: {
        buildingId: building.id,
        baseChargeToman: 1_450_000,
        dueDay: 15,
        lateFeePercent: 2,
      },
    });

    void actor;
    return building;
  }

  async update(id: string, dto: UpdateBuildingDto, actor: JwtPayload) {
    await this.access.assertBuilding(actor, id);
    const { plan, ...rest } = dto;
    const building = await this.prisma.building.update({ where: { id }, data: rest });
    if (plan) {
      const latest = await this.prisma.subscription.findFirst({ where: { buildingId: id }, orderBy: { startedAt: 'desc' } });
      if (latest) {
        await this.prisma.subscription.update({
          where: { id: latest.id },
          data: { plan, priceToman: PLAN_PRICE[plan] },
        });
      }
    }
    return building;
  }

  async remove(id: string, actor: JwtPayload) {
    await this.access.assertBuilding(actor, id);
    await this.prisma.building.delete({ where: { id } });
    return { ok: true };
  }
}
