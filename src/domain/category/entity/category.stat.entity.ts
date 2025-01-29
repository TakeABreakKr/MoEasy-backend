import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from '@domain/common/base.entity';
import { MeetingCategoryEnum, MeetingCategoryEnumType } from '@enums/meeting.category.enum';

@Entity()
export class CategoryStat extends BaseEntity {
  @PrimaryGeneratedColumn()
  category_id: number;

  @Index()
  @Column({
    enum: MeetingCategoryEnum,
    nullable: false,
    unique: true,
  })
  category: MeetingCategoryEnumType;

  @Column({
    nullable: false,
  })
  totalMemberCount: number;

  @Column({
    nullable: false,
  })
  order: number;
}
