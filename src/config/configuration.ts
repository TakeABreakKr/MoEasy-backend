import { version } from '../../package.json';
import { EnvEnum } from '../enums/env.enum';

export default () => ({
  version,
  port: parseInt(process.env.PORT, 10) || 5000,
  env: EnvEnum[process.env.NODE_ENV || 'DEV'],
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
    token: process.env.DISCORD_TOKEN || '',
  },
  file: {
    dir: process.env.PWD + '/file',
  },
});
