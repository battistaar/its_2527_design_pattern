import { Module } from '@nestjs/common';
import { DataModule } from './data/data.module';
import { EventsModule } from './events/events.module';
import { GatesModule } from './gates/gates.module';
import { HealthController } from './health.controller';
import { ImportsModule } from './imports/imports.module';
import { NotificationsModule } from './notifications/notifications.module';
import { OrdersModule } from './orders/orders.module';
import { PaymentsModule } from './payments/payments.module';
import { ReportsModule } from './reports/reports.module';
import { TicketsModule } from './tickets/tickets.module';
import { VenuesModule } from './venues/venues.module';

@Module({
  imports: [
    DataModule,
    NotificationsModule,
    EventsModule,
    VenuesModule,
    TicketsModule,
    OrdersModule,
    PaymentsModule,
    ReportsModule,
    GatesModule,
    ImportsModule,
  ],
  controllers: [HealthController]
})
export class AppModule {}
