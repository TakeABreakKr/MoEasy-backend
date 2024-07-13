import { Command, Handler } from '@discord-nestjs/core';
import configuration from '../../../config/configuration';

@Command({
  name: 'signin',
  description: 'Check Discord Account for MoEasy Service Sign in',
})
export class SigninCommand {
  @Handler()
  onPing(): string {
    const clientId: string = configuration().discord.client_id;
    const redirectUri: string = configuration().host + '/auth/callback';
    return `https://discord.com/oauth2/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=relationships.read+identify+email`;
  }
}
