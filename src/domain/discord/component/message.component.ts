import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { APIChannel, APIEmbed, Snowflake } from 'discord.js';
import { MessageComponent } from '@domain/discord/component/message.component.interface';

@Injectable()
export class MessageComponentImpl implements MessageComponent {
  private readonly baseURL: string;

  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {
    this.baseURL = this.configService.get('discord.host');
  }

  public async sendMessage(channelId: string, message?: string, embeds?: APIEmbed[]): Promise<void> {
    await this.httpService.axiosRef.request({
      method: 'post',
      baseURL: this.baseURL,
      url: `/api/v10/channels/${channelId}/messages`,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bot ${this.configService.get('discord.token')}`,
      },
      data: {
        content: message,
        embeds: embeds,
      },
    });
  }

  public async getDMChannel(recipientId: Snowflake): Promise<APIChannel> {
    const response = await this.httpService.axiosRef.request({
      method: 'post',
      baseURL: this.baseURL,
      url: '/api/v10/users/@me/channels',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bot ${this.configService.get('discord.token')}`,
      },
      data: {
        recipient_id: recipientId,
      },
    });
    return response.data;
  }
}
