interface DiscordAuthorizedApplicationDto {
  id: string;
  name: string;
  icon: string;
  description: string;
  hook: boolean;
  bot_public: boolean;
  bot_require_code_grant: boolean;
  verify_key: string;
}

export interface DiscordUserByTokenDto {
  id: string;
  username: string;
  avatar: string;
  discriminator: string;
  global_name: string;
  public_flags: number;
  email?: string;
}

export interface DiscordAuthorizedInfoResponse {
  application: DiscordAuthorizedApplicationDto;
  scopes: string[];
  expires: Date;
  user?: DiscordUserByTokenDto;
}
