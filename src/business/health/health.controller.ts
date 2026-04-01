import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { HealthV1ResponseDto } from './dto/health-v1-response.dto';
import { HealthV2ResponseDto } from './dto/health-v2-response.dto';
import { HealthService } from './health.service';

@ApiTags('health')
@Controller('/health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get('v1')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Basic service health check' })
  @ApiOkResponse({
    description: 'Service is alive',
    type: HealthV1ResponseDto,
  })
  check(): HealthV1ResponseDto {
    return this.healthService.getStatus();
  }

  @Get('v2')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Health check including database connectivity' })
  @ApiOkResponse({
    description: 'Detailed health status',
    type: HealthV2ResponseDto,
  })
  async checkV2(): Promise<HealthV2ResponseDto> {
    return this.healthService.getStatusV2();
  }
}
