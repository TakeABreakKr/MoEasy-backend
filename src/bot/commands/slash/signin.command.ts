import { Injectable } from '@nestjs/common';
import { Context, SlashCommand, SlashCommandContext } from 'necord';
import configuration from '@config/configuration';
import { DiscordUtil } from '@utils/discord.util';

@Injectable()
export class SigninCommand {
  @SlashCommand({
    name: 'signin',
    description: 'Check Discord Account for MoEasy Service Sign in',
  })
  onSignin(@Context() [interaction]: SlashCommandContext) {
    const clientId: string = configuration().discord.client_id;
    const redirectUri: string = configuration().host + '/auth/callback';
    const content = DiscordUtil.getSignInUrl(clientId, redirectUri);
    return interaction.reply({ content });
  }
}