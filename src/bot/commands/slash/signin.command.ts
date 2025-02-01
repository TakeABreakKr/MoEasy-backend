import { Command, Handler } from '@discord-nestjs/core';
import configuration from '@config/configuration';
import { DiscordUtil } from '@utils/discord.util';

@Command({
  name: 'signin',
  description: 'Check Discord Account for MoEasy Service Sign in',
})
export class SigninCommand {
  @Handler()
  onPing(): string {
    const clientId: string = configuration().discord.client_id;
    const redirectUri: string = configuration().host + '/auth/callback';
    return DiscordUtil.getSignInUrl(clientId, redirectUri);
  }
}
