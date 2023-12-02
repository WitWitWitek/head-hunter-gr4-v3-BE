import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export default (config: ConfigService): TypeOrmModuleOptions => ({
  type: 'mysql',
  host: config.get<string>('MYSQL_HOST'),
  port: config.get<number>('MYSQL_PORT'),
  username: config.get<string>('MYSQL_USER'),
  password: config.get<string>('MYSQL_PASSWORD'),
  database: config.get<string>('MYSQL_DATABASE'),
  autoLoadEntities: true,
  logging: true,
  synchronize: true,
});
