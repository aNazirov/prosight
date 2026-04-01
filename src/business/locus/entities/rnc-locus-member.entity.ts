import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { RncLocusEntity } from './rnc-locus.entity';

@Entity({ schema: 'rnacen', name: 'rnc_locus_members' })
export class RncLocusMemberEntity {
  @PrimaryColumn({ type: 'bigint' })
  id: string;

  @Column({ name: 'urs_taxid', type: 'text' })
  ursTaxid: string;

  @Column({ name: 'region_id', type: 'integer' })
  regionId: number;

  @Column({ name: 'locus_id', type: 'bigint' })
  locusId: string;

  @Column({ name: 'membership_status', type: 'text' })
  membershipStatus: string;

  @ManyToOne(() => RncLocusEntity, (locus) => locus.locusMembers)
  @JoinColumn({ name: 'locus_id', referencedColumnName: 'id' })
  locus?: RncLocusEntity;
}
