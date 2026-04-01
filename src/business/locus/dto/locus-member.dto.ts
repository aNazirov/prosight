import { ApiProperty } from '@nestjs/swagger';

export class LocusMemberDto {
  @ApiProperty({ example: 3106352 })
  locusMemberId: number;

  @ApiProperty({ example: 85682522 })
  regionId: number;

  @ApiProperty({ example: 2470322 })
  locusId: number;

  @ApiProperty({ example: 'member' })
  membershipStatus: string;
}
