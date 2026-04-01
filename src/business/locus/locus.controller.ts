import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/config';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import type { AuthenticatedUser } from '../../common/types/auth.types';
import { GetLocusQueryDto } from './dto/get-locus-query.dto';
import { LocusResponseDto } from './dto/locus-response.dto';
import { LocusService } from './locus.service';

@ApiTags('locus')
@Controller('locus')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class LocusController {
  constructor(private readonly locusService: LocusService) {}

  @Get()
  @Roles(UserRole.Admin, UserRole.Normal, UserRole.Limited)
  @ApiOperation({
    summary: 'Get locus list with filtering and optional sideloading',
  })
  @ApiOkResponse({ type: [LocusResponseDto] })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid JWT token' })
  @ApiForbiddenResponse({
    description: 'Role has no access to requested operation',
  })
  getLocus(
    @Query() query: GetLocusQueryDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<LocusResponseDto[]> {
    return this.locusService.getLocus(query, user);
  }
}
