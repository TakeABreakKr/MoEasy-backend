import { Command, Handler } from '@discord-nestjs/core';
import configuration from '../../../config/configuration';

@Command({
  name: 'signin',
  description: 'Check Discord Account for MoEasy Service Sign in',
})
export class SigninCommand {
  @Handler()
  onPing(): string {
    return `https://discord.com/oauth2/authorize?client_id=${configuration().discord.client_id}&redirect_uri=${configuration().host}/auth/callback`;
  }
}
