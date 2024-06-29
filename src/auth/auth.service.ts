import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.reository';
import { User } from './user.entity';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserRepository)
        private readonly userRepository: UserRepository,
    ) { }

    async validateUser(profile: any): Promise<User> {
        // Find user by discordId
        const user = await this.userRepository.findOne({ where: { discordId: profile.id } });

        if (!user) {
            // Create new user if not found
            const newUser = new User();
            newUser.discordId = profile.id;
            newUser.username = profile.username;
            newUser.avatar = profile.avatar;
            newUser.email = profile.email;
            await this.userRepository.save(newUser);
            return newUser;
        } else {
            // Update existing user if necessary
            user.username = profile.username;
            user.avatar = profile.avatar;
            user.email = profile.email;
            await this.userRepository.save(user);
            return user;
        }
    }
}
