import { Schedule } from '@domain/schedule/entity/schedule.entity';
import { ScheduleCreateVO } from '@domain/schedule/vo/schedule.create.vo';

export interface ScheduleComponent {
  findByScheduleId(schedule_id: number): Promise<Schedule | null>;
  findAllByScheduleIds(schedule_ids: number[]): Promise<Schedule[]>;
  create(scheduleCreateVO: ScheduleCreateVO): Promise<Schedule>;
  update(schedule: Schedule): Promise<void>;
  findByMeetingId(meeting_id: number): Promise<Schedule[]>;
  delete(schedule_id: number): Promise<void>;
}
