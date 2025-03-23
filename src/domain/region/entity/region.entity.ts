import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '@domain/common/base.entity';
import { RegionEnum, RegionEnumType } from '@enums/region.enum';
import { EnumUtil } from '@utils/enum.util';

@Entity()
export class Region extends BaseEntity {
  @PrimaryGeneratedColumn('increment', {
    name: 'region_id',
  })
  id: number;

  @Column({
    type: 'enum',
    enum: Object.keys(RegionEnum),
    nullable: false,
    unique: true,
  })
  name: keyof typeof RegionEnum;

  @Column({
    default: 0,
  })
  count: number;

  public static create(name: RegionEnumType, count: number): Region {
    const region = new Region();
    region.name = EnumUtil.findEnumKeyFromValue<typeof RegionEnum>(RegionEnum, name);
    region.count = count;
    return region;
  }
}
