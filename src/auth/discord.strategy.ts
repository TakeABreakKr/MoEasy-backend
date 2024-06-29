import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-discord';
import { AuthService } from './auth.service';

@Injectable()
export class DiscordStrategy extends PassportStrategy(Strategy, 'discord') {
    constructor(private authService: AuthService) {
        super({
            clientID: 'YOUR_DISCORD_CLIENT_ID',
            clientSecret: 'YOUR_DISCORD_CLIENT_SECRET',
            callbackURL: 'http://localhost:3000/auth/discord/callback',
            scope: ['identify', 'email'],
        });
    }

    async validate(accessToken: string, refreshToken: string, profile: any, done: Function) {
        const user = await this.authService.validateUser(profile);
        return done(null, user);
    }
}
