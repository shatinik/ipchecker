import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { IP } from './ip/entities/ip.entity';
import { IPModule } from './ip/ip.module';

@Module({
  imports: [
    IPModule,
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get('DATABASE_URL'),
        entities: [IP],
        synchronize: false,
      }),
      inject: [ConfigService],
    }),
    HttpModule,
  ],
})
export class AppModule {}
