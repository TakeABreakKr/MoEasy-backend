import { SettingsCreateDto } from '@domain/user/dto/settings.create.dto';

export interface UsersCreateDto {
  discordId: string;
  username: string;
  avatar: string;
  email: string;
  explanation: string;
  profileImageId: number;
  settings: SettingsCreateDto;
}
