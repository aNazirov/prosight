import { ApiProperty } from '@nestjs/swagger';

export class HealthV1ResponseDto {
  @ApiProperty({ example: 'ok' })
  status: string;

  @ApiProperty({ example: 1711961047123 })
  timestamp: number;
}
