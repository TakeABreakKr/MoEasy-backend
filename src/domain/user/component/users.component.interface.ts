import { Users } from '@domain/user/entity/users.entity';
import { DiscordProfileDto } from '@service/auth/dto/discord.profile.dto';

export interface UsersComponent {
  findByDiscordId(discordId: string): Promise<Users | null>;
  createUsers(profile: DiscordProfileDto): Promise<Users>;
  findById(id: number): Promise<Users | null>;
  findByIds(userIds: number[]): Promise<Users[]>;
}
