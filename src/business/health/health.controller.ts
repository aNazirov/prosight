import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';

import { HealthService } from './health.service';

@Controller('/health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get('v1')
  @HttpCode(HttpStatus.OK)
  check(): { status: string; timestamp: number } {
    return this.healthService.getStatus();
  }

  @Get('v2')
  @HttpCode(HttpStatus.OK)
  async checkV2(): Promise<{
    status: string;
    message: string;
    timestamp: number;
  }> {
    return this.healthService.getStatusV2();
  }
}
