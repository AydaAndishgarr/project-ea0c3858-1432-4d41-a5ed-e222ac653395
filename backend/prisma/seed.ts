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

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required seed environment variable: ${name}`);
  }
  return value;
}

async function main() {
  const password = requiredEnv('SEED_DEMO_PASSWORD');
  const passwordHash = await hash(password, 10);

  const admin = await prisma.user.upsert({
    where: { email: requiredEnv('SEED_ADMIN_EMAIL') },
    update: { passwordHash, role: Role.ADMIN, status: UserStatus.ACTIVE },
    create: {
      email: requiredEnv('SEED_ADMIN_EMAIL'),
      phone: requiredEnv('SEED_ADMIN_PHONE'),
      fullName: requiredEnv('SEED_ADMIN_NAME'),
      passwordHash,
      role: Role.ADMIN,
    },
  });

  const manager = await prisma.user.upsert({
    where: { email: requiredEnv('SEED_MANAGER_EMAIL') },
    update: { passwordHash, role: Role.MANAGER, status: UserStatus.ACTIVE },
    create: {
      email: requiredEnv('SEED_MANAGER_EMAIL'),
      phone: requiredEnv('SEED_MANAGER_PHONE'),
      fullName: requiredEnv('SEED_MANAGER_NAME'),
      passwordHash,
      role: Role.MANAGER,
    },
  });

  const resident = await prisma.user.upsert({
    where: { email: requiredEnv('SEED_RESIDENT_EMAIL') },
    update: { passwordHash, role: Role.RESIDENT, status: UserStatus.ACTIVE },
    create: {
      email: requiredEnv('SEED_RESIDENT_EMAIL'),
      phone: requiredEnv('SEED_RESIDENT_PHONE'),
      fullName: requiredEnv('SEED_RESIDENT_NAME'),
      passwordHash,
      role: Role.RESIDENT,
    },
  });

  const providerUser = await prisma.user.upsert({
    where: { email: requiredEnv('SEED_PROVIDER_EMAIL') },
    update: { passwordHash, role: Role.PROVIDER, status: UserStatus.ACTIVE },
    create: {
      email: requiredEnv('SEED_PROVIDER_EMAIL'),
      phone: requiredEnv('SEED_PROVIDER_PHONE'),
      fullName: requiredEnv('SEED_PROVIDER_NAME'),
      passwordHash,
      role: Role.PROVIDER,
    },
  });

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

  console.log('Seed completed. Demo users (password from SEED_DEMO_PASSWORD):');
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
