import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { LocusMemberDto } from './locus-member.dto';

export class LocusResponseDto {
  @ApiProperty({ example: 3106326 })
  id: number;

  @ApiProperty({ example: 'WEWSeq_v.1.0' })
  assemblyId: string;

  @ApiProperty({
    example:
      'cfc38349266a6bc69956bedc917d0edb00069168bf77c8242d50729767e98670@4A/547925668-547987324:1',
  })
  locusName: string;

  @ApiProperty({ example: '432B32430F9FCBB8' })
  publicLocusName: string;

  @ApiProperty({ example: '4A' })
  chromosome: string;

  @ApiProperty({ example: '1' })
  strand: string;

  @ApiProperty({ example: 547925668 })
  locusStart: number;

  @ApiProperty({ example: 547987324 })
  locusStop: number;

  @ApiProperty({ example: 259 })
  memberCount: number;

  @ApiPropertyOptional({ example: 'URS0000A888AB_61622' })
  ursTaxid?: string;

  @ApiPropertyOptional({ type: [LocusMemberDto] })
  locusMembers?: LocusMemberDto[];
}
