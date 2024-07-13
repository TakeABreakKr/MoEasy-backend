export interface DiscordAuthorizedInfoResponse {
  expires: Date;
  user?: DiscordUserByTokenDto;
}

export interface DiscordUserByTokenDto {
  id: string;
  username: string;
  avatar: string;
  discriminator: string;
  global_name: string;
  public_flags: number;
}
