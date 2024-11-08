import { Injectable } from '@nestjs/common';
import { Context, SlashCommand, SlashCommandContext } from 'necord';
import configuration from '@config/configuration';

@Injectable()
export class SigninCommand {
  @SlashCommand({
    name: 'signin',
    description: 'Check Discord Account for MoEasy Service Sign in',
  })
  onSignin(@Context() [interaction]: SlashCommandContext) {
    const clientId: string = configuration().discord.client_id;
    const redirectUri: string = configuration().host + '/auth/callback';
    const content = `https://discord.com/oauth2/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=relationships.read+identify+email`;
    return interaction.reply({ content });
  }
}
