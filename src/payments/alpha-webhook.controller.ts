import { Body, Controller, Headers, HttpCode, Post, UnauthorizedException } from '@nestjs/common';
import { ApiHeader } from '@nestjs/swagger';
import { AlphaWebhook } from '../../vendor/alpha-pay';
import { OrdersRepository } from '../data/orders.repository';
import { TicketsRepository } from '../data/tickets.repository';
import { AlphaWebhookDto } from './alpha-webhook.dto';

@Controller('payments/alpha')
export class AlphaWebhookController {
  constructor(
    private readonly orders: OrdersRepository,
    private readonly tickets: TicketsRepository,
  ) {}

  @Post('webhook')
  @ApiHeader({
    name: 'alpha-signature',
    required: true,
    description: 'Firma HMAC-SHA256 del body con il segreto ALPHA_WEBHOOK_SECRET',
  })
  @HttpCode(200)
  handle(@Body() event: AlphaWebhookDto, @Headers('alpha-signature') signature?: string) {
    const secret = process.env.ALPHA_WEBHOOK_SECRET ?? 'whsec_tickethub';
    if (!signature || !AlphaWebhook.verify(event, signature, secret)) {
      throw new UnauthorizedException('firma non valida');
    }
    const order = this.orders.findByPaymentId(event.chargeId);
    if (!order) return { received: true, matched: false };
    if (event.type === 'charge.refunded') {
      order.status = 'refunded';
      for (const t of this.tickets.findByOrder(order.id)) {
        t.status = 'void';
        this.tickets.save(t);
      }
    } else if (event.type === 'charge.disputed') {
      order.status = 'disputed';
    }
    this.orders.save(order);
    return { received: true, matched: true };
  }
}
