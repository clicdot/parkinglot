import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TerminusModule } from '@nestjs/terminus';
import { TypeOrmModule } from '@nestjs/typeorm';
import { V1Module } from './api/v1/v1.module';

import * as fs from 'fs-extra';
let config = {};

try {
  if (fs.existsSync(__dirname + '/.env')) {
    config = {
      envFilePath: __dirname + '/.env'
    };
  }
} catch (err) {
  config = {
    ignoreEnvFile: true
  };
}

@Module({
  imports: [
    ConfigModule.forRoot(config),
    TerminusModule,
    V1Module,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'parking_db',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'parking',
      // entities: ['./**/*.entity.ts'],
      entities: ['dist/**/*.entity.{ts,js}'],
      migrationsTableName: 'migration',
      // migrations: [
      //   'dist/migration/**/*.migrations.{.ts,.js}'
      // ],
      cli: {
        migrationsDir: './migration'
      }
      // synchronize: false,
      // ssl: process.env.MODE === 'PRODUCTION' ? true : false
    })
  ],
  controllers: [],
  providers: []
})
export class AppModule {}
