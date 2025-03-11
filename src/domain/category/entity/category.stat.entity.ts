import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '@domain/common/base.entity';
import { MeetingCategoryEnum, MeetingCategoryEnumType } from '@enums/meeting.category.enum';

@Entity()
export class CategoryStat extends BaseEntity {
  @PrimaryGeneratedColumn('increment', {
    name: 'category_id',
  })
  id: number;

  @Column({
    type: 'enum',
    enum: Object.keys(MeetingCategoryEnum),
    nullable: false,
    unique: true,
  })
  category: keyof typeof MeetingCategoryEnum;

  @Column({
    nullable: false,
  })
  totalMemberCount: number;

  @Column({
    nullable: false,
  })
  order: number;

  getCategory(): MeetingCategoryEnumType {
    return MeetingCategoryEnum[this.category];
  }
}
