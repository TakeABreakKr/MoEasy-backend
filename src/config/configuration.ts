import { version } from '../../package.json';
import { envEnum } from '../enums/env.enum';

export default () => ({
  version,
  port: parseInt(process.env.PORT, 10) || 5000,
  env: envEnum[process.env.NODE_ENV || 'DEV'],
  discord: {
    token: process.env.DISCORD_TOKEN || '',
  },
});
