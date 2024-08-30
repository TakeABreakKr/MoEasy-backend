import { OnModuleDestroy } from '@nestjs/common';
import { Redis } from 'ioredis';
import { Constants } from '@utils/constants';

export abstract class RedisRepository implements OnModuleDestroy {
  protected constructor(protected readonly redisClient: Redis) {}

  onModuleDestroy(): void {
    this.redisClient.disconnect();
  }

  protected async get(prefix: string, key: string): Promise<string | null> {
    return this.redisClient.get(this.getKey(prefix, key));
  }

  protected async set(
    prefix: string,
    key: string,
    value: string,
    ttl: number = Constants.ONE_DAY_IN_SECONDS,
  ): Promise<void> {
    await this.redisClient.setex(this.getKey(prefix, key), ttl, value);
  }

  protected async delete(prefix: string, key: string): Promise<void> {
    await this.redisClient.del(`${prefix}:${key}`);
  }

  private getKey(prefix: string, key: string) {
    return `${prefix}:${key}`;
  }
}
