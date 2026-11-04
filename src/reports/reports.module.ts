import { Module } from '@nestjs/common';
import { ReportsController } from './reports.controller';
import { InventoryModule } from '../inventory/inventory.module';

@Module({
  imports: [InventoryModule],
  controllers: [ReportsController],
})
export class ReportsModule {}
