import { Controller, Get, NotFoundException, Param, Query, Res } from '@nestjs/common';
import type { Response } from 'express';
import { TicketsRepository } from '../data/tickets.repository';
import { TicketsService } from './tickets.service';

@Controller('tickets')
export class TicketsController {
  constructor(
    private readonly tickets: TicketsRepository,
    private readonly ticketsSrv: TicketsService
  ) {}

  @Get(':id/download')
  download(@Param('id') id: string, @Query('format') format: string = 'html', @Res() res: Response) {
    const ticket = this.tickets.findById(id);
    if (!ticket) throw new NotFoundException('biglietto non trovato');
    
    const file = this.ticketsSrv.download(ticket, format);

    res.setHeader('Content-Type', file.contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${file.filename}"`);
    res.send(file.body);
  }
}
