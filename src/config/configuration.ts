import { version } from '../../package.json';
import { EnvEnum } from '../enums/env.enum';

export default () => ({
  version,
  port: parseInt(process.env.PORT, 10) || 5000,
  host: process.env.HOST || 'localhost',
  env: EnvEnum[process.env.NODE_ENV || 'DEV'],
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 3306,
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '1234',
    database: process.env.DB_DATABASE || 'moeasy',
  },
  discord: {
    token: process.env.DISCORD_TOKEN || '',
    client_id: process.env.DISCORD_CLIENT_ID || '',
  },
});
