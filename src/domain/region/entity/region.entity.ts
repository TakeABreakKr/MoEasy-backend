import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '@domain/common/base.entity';
import { findEnumKeyFromValue, RegionEnum, RegionEnumType } from '@enums/region.enum';
import { ErrorMessageType } from '@enums/error.message.enum';

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

  public static create(name: RegionEnumType): Region {
    const region = new Region();
    region.name = findEnumKeyFromValue(name);
    return region;
  }

  public setCount(count: number): void {
    if (count < 0) {
      throw new Error(ErrorMessageType.REGION_COUNT_INVALID);
    }
    this.count = count;
  }
}
