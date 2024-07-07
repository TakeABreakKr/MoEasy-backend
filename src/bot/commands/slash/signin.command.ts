import { Command, Handler } from '@discord-nestjs/core';

@Command({
    name: 'signin',
    description: 'Check Discord Account for MoEasy Service Sign in',
})
export class SigninCommand {
    @Handler()
    onPing(): string {
        return 'https://discord.com/oauth2/authorize?client_id=1248807669335330847';
    }
}
