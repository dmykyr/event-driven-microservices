import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health')
  getHealth() {
    return this.appService.getHealth();
  }

  @Post('webhooks')
  handleWebhook(@Body() payload: Event) {
    console.log('Webhook received:');
    console.log('Payload:', JSON.stringify(payload, null, 2));
    console.log('-------------------');

    return {
      success: true,
      message: 'Webhook received',
      timestamp: new Date().toISOString()
    };
  }
}
