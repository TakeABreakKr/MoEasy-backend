import { version } from '../../package.json';
import { EnvEnum } from '@enums/env.enum';

export default () => ({
  version,
  host: process.env.HOST || 'http://localhost:5000',
  port: parseInt(process.env.PORT, 10) || 5000,
  env: EnvEnum[process.env.NODE_ENV || 'DEV'],
  auth: {
    ACCESS_TOKEN_SECRET_KEY: process.env.ACCESS_TOKEN_SECRET_KEY || 'M0EaSy_Dev_ACesS_Secret_key',
    REFRESH_TOKEN_SECRET_KEY: process.env.REFRESH_TOKEN_SECRET_KEY || 'M0EaSy_Dev_ReFResh_Secret_key',
  },
  frontend: {
    host: process.env.FRONT_HOST || 'http://localhost:4000',
  },
  AWS: {
    region: process.env.AWS_REGION || '',
    bucket: process.env.BUCKET || '',
    S3_ACCESS_KEY: process.env.AWS_S3_ACCESS_KEY || '',
    S3_SECRET_ACCESS_KEY: process.env.AWS_S3_SECRET_ACCESS_KEY || '',
  },
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 3306,
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '1234',
    database: process.env.DB_DATABASE || 'moeasy',
  },
  discord: {
    host: 'https://discord.com',
    cdnHost: 'https://cdn.discordapp.com',
    token: process.env.DISCORD_TOKEN || '',
    client_id: process.env.DISCORD_CLIENT_ID || '',
    client_secret: process.env.DISCORD_CLIENT_SECRET || '',
  },
  file: {
    dir: process.env.PWD + '/file',
  },
});
