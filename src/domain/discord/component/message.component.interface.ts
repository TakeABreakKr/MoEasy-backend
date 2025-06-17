import { APIChannel, APIEmbed, Snowflake } from 'discord.js';

export interface MessageComponent {
  sendMessage(channelId: string, message?: string, embeds?: APIEmbed[]): Promise<void>;
  getDMChannel(recipientId: Snowflake): Promise<APIChannel>;
}
