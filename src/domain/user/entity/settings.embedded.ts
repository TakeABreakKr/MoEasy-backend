import { Column } from 'typeorm';

export class Settings {
  @Column()
  allowNotificationYn: boolean;
}
