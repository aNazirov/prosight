import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export enum LocusSideload {
  LocusMembers = 'locusMembers',
}

export enum LocusSortBy {
  Id = 'id',
  LocusStart = 'locusStart',
  MemberCount = 'memberCount',
}

export enum SortOrder {
  Asc = 'asc',
  Desc = 'desc',
}

function toNumberArray(value: unknown): number[] | undefined {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }

  if (
    !Array.isArray(value) &&
    typeof value !== 'string' &&
    typeof value !== 'number'
  ) {
    return undefined;
  }

  const rawValues = Array.isArray(value)
    ? value
    : String(value)
        .split(',')
        .map((entry) => entry.trim());
  const numbers = rawValues
    .map((entry) => Number(String(entry).trim()))
    .filter((entry) => Number.isInteger(entry));

  return numbers.length ? numbers : undefined;
}

export class GetLocusQueryDto {
  @ApiPropertyOptional({
    description: 'Filter by locus ids',
    type: [Number],
    example: [3106326, 3106352],
  })
  @IsOptional()
  @Transform(({ value }) => toNumberArray(value))
  @IsArray()
  @IsInt({ each: true })
  id?: number[];

  @ApiPropertyOptional({
    description: 'Filter by assembly id',
    example: 'WEWSeq_v.1.0',
  })
  @IsOptional()
  @IsString()
  assemblyId?: string;

  @ApiPropertyOptional({
    description: 'Filter by region ids',
    type: [Number],
    example: [86118093, 86696489],
  })
  @IsOptional()
  @Transform(({ value }) => toNumberArray(value))
  @IsArray()
  @IsInt({ each: true })
  regionId?: number[];

  @ApiPropertyOptional({
    description: 'Filter by membership status',
    example: 'member',
  })
  @IsOptional()
  @IsString()
  membershipStatus?: string;

  @ApiPropertyOptional({
    enum: LocusSideload,
    description: 'Include related data',
  })
  @IsOptional()
  @IsEnum(LocusSideload)
  sideload?: LocusSideload;

  @ApiPropertyOptional({
    description: 'Page number',
    type: Number,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page = 1;

  @ApiPropertyOptional({
    description: 'Rows per page',
    type: Number,
    default: 1000,
    maximum: 5000,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(5000)
  limit = 1000;

  @ApiPropertyOptional({
    enum: LocusSortBy,
    default: LocusSortBy.Id,
  })
  @IsOptional()
  @IsEnum(LocusSortBy)
  sortBy: LocusSortBy = LocusSortBy.Id;

  @ApiPropertyOptional({
    enum: SortOrder,
    default: SortOrder.Asc,
  })
  @IsOptional()
  @IsIn([SortOrder.Asc, SortOrder.Desc])
  sortOrder: SortOrder = SortOrder.Asc;
}
