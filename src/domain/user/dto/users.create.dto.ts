import { SettingsCreateDto } from '@domain/user/dto/settings.create.dto';

export interface UsersCreateDto {
  discord_id: string;
  username: string;
  avatar: string;
  email: string;
  explanation: string;
  settings: SettingsCreateDto;
}
