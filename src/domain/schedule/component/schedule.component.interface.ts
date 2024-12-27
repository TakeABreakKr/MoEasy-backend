import { ScheduleCreateVO } from '@domain/schedule/vo/schedule.create.vo';
import { Schedule } from '@domain/schedule/entity/schedule.entity';

export interface ScheduleComponent {
  create(scheduleCreateVO: ScheduleCreateVO): Promise<Schedule>;
  findByScheduleId(schedule_id: number): Promise<Schedule | null>;
  update(schedule: Schedule): Promise<void>;
  findAllByScheduleIds(schedule_ids: number[]): Promise<Schedule[]>;
  findByMeetingId(meeting_id: number): Promise<Schedule[]>;
  delete(schedule_id: number): Promise<void>;
}
