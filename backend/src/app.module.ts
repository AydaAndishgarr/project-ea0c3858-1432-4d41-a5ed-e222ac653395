import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { AnnouncementsModule } from './announcements/announcements.module';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { RolesGuard } from './auth/guards/roles.guard';
import { BuildingsModule } from './buildings/buildings.module';
import { ChargesModule } from './charges/charges.module';
import configuration, { validateEnv } from './common/config/configuration';
import { AllExceptionsFilter } from './common/filters/http-exception.filter';
import { PrismaExceptionFilter } from './common/filters/prisma-exception.filter';
import { HealthModule } from './common/health/health.module';
import { ExpensesModule } from './expenses/expenses.module';
import { NotificationsModule } from './notifications/notifications.module';
import { PaymentsModule } from './payments/payments.module';
import { PollsModule } from './polls/polls.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProvidersModule } from './providers/providers.module';
import { ReportsModule } from './reports/reports.module';
import { ReviewsModule } from './reviews/reviews.module';
import { ServiceRequestsModule } from './service-requests/service-requests.module';
import { SettlementsModule } from './settlements/settlements.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { SuggestionsModule } from './suggestions/suggestions.module';
import { UnitsModule } from './units/units.module';
import { UsersModule } from './users/users.module';
import { WorkSlotsModule } from './work-slots/work-slots.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [configuration],
      validate: validateEnv,
    }),
    PrismaModule,
    AuthModule,
    HealthModule,
    UsersModule,
    BuildingsModule,
    UnitsModule,
    ChargesModule,
    PaymentsModule,
    ExpensesModule,
    ServiceRequestsModule,
    AnnouncementsModule,
    PollsModule,
    SuggestionsModule,
    NotificationsModule,
    ProvidersModule,
    SubscriptionsModule,
    SettlementsModule,
    ReviewsModule,
    WorkSlotsModule,
    ReportsModule,
  ],
  providers: [
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
    { provide: APP_FILTER, useClass: PrismaExceptionFilter },
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}
