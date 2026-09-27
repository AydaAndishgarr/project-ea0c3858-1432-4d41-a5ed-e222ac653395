import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Role } from '@prisma/client';
import { JwtPayload } from '../../auth/types/jwt-payload';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AccessService {
  constructor(private readonly prisma: PrismaService) {}

  async buildingIds(user: JwtPayload): Promise<string[] | 'all'> {
    if (user.role === Role.ADMIN) return 'all';

    if (user.role === Role.MANAGER) {
      const [managed, memberships] = await Promise.all([
        this.prisma.building.findMany({ where: { managerId: user.sub }, select: { id: true } }),
        this.prisma.buildingMember.findMany({ where: { userId: user.sub }, select: { buildingId: true } }),
      ]);
      return [...new Set([...managed.map((b) => b.id), ...memberships.map((m) => m.buildingId)])];
    }

    if (user.role === Role.RESIDENT) {
      const memberships = await this.prisma.buildingMember.findMany({
        where: { userId: user.sub },
        select: { buildingId: true },
      });
      return [...new Set(memberships.map((m) => m.buildingId))];
    }

    return [];
  }

  async assertBuilding(user: JwtPayload, buildingId: string) {
    const ids = await this.buildingIds(user);
    if (ids !== 'all' && !ids.includes(buildingId)) {
      throw new ForbiddenException('You do not have access to this building');
    }
  }

  async primaryBuildingId(user: JwtPayload): Promise<string | null> {
    const ids = await this.buildingIds(user);
    if (ids === 'all') {
      const first = await this.prisma.building.findFirst({ orderBy: { createdAt: 'asc' }, select: { id: true } });
      return first?.id ?? null;
    }
    return ids[0] ?? null;
  }

  async requireBuilding(id: string) {
    const building = await this.prisma.building.findUnique({ where: { id } });
    if (!building) throw new NotFoundException('Building not found');
    return building;
  }
}
