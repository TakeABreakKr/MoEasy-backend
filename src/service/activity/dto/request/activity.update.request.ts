import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

import { ActivityRequest } from '@service/activity/dto/request/base.activity.request';

export class ActivityUpdateRequest extends ActivityRequest {
  @ApiProperty()
  @IsNotEmpty()
  activityId: number;
}
