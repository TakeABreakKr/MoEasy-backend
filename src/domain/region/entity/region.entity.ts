import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '@domain/common/base.entity';
import { RegionEnum } from '@enums/region.enum';

@Entity()
export class Region extends BaseEntity {
  @PrimaryGeneratedColumn()
  region_id: number;

  @Column({
    type: 'enum',
    enum: Object.keys(RegionEnum),
    nullable: false,
    unique: true,
  })
  name: keyof typeof RegionEnum;

  @Column()
  count: number;
}
