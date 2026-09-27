import { Injectable } from '@nestjs/common';
import { Prisma, Role } from '@prisma/client';
import { JwtPayload } from '../auth/types/jwt-payload';
import { AccessService } from '../common/access/access.service';
import {
  buildingStatusFa,
  buildingTypeFa,
  chargeStatusFa,
  chargeTypeFa,
  expenseCategoryFa,
  expenseStatusFa,
  notificationAudienceFa,
  notificationTypeFa,
  occupancyFa,
  paymentMethodFa,
  paymentStatusFa,
  planFa,
  requestCategoryFa,
  requestPriorityFa,
  requestStatusFa,
  roleToUi,
  settlementStatusFa,
  subscriptionStatusFa,
  suggestionStatusFa,
  toFaDate,
  unitStatusFa,
  userStatusFa,
  weekdayFa,
} from '../common/locale/fa-map';
import { PrismaService } from '../prisma/prisma.service';

const MONTHS = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'];

@Injectable()
export class BootstrapService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly access: AccessService,
  ) {}

  async snapshot(user: JwtPayload) {
    const buildingFilter = await this.buildingWhere(user);

    const [
      me,
      buildings,
      users,
      subscriptions,
      units,
      occupancies,
      charges,
      payments,
      expenses,
      requests,
      providers,
      announcements,
      polls,
      suggestions,
      notifications,
      settlements,
      reviews,
      workSlots,
      platformSettings,
    ] = await Promise.all([
      this.prisma.user.findUniqueOrThrow({ where: { id: user.sub } }),
      this.prisma.building.findMany({
        where: buildingFilter,
        include: { _count: { select: { units: true, members: true } }, subscriptions: { orderBy: { startedAt: 'desc' }, take: 1 } },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.findMany({
        include: { memberships: { include: { building: true } }, provider: true },
        orderBy: { fullName: 'asc' },
      }),
      this.prisma.subscription.findMany({
        where: buildingFilter ? { building: buildingFilter } : undefined,
        include: { building: true },
        orderBy: { expiresAt: 'desc' },
      }),
      this.prisma.unit.findMany({
        where: buildingFilter ? { building: buildingFilter } : undefined,
        include: { occupancies: { where: { endedAt: null }, include: { user: true } }, charges: { select: { status: true, amountToman: true } } },
        orderBy: [{ floor: 'asc' }, { number: 'asc' }],
      }),
      this.prisma.unitOccupancy.findMany({
        where: { endedAt: null, ...(buildingFilter ? { unit: buildingFilter } : {}) },
        include: { user: true, unit: true },
      }),
      this.prisma.charge.findMany({
        where: this.chargeWhere(user, buildingFilter),
        include: { billedUser: true, unit: true },
        orderBy: { dueDate: 'desc' },
      }),
      this.prisma.payment.findMany({
        where: this.paymentWhere(user, buildingFilter),
        include: { payer: true, charge: { include: { unit: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.expense.findMany({
        where: buildingFilter ? { building: buildingFilter } : undefined,
        orderBy: { incurredAt: 'desc' },
      }),
      this.prisma.serviceRequest.findMany({
        where: this.requestWhere(user, buildingFilter),
        include: {
          requester: true,
          provider: { include: { user: true } },
          unit: true,
          building: true,
          events: { orderBy: { createdAt: 'asc' } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.provider.findMany({ include: { user: true } }),
      this.prisma.announcement.findMany({
        where: buildingFilter ? { building: buildingFilter } : undefined,
        include: { author: true },
        orderBy: [{ pinned: 'desc' }, { createdAt: 'desc' }],
      }),
      this.prisma.poll.findMany({
        where: buildingFilter ? { building: buildingFilter } : undefined,
        include: { options: { include: { _count: { select: { votes: true } } }, orderBy: { sortOrder: 'asc' } }, votes: true },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.suggestion.findMany({
        where: buildingFilter ? { building: buildingFilter } : undefined,
        include: { author: true, _count: { select: { likes: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.notification.findMany({
        where: { userId: user.sub },
        orderBy: { createdAt: 'desc' },
        take: 100,
      }),
      this.prisma.settlement.findMany({
        where: user.role === Role.PROVIDER ? { provider: { userId: user.sub } } : user.role === Role.ADMIN ? {} : { providerId: { in: [] } },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.review.findMany({
        where: user.role === Role.PROVIDER ? { provider: { userId: user.sub } } : {},
        include: { author: true },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.workSlot.findMany({
        where: user.role === Role.PROVIDER ? { provider: { userId: user.sub } } : {},
        orderBy: { weekday: 'asc' },
      }),
      this.prisma.platformSettings.findUnique({ where: { key: 'default' } }),
    ]);

    const myProvider = providers.find((p) => p.userId === user.sub);
    const myOccupancy = occupancies.find((o) => o.userId === user.sub);
    const primaryBuilding =
      buildings.find((b) => b.managerId === user.sub) ??
      buildings.find((b) => b.id === myOccupancy?.unit.buildingId) ??
      buildings[0];

    const buildingSettings = primaryBuilding
      ? await this.prisma.buildingSettings.findUnique({ where: { buildingId: primaryBuilding.id } })
      : null;

    const managers = users
      .filter((u) => u.role === Role.MANAGER)
      .map((u) => {
        const managed = buildings.find((b) => b.managerId === u.id) ?? u.memberships[0]?.building;
        return {
          id: u.id,
          name: u.fullName,
          phone: u.phone,
          email: u.email,
          buildingId: managed?.id ?? '',
          status: userStatusFa[u.status],
          joinedAt: toFaDate(u.createdAt),
        };
      });

    const debtByUser = new Map<string, number>();
    for (const charge of charges) {
      if (charge.status !== 'PAID') {
        debtByUser.set(charge.billedUserId, (debtByUser.get(charge.billedUserId) ?? 0) + charge.amountToman);
      }
    }

    const residents = occupancies.map((o) => ({
      id: o.user.id,
      name: o.user.fullName,
      phone: o.user.phone,
      type: occupancyFa[o.role],
      unitNumber: o.unit.number,
      status: userStatusFa[o.user.status],
      debt: debtByUser.get(o.user.id) ?? 0,
      email: o.user.email,
    }));

    const uniqueResidents = [...new Map(residents.map((r) => [r.id + r.unitNumber, r])).values()];

    const mappedUnits = units.map((u) => {
      const owner = u.occupancies.find((o) => o.role === 'OWNER' || o.role === 'OWNER_OCCUPANT');
      const tenant = u.occupancies.find((o) => o.role === 'TENANT');
      const unpaid = u.charges.filter((c) => c.status !== 'PAID').reduce((s, c) => s + c.amountToman, 0);
      return {
        id: u.id,
        number: u.number,
        floor: u.floor,
        area: u.areaSqm,
        ownerId: owner?.userId ?? null,
        tenantId: tenant?.userId ?? null,
        peopleCount: u.peopleCount,
        paymentStatus: unpaid > 0 ? 'بدهکار' : 'تسویه',
        status: unitStatusFa[u.status],
      };
    });

    const context = {
      buildingId: primaryBuilding?.id ?? null,
      buildingName: primaryBuilding?.name ?? '',
      unitNumber: myOccupancy?.unit.number ?? null,
      unitId: myOccupancy?.unitId ?? null,
      providerId: myProvider?.id ?? null,
    };

    return {
      user: {
        id: me.id,
        email: me.email,
        phone: me.phone,
        fullName: me.fullName,
        role: roleToUi[me.role],
      },
      context,
      buildings: buildings.map((b) => ({
        id: b.id,
        name: b.name,
        address: b.address,
        units: b._count.units,
        residents: b._count.members,
        managerId: b.managerId,
        status: buildingStatusFa[b.status],
        createdAt: toFaDate(b.createdAt),
        type: buildingTypeFa[b.type],
        plan: b.subscriptions[0] ? planFa[b.subscriptions[0].plan] : 'پایه',
      })),
      managers,
      users: (user.role === Role.ADMIN ? users : users.filter((u) => this.visibleUser(u, buildingFilter, buildings))).map(
        (u) => ({
          id: u.id,
          name: u.fullName,
          phone: u.phone,
          role: roleToUi[u.role],
          building: u.memberships[0]?.building.name ?? (u.role === Role.PROVIDER ? 'چند ساختمان' : '—'),
          status: userStatusFa[u.status],
          lastSeen: toFaDate(u.lastSeenAt),
        }),
      ),
      subscriptions: subscriptions.map((s) => ({
        id: s.id,
        buildingName: s.building.name,
        plan: planFa[s.plan],
        price: s.priceToman,
        startedAt: toFaDate(s.startedAt),
        expiresAt: toFaDate(s.expiresAt),
        status: subscriptionStatusFa[s.status],
      })),
      units: mappedUnits,
      residents: uniqueResidents,
      charges: charges.map((c) => ({
        id: c.id,
        title: c.title,
        type: chargeTypeFa[c.type],
        unitNumber: c.unit.number,
        residentName: c.billedUser.fullName,
        amount: c.amountToman,
        createdAt: toFaDate(c.createdAt),
        dueDate: toFaDate(c.dueDate),
        status: chargeStatusFa[c.status],
      })),
      payments: payments.map((p) => ({
        id: p.id,
        residentName: p.payer.fullName,
        unitNumber: p.charge.unit.number,
        amount: p.amountToman,
        date: toFaDate(p.paidAt ?? p.createdAt),
        method: paymentMethodFa[p.method],
        status: paymentStatusFa[p.status],
        receipt: p.receiptRef ?? '—',
        chargeTitle: p.charge.title,
      })),
      expenses: expenses.map((e) => ({
        id: e.id,
        title: e.title,
        category: expenseCategoryFa[e.category],
        amount: e.amountToman,
        date: toFaDate(e.incurredAt),
        description: e.description,
        status: expenseStatusFa[e.status],
      })),
      requests: requests.map((r) => ({
        id: r.id,
        title: r.title,
        category: requestCategoryFa[r.category],
        description: r.description,
        priority: requestPriorityFa[r.priority],
        preferredTime: r.preferredTime ?? '',
        providerId: r.providerId,
        providerName: r.provider?.user.fullName ?? 'تعیین نشده',
        requesterName: r.requester.fullName,
        unitNumber: r.unit?.number ?? '—',
        buildingName: r.building.name,
        createdAt: toFaDate(r.createdAt),
        status: requestStatusFa[r.status],
        amount: r.amountToman,
        timeline: r.events.map((ev) => ({ at: toFaDate(ev.createdAt), label: ev.note ?? ev.type })),
      })),
      providers: providers.map((p) => ({
        id: p.id,
        name: p.user.fullName,
        specialty: requestCategoryFa[p.specialty],
        phone: p.user.phone,
        rating: Number(p.ratingAvg),
        jobs: p.jobsCount,
        status: userStatusFa[p.status],
      })),
      announcements: announcements.map((a) => ({
        id: a.id,
        title: a.title,
        body: a.body,
        date: toFaDate(a.createdAt),
        author: a.author.fullName,
        pinned: a.pinned,
      })),
      polls: polls.map((p) => ({
        id: p.id,
        question: p.question,
        description: p.description,
        createdAt: toFaDate(p.createdAt),
        options: p.options.map((o) => ({ id: o.id, label: o.label, votes: o._count.votes })),
        votedOption: p.votes.find((v) => v.userId === user.sub)?.optionId ?? null,
        closed: p.closed,
      })),
      suggestions: suggestions.map((s) => ({
        id: s.id,
        title: s.title,
        body: s.body,
        author: s.author.fullName,
        date: toFaDate(s.createdAt),
        status: suggestionStatusFa[s.status],
        likes: s._count.likes,
      })),
      notifications: notifications.map((n) => ({
        id: n.id,
        type: notificationTypeFa[n.type],
        title: n.title,
        body: n.body,
        date: toFaDate(n.createdAt),
        read: n.isRead,
        audience: notificationAudienceFa[n.audience],
      })),
      settlements: settlements.map((s) => ({
        id: s.id,
        date: toFaDate(s.settledAt ?? s.createdAt),
        amount: s.amountToman,
        commission: s.commissionToman,
        status: settlementStatusFa[s.status],
      })),
      reviews: reviews.map((r) => ({
        id: r.id,
        author: r.author.fullName,
        rating: r.rating,
        comment: r.comment,
        date: toFaDate(r.createdAt),
      })),
      workSlots: workSlots.map((w) => ({
        id: w.id,
        day: weekdayFa[w.weekday],
        from: w.fromTime,
        to: w.toTime,
        available: w.available,
      })),
      charts: this.charts(buildings.length, payments, expenses, subscriptions),
      platformSettings: platformSettings
        ? {
            platformName: platformSettings.platformName,
            supportPhone: platformSettings.supportPhone,
            supportEmail: platformSettings.supportEmail,
            currency: platformSettings.currency === 'RIAL' ? 'ریال' : 'تومان',
            emailNotificationsEnabled: platformSettings.emailNotificationsEnabled,
            smsNotificationsEnabled: platformSettings.smsNotificationsEnabled,
            autoRenewReminderEnabled: platformSettings.autoRenewReminderEnabled,
          }
        : null,
      buildingSettings: buildingSettings
        ? {
            baseChargeToman: buildingSettings.baseChargeToman,
            dueDay: buildingSettings.dueDay,
            lateFeePercent: Number(buildingSettings.lateFeePercent),
            currency: buildingSettings.currency === 'RIAL' ? 'ریال' : 'تومان',
            smsReminderEnabled: buildingSettings.smsReminderEnabled,
            pushReminderEnabled: buildingSettings.pushReminderEnabled,
            autoIssueEnabled: buildingSettings.autoIssueEnabled,
            debtAlertEnabled: buildingSettings.debtAlertEnabled,
          }
        : null,
    };
  }

  private async buildingWhere(user: JwtPayload): Promise<Prisma.BuildingWhereInput | undefined> {
    const ids = await this.access.buildingIds(user);
    if (ids === 'all') return undefined;
    return { id: { in: ids } };
  }

  private chargeWhere(user: JwtPayload, buildingFilter: Prisma.BuildingWhereInput | undefined): Prisma.ChargeWhereInput {
    if (user.role === Role.RESIDENT) return { billedUserId: user.sub };
    if (buildingFilter) return { building: buildingFilter };
    return {};
  }

  private paymentWhere(user: JwtPayload, buildingFilter: Prisma.BuildingWhereInput | undefined): Prisma.PaymentWhereInput {
    if (user.role === Role.RESIDENT) return { payerUserId: user.sub };
    if (buildingFilter) return { charge: { building: buildingFilter } };
    return {};
  }

  private requestWhere(user: JwtPayload, buildingFilter: Prisma.BuildingWhereInput | undefined): Prisma.ServiceRequestWhereInput {
    if (user.role === Role.RESIDENT) return { requesterId: user.sub };
    if (user.role === Role.PROVIDER) return { provider: { userId: user.sub } };
    if (buildingFilter) return { building: buildingFilter };
    return {};
  }

  private visibleUser(
    u: { role: Role; memberships: { buildingId: string }[] },
    buildingFilter: Prisma.BuildingWhereInput | undefined,
    buildings: { id: string }[],
  ) {
    if (!buildingFilter) return true;
    const ids = new Set(buildings.map((b) => b.id));
    return u.memberships.some((m) => ids.has(m.buildingId)) || u.role === Role.PROVIDER || u.role === Role.ADMIN;
  }

  private charts(
    buildingCount: number,
    payments: { amountToman: number; status: string; paidAt: Date | null; createdAt: Date }[],
    expenses: { amountToman: number; incurredAt: Date }[],
    subscriptions: { priceToman: number; status: string }[],
  ) {
    const revenueSeries = MONTHS.slice(0, 6).map((month, i) => ({
      month,
      درآمد: Math.round(
        payments
          .filter((p) => p.status === 'SUCCESS' && (p.paidAt ?? p.createdAt).getMonth() === (i + 2) % 12)
          .reduce((s, p) => s + p.amountToman, 0) / 1_000_000,
      ),
      هزینه: Math.round(
        expenses.filter((e) => e.incurredAt.getMonth() === (i + 2) % 12).reduce((s, e) => s + e.amountToman, 0) / 1_000_000,
      ),
    }));

    const buildingGrowth = MONTHS.slice(0, 6).map((month, i) => ({
      month,
      ساختمان: Math.max(1, Math.round((buildingCount * (i + 1)) / 6)),
    }));

    const activeSubRevenue = subscriptions.filter((s) => s.status === 'ACTIVE').reduce((s, x) => s + x.priceToman, 0);
    const platformRevenue = MONTHS.slice(0, 6).map((month, i) => ({
      month,
      درآمد: Math.round((activeSubRevenue * (0.6 + i * 0.08)) / 1_000_000),
    }));

    return { revenueSeries, buildingGrowth, platformRevenue };
  }
}
