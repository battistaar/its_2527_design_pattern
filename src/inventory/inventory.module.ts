import { Module } from "@nestjs/common";
import { SeatInventory } from "./seat-inventory";

@Module({
    providers: [SeatInventory],
    exports: [SeatInventory]
})
export class InventoryModule {}