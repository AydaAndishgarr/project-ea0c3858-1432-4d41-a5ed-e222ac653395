import { hash } from 'bcryptjs';
import {
  BuildingMemberRole,
  BuildingType,
  OccupancyRole,
  PlanType,
  PrismaClient,
  RequestCategory,
  Role,
  UnitStatus,
  UserStatus,
  Weekday,
} from '@prisma/client';

const prisma = new PrismaClient();

function envOr(name: string, fallback: string): string {
  const value = process.env[name];
  return value && value.trim().length > 0 ? value : fallback;
}

async function main() {
  const password = envOr('SEED_DEMO_PASSWORD', 'Demo@12345');
  const passwordHash = await hash(password, 10);

  const adminEmail = envOr('SEED_ADMIN_EMAIL', 'admin@example.com');
  const managerEmail = envOr('SEED_MANAGER_EMAIL', 'manager@example.com');
  const residentEmail = envOr('SEED_RESIDENT_EMAIL', 'resident@example.com');
  const providerEmail = envOr('SEED_PROVIDER_EMAIL', 'provider@example.com');

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: { passwordHash, role: Role.ADMIN, status: UserStatus.ACTIVE },
    create: {
      email: adminEmail,
      phone: envOr('SEED_ADMIN_PHONE', '09120000000'),
      fullName: envOr('SEED_ADMIN_NAME', 'Demo Admin'),
      passwordHash,
      role: Role.ADMIN,
    },
  });

  const manager = await prisma.user.upsert({
    where: { email: managerEmail },
    update: { passwordHash, role: Role.MANAGER, status: UserStatus.ACTIVE },
    create: {
      email: managerEmail,
      phone: envOr('SEED_MANAGER_PHONE', '09123456789'),
      fullName: envOr('SEED_MANAGER_NAME', 'Demo Manager'),
      passwordHash,
      role: Role.MANAGER,
    },
  });

  const resident = await prisma.user.upsert({
    where: { email: residentEmail },
    update: { passwordHash, role: Role.RESIDENT, status: UserStatus.ACTIVE },
    create: {
      email: residentEmail,
      phone: envOr('SEED_RESIDENT_PHONE', '09121122334'),
      fullName: envOr('SEED_RESIDENT_NAME', 'Demo Resident'),
      passwordHash,
      role: Role.RESIDENT,
    },
  });

  const providerUser = await prisma.user.upsert({
    where: { email: providerEmail },
    update: { passwordHash, role: Role.PROVIDER, status: UserStatus.ACTIVE },
    create: {
      email: providerEmail,
      phone: envOr('SEED_PROVIDER_PHONE', '02188997766'),
      fullName: envOr('SEED_PROVIDER_NAME', 'Demo Provider'),
      passwordHash,
      role: Role.PROVIDER,
    },
  });

  const usedEmails = new Set([adminEmail, managerEmail, residentEmail, providerEmail]);
  const canonicalAccounts: Array<{ email: string; phone: string; fullName: string; role: Role }> = [
    { email: 'admin@example.com', phone: '09120001000', fullName: 'Demo Admin', role: Role.ADMIN },
    { email: 'manager@example.com', phone: '09120001001', fullName: 'Demo Manager', role: Role.MANAGER },
    { email: 'resident@example.com', phone: '09120001002', fullName: 'Demo Resident', role: Role.RESIDENT },
    { email: 'provider@example.com', phone: '09120001003', fullName: 'Demo Provider', role: Role.PROVIDER },
  ];
  for (const account of canonicalAccounts) {
    if (usedEmails.has(account.email)) continue;
    await prisma.user.upsert({
      where: { email: account.email },
      update: { passwordHash, role: account.role, status: UserStatus.ACTIVE },
      create: { ...account, passwordHash },
    });
  }

  const building = await prisma.building.upsert({
    where: { id: '11111111-1111-4111-8111-111111111111' },
    update: { managerId: manager.id, status: 'ACTIVE' },
    create: {
      id: '11111111-1111-4111-8111-111111111111',
      name: 'Demo Building',
      address: 'Tehran, Demo Street 1',
      type: BuildingType.RESIDENTIAL,
      managerId: manager.id,
    },
  });

  await prisma.buildingMember.upsert({
    where: { buildingId_userId: { buildingId: building.id, userId: manager.id } },
    update: { role: BuildingMemberRole.MANAGER },
    create: {
      buildingId: building.id,
      userId: manager.id,
      role: BuildingMemberRole.MANAGER,
    },
  });

  await prisma.buildingMember.upsert({
    where: { buildingId_userId: { buildingId: building.id, userId: resident.id } },
    update: { role: BuildingMemberRole.RESIDENT },
    create: {
      buildingId: building.id,
      userId: resident.id,
      role: BuildingMemberRole.RESIDENT,
    },
  });

  const unit = await prisma.unit.upsert({
    where: { buildingId_number: { buildingId: building.id, number: '101' } },
    update: { status: UnitStatus.OCCUPIED, peopleCount: 3 },
    create: {
      buildingId: building.id,
      number: '101',
      floor: 1,
      areaSqm: 96,
      peopleCount: 3,
      status: UnitStatus.OCCUPIED,
    },
  });

  const existingOccupancy = await prisma.unitOccupancy.findFirst({
    where: {
      unitId: unit.id,
      userId: resident.id,
      endedAt: null,
    },
  });
  if (!existingOccupancy) {
    await prisma.unitOccupancy.create({
      data: {
        unitId: unit.id,
        userId: resident.id,
        role: OccupancyRole.OWNER_OCCUPANT,
      },
    });
  }

  const existingSubscription = await prisma.subscription.findFirst({
    where: { buildingId: building.id },
  });
  if (!existingSubscription) {
    await prisma.subscription.create({
      data: {
        buildingId: building.id,
        plan: PlanType.PROFESSIONAL,
        priceToman: 4_800_000,
        startedAt: new Date('2026-03-21T00:00:00.000Z'),
        expiresAt: new Date('2027-03-20T00:00:00.000Z'),
      },
    });
  }

  await prisma.provider.upsert({
    where: { userId: providerUser.id },
    update: { specialty: RequestCategory.FACILITIES, status: UserStatus.ACTIVE },
    create: {
      userId: providerUser.id,
      specialty: RequestCategory.FACILITIES,
      ratingAvg: 0,
      jobsCount: 0,
    },
  });

  const provider = await prisma.provider.findUniqueOrThrow({
    where: { userId: providerUser.id },
  });

  const weekdays: Array<{ weekday: Weekday; fromTime: string; toTime: string; available: boolean }> = [
    { weekday: Weekday.SATURDAY, fromTime: '09:00', toTime: '17:00', available: true },
    { weekday: Weekday.SUNDAY, fromTime: '09:00', toTime: '17:00', available: true },
    { weekday: Weekday.MONDAY, fromTime: '12:00', toTime: '20:00', available: true },
    { weekday: Weekday.TUESDAY, fromTime: '09:00', toTime: '17:00', available: false },
    { weekday: Weekday.WEDNESDAY, fromTime: '09:00', toTime: '17:00', available: true },
    { weekday: Weekday.THURSDAY, fromTime: '09:00', toTime: '13:00', available: true },
    { weekday: Weekday.FRIDAY, fromTime: '00:00', toTime: '00:00', available: false },
  ];

  for (const slot of weekdays) {
    await prisma.workSlot.upsert({
      where: { providerId_weekday: { providerId: provider.id, weekday: slot.weekday } },
      update: slot,
      create: { providerId: provider.id, ...slot },
    });
  }

  await prisma.platformSettings.upsert({
    where: { key: 'default' },
    update: {},
    create: {
      key: 'default',
      platformName: 'Building Management System',
      supportPhone: '021-91002233',
      supportEmail: 'info@bms-demo.local',
    },
  });

  await prisma.buildingSettings.upsert({
    where: { buildingId: building.id },
    update: {},
    create: {
      buildingId: building.id,
      baseChargeToman: 1_450_000,
      dueDay: 15,
      lateFeePercent: 2,
    },
  });

  console.log('Seed completed. Demo users (password from SEED_DEMO_PASSWORD or Demo@12345):');
  console.log(`  admin     ${admin.email}`);
  console.log(`  manager   ${manager.email}`);
  console.log(`  resident  ${resident.email}`);
  console.log(`  provider  ${providerUser.email}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
