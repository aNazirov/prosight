import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { RncLocusMemberEntity } from './rnc-locus-member.entity';

@Entity({ schema: 'rnacen', name: 'rnc_locus' })
export class RncLocusEntity {
  @PrimaryColumn({ type: 'bigint' })
  id: string;

  @Column({ name: 'assembly_id', type: 'text' })
  assemblyId: string;

  @Column({ name: 'locus_name', type: 'text' })
  locusName: string;

  @Column({ name: 'public_locus_name', type: 'text' })
  publicLocusName: string;

  @Column({ type: 'text' })
  chromosome: string;

  @Column({ type: 'text' })
  strand: string;

  @Column({ name: 'locus_start', type: 'integer' })
  locusStart: number;

  @Column({ name: 'locus_stop', type: 'integer' })
  locusStop: number;

  @Column({ name: 'member_count', type: 'integer' })
  memberCount: number;

  @OneToMany(() => RncLocusMemberEntity, (member) => member.locus)
  locusMembers?: RncLocusMemberEntity[];
}
