import { TokenDto } from '@root/service/auth/dto/token.dto';
import { DiscordUserByTokenDto } from '@domain/discord/dto/response/discord.authorized.info.response';

export interface DiscordComponent {
  getTokens(code: string): Promise<TokenDto>;
  getUser(tokens: TokenDto): Promise<DiscordUserByTokenDto>;
}
