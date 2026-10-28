import { Module } from '@nestjs/common';
import { NotificationsModule } from '../notifications/notifications.module';
import { TicketsModule } from '../tickets/tickets.module';
import { OrdersController } from './orders.controller';
import { PricingModule } from '../pricing/pricing.module';

@Module({
  imports: [TicketsModule, NotificationsModule, PricingModule],
  controllers: [OrdersController]
})
export class OrdersModule {}
