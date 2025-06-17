import { Column } from 'typeorm';
import { SettingsCreateDto } from '@domain/user/dto/settings.create.dto';

export class Settings {
  @Column()
  allowNotificationYn: boolean;

  static create(settingsCreateDto: SettingsCreateDto): Settings {
    const settings = new Settings();
    settings.allowNotificationYn = settingsCreateDto.allowNotificationYn;
    return settings;
  }
}
