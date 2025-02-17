export class DiscordUtil {
  static getSignInUrl(clientId: string, redirectUri: string): string {
    return `https://discord.com/oauth2/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=identify%20email`;
  }
}
