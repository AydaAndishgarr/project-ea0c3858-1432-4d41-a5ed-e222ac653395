import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtPayload } from '../auth/types/jwt-payload';
import { AccessService } from '../common/access/access.service';
import { parseFlexibleDate } from '../common/parse-date';
import { PrismaService } from '../prisma/prisma.service';
import { CreateChargeDto, UpdateChargeDto } from './dto/charges.dto';

@Injectable()
export class ChargesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly access: AccessService,
  ) {}

  async create(dto: CreateChargeDto, actor: JwtPayload) {
    const unit = await this.prisma.unit.findUnique({
      where: { id: dto.unitId },
      include: { occupancies: { where: { endedAt: null } } },
    });
    if (!unit) throw new NotFoundException('Unit not found');
    await this.access.assertBuilding(actor, unit.buildingId);
    const billedUserId = dto.billedUserId ?? unit.occupancies[0]?.userId;
    if (!billedUserId) throw new NotFoundException('No occupant to bill');

    const charge = await this.prisma.charge.create({
      data: {
        buildingId: unit.buildingId,
        unitId: unit.id,
        billedUserId,
        title: dto.title,
        type: dto.type,
        amountToman: dto.amountToman,
        dueDate: parseFlexibleDate(dto.dueDate),
      },
    });

    await this.prisma.notification.create({
      data: {
        userId: billedUserId,
        buildingId: unit.buildingId,
        type: 'CHARGE',
        audience: 'RESIDENT',
        title: 'شارژ جدید صادر شد',
        body: dto.title,
      },
    });
    return charge;
  }

  async update(id: string, dto: UpdateChargeDto, actor: JwtPayload) {
    const charge = await this.prisma.charge.findUnique({ where: { id } });
    if (!charge) throw new NotFoundException('Charge not found');
    await this.access.assertBuilding(actor, charge.buildingId);
    return this.prisma.charge.update({
      where: { id },
      data: {
        ...dto,
        dueDate: dto.dueDate ? parseFlexibleDate(dto.dueDate) : undefined,
      },
    });
  }

  async remove(id: string, actor: JwtPayload) {
    const charge = await this.prisma.charge.findUnique({ where: { id } });
    if (!charge) throw new NotFoundException('Charge not found');
    await this.access.assertBuilding(actor, charge.buildingId);
    await this.prisma.charge.delete({ where: { id } });
    return { ok: true };
  }
}
