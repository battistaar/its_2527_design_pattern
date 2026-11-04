import { Module } from '@nestjs/common';
import { VenuesController } from './venues.controller';
import { InventoryModule } from '../inventory/inventory.module';

@Module({
  imports: [InventoryModule],
  controllers: [VenuesController],
})
export class VenuesModule {}
