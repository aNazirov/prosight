import { ApiProperty } from '@nestjs/swagger';

export class HealthV2ResponseDto {
  @ApiProperty({ example: 'ok' })
  status: string;

  @ApiProperty({ example: 'All services are healthy' })
  message: string;

  @ApiProperty({ example: 1711961047123 })
  timestamp: number;
}
