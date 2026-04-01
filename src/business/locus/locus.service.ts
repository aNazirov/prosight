import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { UserRole } from '../../common/config';
import { AuthenticatedUser } from '../../common/types/auth.types';
import {
  GetLocusQueryDto,
  LocusSideload,
  LocusSortBy,
  SortOrder,
} from './dto/get-locus-query.dto';
import { LocusMemberDto } from './dto/locus-member.dto';
import { LocusResponseDto } from './dto/locus-response.dto';
import { RncLocusMemberEntity } from './entities/rnc-locus-member.entity';
import { RncLocusEntity } from './entities/rnc-locus.entity';

const LIMITED_REGION_IDS = [86118093, 86696489, 88186467];

@Injectable()
export class LocusService {
  private readonly logger = new Logger(LocusService.name);

  constructor(
    @InjectRepository(RncLocusEntity)
    private readonly locusRepository: Repository<RncLocusEntity>,
  ) {}

  async getLocus(
    query: GetLocusQueryDto,
    user: AuthenticatedUser,
  ): Promise<LocusResponseDto[]> {
    this.ensureSideloadAllowed(user.role, query.sideload);

    const qb = this.locusRepository
      .createQueryBuilder('locus')
      .select('locus')
      .distinct(true);

    const effectiveRegionIds = this.resolveEffectiveRegionIds(
      user.role,
      query.regionId,
    );
    const needsMemberJoin =
      query.membershipStatus !== undefined || effectiveRegionIds !== undefined;

    if (needsMemberJoin) {
      qb.leftJoin('locus.locusMembers', 'memberFilter');
    }

    this.applyLocusFilters(qb, query, effectiveRegionIds);
    this.applySorting(qb, query.sortBy, query.sortOrder);

    const page = query.page ?? 1;
    const limit = query.limit ?? 1000;

    const loci = await qb
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    if (loci.length === 0) {
      return [];
    }

    const includeMembers = query.sideload === LocusSideload.LocusMembers;
    const isAdmin = user.role === UserRole.Admin;
    const mustLoadMembers = includeMembers || isAdmin;

    let membersByLocusId = new Map<string, RncLocusMemberEntity[]>();

    if (mustLoadMembers) {
      const locusIds = loci.map((entry) => entry.id);
      const membersQb = this.locusRepository
        .createQueryBuilder('locus')
        .leftJoinAndSelect('locus.locusMembers', 'member')
        .where('locus.id IN (:...locusIds)', { locusIds });

      const memberFilteredRegionIds = this.resolveEffectiveRegionIds(
        user.role,
        query.regionId,
      );

      if (memberFilteredRegionIds?.length) {
        membersQb.andWhere('member.regionId IN (:...regionIds)', {
          regionIds: memberFilteredRegionIds,
        });
      }

      if (query.membershipStatus) {
        membersQb.andWhere('member.membershipStatus = :membershipStatus', {
          membershipStatus: query.membershipStatus,
        });
      }

      const lociWithMembers = await membersQb.getMany();
      membersByLocusId = new Map(
        lociWithMembers.map((entry) => [entry.id, entry.locusMembers ?? []]),
      );
    }

    return loci.map((locus) => {
      const members = membersByLocusId.get(locus.id) ?? [];
      return this.toLocusResponse(locus, {
        includeMembers,
        includeExtendedFields: isAdmin,
        members,
      });
    });
  }

  ensureSideloadAllowed(role: UserRole, sideload?: LocusSideload): void {
    if (role === UserRole.Normal && sideload === LocusSideload.LocusMembers) {
      throw new ForbiddenException('Normal user cannot use sideloading');
    }
  }

  resolveEffectiveRegionIds(
    role: UserRole,
    requested?: number[],
  ): number[] | undefined {
    if (role !== UserRole.Limited) {
      return requested;
    }

    if (!requested || requested.length === 0) {
      return LIMITED_REGION_IDS;
    }

    return requested.filter((regionId) =>
      LIMITED_REGION_IDS.includes(regionId),
    );
  }

  private applyLocusFilters(
    qb: SelectQueryBuilder<RncLocusEntity>,
    query: GetLocusQueryDto,
    effectiveRegionIds?: number[],
  ): void {
    if (query.id?.length) {
      qb.andWhere('locus.id IN (:...ids)', { ids: query.id });
    }

    if (query.assemblyId) {
      qb.andWhere('locus.assemblyId = :assemblyId', {
        assemblyId: query.assemblyId,
      });
    }

    if (effectiveRegionIds !== undefined) {
      if (effectiveRegionIds.length === 0) {
        qb.andWhere('1 = 0');
      } else {
        qb.andWhere('memberFilter.regionId IN (:...regionIds)', {
          regionIds: effectiveRegionIds,
        });
      }
    }

    if (query.membershipStatus) {
      qb.andWhere('memberFilter.membershipStatus = :membershipStatus', {
        membershipStatus: query.membershipStatus,
      });
    }
  }

  private applySorting(
    qb: SelectQueryBuilder<RncLocusEntity>,
    sortBy: LocusSortBy,
    sortOrder: SortOrder,
  ): void {
    const sortMap: Record<LocusSortBy, string> = {
      [LocusSortBy.Id]: 'locus.id',
      [LocusSortBy.LocusStart]: 'locus.locusStart',
      [LocusSortBy.MemberCount]: 'locus.memberCount',
    };

    qb.orderBy(sortMap[sortBy], sortOrder.toUpperCase() as 'ASC' | 'DESC');
  }

  private toLocusResponse(
    locus: RncLocusEntity,
    options: {
      includeMembers: boolean;
      includeExtendedFields: boolean;
      members: RncLocusMemberEntity[];
    },
  ): LocusResponseDto {
    const response: LocusResponseDto = {
      id: Number(locus.id),
      assemblyId: locus.assemblyId,
      locusName: locus.locusName,
      publicLocusName: locus.publicLocusName,
      chromosome: locus.chromosome,
      strand: locus.strand,
      locusStart: locus.locusStart,
      locusStop: locus.locusStop,
      memberCount: locus.memberCount,
    };

    if (options.includeExtendedFields && options.members.length > 0) {
      response.ursTaxid = options.members[0].ursTaxid;
    }

    if (options.includeMembers) {
      response.locusMembers = options.members.map((member) =>
        this.toLocusMemberResponse(member),
      );
    }

    return response;
  }

  private toLocusMemberResponse(member: RncLocusMemberEntity): LocusMemberDto {
    return {
      locusMemberId: Number(member.id),
      regionId: member.regionId,
      locusId: Number(member.locusId),
      membershipStatus: member.membershipStatus,
    };
  }
}
