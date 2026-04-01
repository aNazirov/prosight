import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RncLocusMemberEntity } from './entities/rnc-locus-member.entity';
import { RncLocusEntity } from './entities/rnc-locus.entity';
import { LocusController } from './locus.controller';
import { LocusService } from './locus.service';

@Module({
  imports: [TypeOrmModule.forFeature([RncLocusEntity, RncLocusMemberEntity])],
  controllers: [LocusController],
  providers: [LocusService],
})
export class LocusModule {}
