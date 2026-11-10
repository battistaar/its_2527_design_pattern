import { Module } from '@nestjs/common';
import { AlphaWebhookController } from './alpha-webhook.controller';
import { AlphaGateway } from './alpha-gateway';
import { AlphaPayClient } from '../../vendor/alpha-pay';
import { PAYMENT_GATEWAY } from './payment-gateway';

@Module({
  controllers: [AlphaWebhookController],
  providers: [
    {
      provide: PAYMENT_GATEWAY,
      useFactory: () => {
        const alpha = new AlphaPayClient(process.env.ALPHA_API_KEY ?? 'sk_test_tickethub');
        return new AlphaGateway(alpha);
      }
    }
  ],
  exports: [PAYMENT_GATEWAY]
})
export class PaymentsModule {}
