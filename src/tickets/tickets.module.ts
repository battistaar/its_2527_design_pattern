import { Module } from '@nestjs/common';
import { TicketsController } from './tickets.controller';
import { TicketsService } from './tickets.service';
import { TICKET_FORMATS, ticketFormats } from './ticket-formats';

@Module({
  controllers: [TicketsController],
  providers: [
    TicketsService,
    {
      provide: TICKET_FORMATS,
      useFactory: ticketFormats
    }
  ],
  exports: [TicketsService],
})
export class TicketsModule {}
