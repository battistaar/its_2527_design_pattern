import { Module } from '@nestjs/common';
import { NotificationsModule } from '../notifications/notifications.module';
import { TicketsModule } from '../tickets/tickets.module';
import { OrdersController } from './orders.controller';
import { PricingModule } from '../pricing/pricing.module';
import { InventoryModule } from '../inventory/inventory.module';
import { PaymentsModule } from '../payments/payments.module';

@Module({
  imports: [
    TicketsModule,
    NotificationsModule,
    PricingModule,
    InventoryModule,
    PaymentsModule
  ],
  controllers: [OrdersController]
})
export class OrdersModule {}
